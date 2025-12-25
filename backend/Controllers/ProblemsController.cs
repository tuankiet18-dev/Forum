using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos;
using backend.Dtos.Problem;
using backend.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/problems")]
    public class ProblemsController : ControllerBase
    {
        private readonly IProblemService _problemService;
        private readonly ILogger<ProblemsController> _logger;

        public ProblemsController(IProblemService problemService, ILogger<ProblemsController> logger)
        {
            _problemService = problemService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProblem(Guid id)
        {
            var (success, data, error) = await _problemService.GetProblemByIdAsync(id);

            if (!success)
            {
                return NotFound(ApiResponse<ProblemDetailDto>.ErrorResponse(error));
            }

            return Ok(ApiResponse<ProblemDetailDto>.SuccessResponse(data!, "Problem retrieved successfully"));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProblem([FromBody] CreateProblemDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<ProblemDto>.ErrorResponse("validation failed", errors));
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<ProblemDto>.ErrorResponse("Unauthorized"));
            }

            var (success, data, error) = await _problemService.CreateProblemAsync(userId, dto);
            if (!success)
            {
                return BadRequest(ApiResponse<ProblemDto>.ErrorResponse(error));
            }
            return CreatedAtAction(nameof(GetProblem), new { id = data!.Id },
                ApiResponse<ProblemDto>.SuccessResponse(data, "Problem created successfully"));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProblem(Guid id, [FromBody] UpdateProblemDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<ProblemDto>.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<ProblemDto>.ErrorResponse("Unauthorized"));
            }

            var (success, data, error) = await _problemService.UpdateProblemAsync(id, userId, dto);

            if (!success)
            {
                return BadRequest(ApiResponse<ProblemDto>.ErrorResponse(error));
            }

            return Ok(ApiResponse<ProblemDto>.SuccessResponse(data!, "Problem updated successfully"));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProblem(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));
            }

            var (success, error) = await _problemService.DeleteProblemAsync(id, userId);

            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(error));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Problem deleted successfully"));
        }

        [HttpGet]
        public async Task<IActionResult> GetProblems([FromQuery] ProblemFilterDto filter)
        {
            var result = await _problemService.GetProblemsAsync(filter);
            return Ok(ApiResponse<object>.SuccessResponse(result, "Problems retrieved successfully"));
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserProblems(string userId)
        {
            var problems = await _problemService.GetUserProblemsAsync(userId);
            return Ok(ApiResponse<List<ProblemDto>>.SuccessResponse(problems,
                "User problems retrieved successfully"));
        }

        [HttpGet("my-problems")]
        [Authorize]
        public async Task<IActionResult> GetMyProblems()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<List<ProblemDto>>.ErrorResponse("Unauthorized"));
            }

            var problems = await _problemService.GetUserProblemsAsync(userId);
            return Ok(ApiResponse<List<ProblemDto>>.SuccessResponse(problems,
                "Your problems retrieved successfully"));
        }
    }
}