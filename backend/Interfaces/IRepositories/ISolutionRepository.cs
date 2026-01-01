using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces.IRepositories
{
    public interface ISolutionRepository
    {
        Task<Solution?> GetByIdAsync(Guid id, bool includeDeleted = false);
        Task<Solution?> GetByIdWithDetailsAsync(Guid id, string? userId = null);
        Task<List<Solution>> GetByProblemIdAsync(Guid problemId, string? userId = null);
        Task<List<Solution>> GetByUserIdAsync(string userId);
        Task<Solution> CreateAsync(Solution solution);
        Task<Solution> UpdateAsync(Solution solution);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AcceptSolutionAsync(Guid solutionId, Guid problemId);
        Task<SolutionVote?> GetUserVoteAsync(Guid solutionId, string userId);
        Task<SolutionVote> CreateVoteAsync(SolutionVote vote);
        Task<SolutionVote> UpdateVoteAsync(SolutionVote vote);
        Task<bool> DeleteVoteAsync(Guid solutionId, string userId);
        Task UpdateVoteCountAsync(Guid solutionId);
    }
}