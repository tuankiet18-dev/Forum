using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Problem;
using backend.Models;

namespace backend.Interfaces.IRepositories
{
    public interface IProblemRepository
    {
        Task<Problem?> GetByIdAsync(Guid id, bool includeDeleted = false);
        Task<Problem?> GetByIdWithSolutionsAsync(Guid id);
        Task<(List<Problem> Items, int TotalCount)> GetAllAsync(ProblemFilterDto filter);
        Task<List<Problem>> GetByUserIdAsync(string userId);
        Task<Problem> CreateAsync(Problem problem);
        Task<Problem> UpdateAsync(Problem problem);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> IncrementViewCountAsync(Guid id);
    }
}