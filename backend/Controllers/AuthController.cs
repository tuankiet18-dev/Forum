using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos;
using backend.Dtos.Auth;
using backend.Interfaces.IServices;
using Backend.Interfaces.IServices;
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
        public async Task<IActionResult> GetCurrentUserAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid token"));
            }

            var (success, data, error) = await _authService.GetUserInfoById(userId);

            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Get current user failed"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(data, "User retrieved successfully"));
        }

        [HttpPost("upload-avatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarDto uploadDto)
        {
            if (uploadDto.File == null || uploadDto.File.Length == 0)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("File is empty"));
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<string>.ErrorResponse("Unauthorized"));
            }

            var (success, avatarUrl, error) = await _authService.UpdateUserAvatarAsync(userId, uploadDto.File);

            if (!success)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(error));
            }

            return Ok(ApiResponse<string>.SuccessResponse(avatarUrl!, "Avatar updated successfully"));
        }

        [HttpPut("edit-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileEditDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));

            var (success, error) = await _authService.UpdateProfileAsync(userId, dto);
            if (!success) return BadRequest(ApiResponse<object>.ErrorResponse(error));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Profile updated successfully"));
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized(ApiResponse<object>.ErrorResponse("Unauthorized"));

            var (success, error) = await _authService.ChangePasswordAsync(userId, dto);
            if (!success) return BadRequest(ApiResponse<object>.ErrorResponse(error));

            return Ok(ApiResponse<object>.SuccessResponse(null, "Password changed successfully"));
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfileById([FromRoute] string userId)
        {
            var (success, data, error) = await _authService.GetUserInfoById(userId);
            if (!success)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Get current user failed"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(data, "User retrieved successfully"));
        }
    }
}