using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos;
using backend.Dtos.Auth;
using backend.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                var Errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Validation failed", Errors));
            }

            var (success, data, errors) = await _authService.RegisterAsync(registerDto);

            if (!success)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Registration failed", errors));
            }

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(data!, "Registration successful"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Validation failed", errors));
            }

            var (success, data, error) = await _authService.LoginAsync(loginDto);

            if (!success)
            {
                return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse(error));
            }

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(data!, "Login successful"));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<TokenDto>.ErrorResponse("Invalid token data"));
            }

            var (success, data, error) = await _authService.RefreshTokenAsync(refreshTokenDto);

            if (!success)
            {
                return Unauthorized(ApiResponse<TokenDto>.ErrorResponse(error));
            }

            return Ok(ApiResponse<TokenDto>.SuccessResponse(data!, "Token refreshed successfully"));
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid token"));
            }

            var success = await _authService.RevokeTokenAsync(userId);

            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Logout failed"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Logout successful"));
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var fullName = User.FindFirst("FullName")?.Value;
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            var userData = new
            {
                UserId = userId,
                Username = username,
                Email = email,
                FullName = fullName,
                Roles = roles
            };

            return Ok(ApiResponse<object>.SuccessResponse(userData, "User retrieved successfully"));
        }
    }
}