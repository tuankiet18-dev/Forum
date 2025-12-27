using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Auth;

namespace backend.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<(bool Success, AuthResponseDto? Data, List<string> Errors)> RegisterAsync(RegisterDto registerDto);
        Task<(bool Success, AuthResponseDto? Data, string Error)> LoginAsync(LoginDto loginDto);
        Task<(bool Success, TokenDto? Data, string Error)> RefreshTokenAsync(RefreshTokenDto refreshTokenDto);
        Task<(bool Success, UserInfo? Data, string Error)> GetUserInfoById(string userId);
        Task<(bool Success, string? AvatarUrl, string Error)> UpdateUserAvatarAsync(string userId, IFormFile file);
        Task<bool> RevokeTokenAsync(string userId);
        Task<(bool Success, string Error)> UpdateProfileAsync(string userId, ProfileEditDto dto);
        Task<(bool Success, string Error)> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    }
}