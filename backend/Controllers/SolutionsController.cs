using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos;
using backend.Dtos.Solution;
using backend.Interfaces.IServices;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/solutions")]
    public class SolutionsController : ControllerBase
    {
        private readonly ISolutionService _solutionService;
        private readonly ILogger<SolutionsController> _logger;

        public SolutionsController(
            ISolutionService solutionService,
            ILogger<SolutionsController> logger)
        {
            _solutionService = solutionService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSolution(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var (success, data, error) = await _solutionService.GetSolutionByIdAsync(id, userId);
    
            if (!success)
            {
                return NotFound(ApiResponse<SolutionDto>.ErrorResponse(error));
            }

            return Ok(ApiResponse<SolutionDto>.SuccessResponse(data!, "Solution retrieved successfully"));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateSolution([FromBody] CreateSolutionDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<SolutionDto>.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<SolutionDto>.ErrorResponse("Unauthorized"));
            }

            var (success, data, error) = await _solutionService.CreateSolutionAsync(userId, dto);

            if (!success)
            {
                return BadRequest(ApiResponse<SolutionDto>.ErrorResponse(error));
            }

            return CreatedAtAction(nameof(GetSolution), new { id = data!.Id },
                ApiResponse<SolutionDto>.SuccessResponse(data, "Solution created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSolution(Guid id, [FromBody] UpdateSolutionDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<SolutionDto>.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<SolutionDto>.ErrorResponse("Unauthorized"));
            }

            var (success, data, error) = await _solutionService.UpdateSolutionAsync(id, userId, dto);

            if (!success)
            {
                return BadRequest(ApiResponse<SolutionDto>.ErrorResponse(error));
            }

            return Ok(ApiResponse<SolutionDto>.SuccessResponse(data!, "Solution updated successfully"));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSolution(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));
            }

            var (success, error) = await _solutionService.DeleteSolutionAsync(id, userId);

            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(error));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Solution deleted successfully"));
        }

        [HttpGet("problem/{problemId}")]
        public async Task<IActionResult> GetSolutionsByProblem(Guid problemId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var solutions = await _solutionService.GetSolutionsByProblemIdAsync(problemId, userId);
            return Ok(ApiResponse<List<SolutionDto>>.SuccessResponse(solutions,
                "Solutions retrieved successfully"));
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserSolutions(string userId)
        {
            var solutions = await _solutionService.GetUserSolutionsAsync(userId);
            return Ok(ApiResponse<List<SolutionDto>>.SuccessResponse(solutions,
                "User solutions retrieved successfully"));
        }

        [HttpGet("my-solutions")]
        [Authorize]
        public async Task<IActionResult> GetMySolutions()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<List<SolutionDto>>.ErrorResponse("Unauthorized"));
            }

            var solutions = await _solutionService.GetUserSolutionsAsync(userId);
            return Ok(ApiResponse<List<SolutionDto>>.SuccessResponse(solutions,
                "Your solutions retrieved successfully"));
        }

        [HttpPost("{id}/accept")]
        [Authorize]
        public async Task<IActionResult> AcceptSolution(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));
            }

            var (success, error) = await _solutionService.AcceptSolutionAsync(id, userId);

            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(error));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Solution accepted successfully"));
        }

        [HttpPost("vote")]
        [Authorize]
        public async Task<IActionResult> VoteSolution([FromBody] VoteSolutionDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));
            }

            var (success, voteCount, error) = await _solutionService.VoteSolutionAsync(userId, dto);

            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(error));
            }

            return Ok(ApiResponse<object>.SuccessResponse(
                new { VoteCount = voteCount },
                "Vote recorded successfully"));
        }

        [HttpDelete("{id}/vote")]
        [Authorize]
        public async Task<IActionResult> RemoveVote(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));
            }

            var (success, error) = await _solutionService.DeleteSolutionAsync(id, userId);

            if(!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(error));
            }
            
            return Ok(ApiResponse<object>.SuccessResponse(null, "Vote removed successfully"));
        }
    }
}