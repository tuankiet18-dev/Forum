using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using backend.Dtos.Auth;
using backend.Interfaces.IRepositories;
using backend.Interfaces.IServices;
using backend.Models;
using Backend.Interfaces.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Formatters.Xml;
using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthService> _logger;
        private readonly IPhotoService _photoService;
        public AuthService(
            IAuthRepository authRepository,
            ITokenService tokenService,
            ILogger<AuthService> logger,
            IPhotoService photoService)
        {
            _authRepository = authRepository;
            _tokenService = tokenService;
            _logger = logger;
            _photoService = photoService;
        }

        public async Task<(bool Success, AuthResponseDto? Data, List<string> Errors)> RegisterAsync(RegisterDto registerDto)
        {
            var errors = new List<string>();
            try
            {
                // Create new user
                var user = new ApplicationUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    FullName = registerDto.FullName,
                    CreateAt = DateTime.UtcNow,
                    Reputation = 0
                };

                var result = await _authRepository.CreateUserAsync(user, registerDto.Password);
                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        errors.Add(error.Description);
                    }
                    return (false, null, errors);
                }

                await _authRepository.AddToRoleAsync(user, "User");
                var tokens = await _tokenService.CreateTokensAsync(user);
                var roles = await _authRepository.GetUserRolesAsync(user);

                var response = new AuthResponseDto
                {
                    UserId = user.Id,
                    Username = user.UserName!,
                    Email = user.Email!,
                    FullName = user.FullName,
                    Avatar = user.Avatar,
                    Reputation = user.Reputation,
                    Roles = roles.ToList(),
                    Tokens = tokens
                };
                _logger.LogInformation($"User {user.UserName} registered successfully");
                return (true, response, errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during registration");
                errors.Add("An error occurred during registration");
                return (false, null, errors);
            }
        }

        public async Task<(bool Success, AuthResponseDto? Data, string Error)> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _authRepository.GetUserByUsernameAsync(loginDto.Username);
                if (user == null)
                {
                    return (false, null, "Invalid username or password");
                }

                var isPasswordValid = await _authRepository.CheckPasswordAsync(user, loginDto.Password);
                if (!isPasswordValid)
                {
                    return (false, null, "Invalid email or password");
                }

                user.LastLoginAt = DateTime.UtcNow;
                await _authRepository.UpdateUserAsync(user);

                var tokens = await _tokenService.CreateTokensAsync(user);
                var roles = await _authRepository.GetUserRolesAsync(user);

                var response = new AuthResponseDto
                {
                    UserId = user.Id,
                    Username = user.UserName!,
                    Email = user.Email!,
                    FullName = user.FullName,
                    Avatar = user.Avatar,
                    Reputation = user.Reputation,
                    Roles = roles.ToList(),
                    Tokens = tokens
                };

                _logger.LogInformation("User {Username} logged in successfully", user.UserName);
                return (true, response, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login");
                return (false, null, "An error occurred during login");
            }
        }

        public async Task<(bool Success, TokenDto? Data, string Error)> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
        {
            try
            {
                // Validate access token
                var principal = _tokenService.GetPrincipalFromExpiredToken(refreshTokenDto.AccessToken);
                if (principal == null)
                {
                    return (false, null, "Invalid access token");
                }

                var userId = principal.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return (false, null, "Invalid token claims");
                }

                // Get user
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return (false, null, "User not found");
                }

                // Validate refresh token
                if (user.RefreshToken != refreshTokenDto.RefreshToken)
                {
                    return (false, null, "Invalid refresh token");
                }

                if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                {
                    return (false, null, "Refresh token expired");
                }

                // Generate new tokens
                var tokens = await _tokenService.CreateTokensAsync(user);

                _logger.LogInformation("Tokens refreshed for user {Username}", user.UserName);
                return (true, tokens, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during token refresh");
                return (false, null, "An error occurred during token refresh");
            }
        }

        public async Task<bool> RevokeTokenAsync(string userId)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return false;
                }

                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _authRepository.UpdateUserAsync(user);

                _logger.LogInformation("Token revoked for user {Username}", user.UserName);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during token revocation");
                return false;
            }
        }

        public async Task<(bool Success, UserInfo? Data, string Error)> GetUserInfoById(string userId)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return (false, null, "An error occurred during get user infomation");
                }

                var userInfo = new UserInfo
                {
                    UserId = userId,
                    Username = user.UserName!,
                    Email = user.Email!,
                    FullName = user.FullName,
                    Avatar = user.Avatar,
                    Reputation = user.Reputation,
                    CreatedAt = user.CreateAt.ToString("dd/MM/yyyy")
                };

                _logger.LogInformation("Get information for user {Username}", user.UserName);
                return (true, userInfo, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during get user infomation");
                return (false, null, "An error occurred during get user infomation");
            }
        }

        public async Task<(bool Success, string? AvatarUrl, string Error)> UpdateUserAvatarAsync(string userId, IFormFile file)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return (false, null, "User not found");
                }

                var uploadResult = await _photoService.AddPhotoAsync(file, "forum/avatars", true);

                if (uploadResult.Error != null)
                {
                    return (false, null, uploadResult.Error.Message);
                }

                user.Avatar = uploadResult.SecureUrl.AbsoluteUri;

                // Lưu xuống DB
                var updated = await _authRepository.UpdateUserAsync(user);
                if (!updated)
                {
                    return (false, null, "Failed to update user avatar in database");
                }

                _logger.LogInformation("Avatar updated for user {Username}", user.UserName);
                return (true, user.Avatar, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading avatar");
                return (false, null, "An error occurred while uploading avatar");
            }
        }

        public async Task<(bool Success, string Error)> UpdateProfileAsync(string userId, ProfileEditDto dto)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null) return (false, "User not found");

                if (!string.IsNullOrEmpty(dto.FullName))
                {
                    user.FullName = dto.FullName;
                }

                var updated = await _authRepository.UpdateUserAsync(user);
                if (!updated) return (false, "Failed to update profile");

                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                return (false, "An error occurred");
            }
        }

        public async Task<(bool Success, string Error)> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(userId);
                if (user == null) return (false, "User not found");

                var result = await _authRepository.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

                if (!result.Succeeded)
                {
                    // Lấy lỗi đầu tiên để trả về cho gọn
                    var error = result.Errors.FirstOrDefault()?.Description ?? "Failed to change password";
                    return (false, error);
                }

                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return (false, "An error occurred");
            }
        }
    }
}