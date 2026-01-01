using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Solution;

namespace backend.Interfaces.IServices
{
    public interface ISolutionService
    {
        Task<(bool Success, SolutionDto? Data, string Error)> CreateSolutionAsync(string userId, CreateSolutionDto dto);
        Task<(bool Success, SolutionDto? Data, string Error)> UpdateSolutionAsync(Guid id, string userId, UpdateSolutionDto dto);
        Task<(bool Success, string Error)> DeleteSolutionAsync(Guid id, string userId);
        Task<(bool Success, SolutionDto? Data, string Error)> GetSolutionByIdAsync(Guid id, string? userId = null);
        Task<List<SolutionDto>> GetSolutionsByProblemIdAsync(Guid problemId, string? userId = null);
        Task<List<SolutionDto>> GetUserSolutionsAsync(string userId);
        Task<(bool Success, string Error)> AcceptSolutionAsync(Guid solutionId, string userId);
        Task<(bool Success, int VoteCount, string Error)> VoteSolutionAsync(string userId, VoteSolutionDto dto);
        Task<(bool Success, string Error)> RemoveVoteAsync(Guid solutionId, string userId);
    }
}