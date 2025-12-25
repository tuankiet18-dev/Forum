using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Common;
using backend.Dtos.Problem;

namespace backend.Interfaces.IServices
{
    public interface IProblemService
    {
        Task<(bool Success, ProblemDto? Data, string Error)> CreateProblemAsync(string userId, CreateProblemDto dto);
        Task<(bool Success, ProblemDto? Data, string Error)> UpdateProblemAsync(Guid id, string userId, UpdateProblemDto dto);
        Task<(bool Success, string Error)> DeleteProblemAsync(Guid id, string userId);
        Task<(bool Success, ProblemDetailDto? Data, string Error)> GetProblemByIdAsync(Guid id);
        Task<PaginatedResultDto<ProblemDto>> GetProblemsAsync(ProblemFilterDto filter);
        Task<List<ProblemDto>> GetUserProblemsAsync(string userId);
    }
}