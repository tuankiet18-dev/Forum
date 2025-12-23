using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos.Auth;
using backend.Models;

namespace backend.Interfaces.IServices
{
    public interface ITokenService
    {
        Task<TokenDto> CreateTokensAsync(ApplicationUser user);
        Task<string> GenerateAccessTokenAsync(ApplicationUser user);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}