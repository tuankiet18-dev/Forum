using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using backend.Dtos.Common;
using backend.Dtos.Problem;
using backend.Dtos.Solution;
using backend.Interfaces.IRepositories;
using backend.Interfaces.IServices;
using backend.Models;

namespace backend.Services
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;
        private readonly ILogger<ProblemService> _logger;

        public ProblemService(IProblemRepository problemRepository, ILogger<ProblemService> logger)
        {
            _problemRepository = problemRepository;
            _logger = logger;
        }

        public async Task<(bool Success, ProblemDto? Data, string Error)> CreateProblemAsync(string userId, CreateProblemDto dto)
        {
            try
            {
                var problem = new Problem
                {
                    UserId = userId,
                    Title = dto.Title,
                    Content = dto.Content,
                    Category = dto.Category,
                    Difficulty = dto.Difficulty,
                    Tags = dto.Tags != null && dto.Tags.Any() ? JsonSerializer.Serialize(dto.Tags) : null,
                    CreatedAt = DateTime.UtcNow
                };

                var createdProblem = await _problemRepository.CreateAsync(problem);
                var problemWithUser = await _problemRepository.GetByIdAsync(createdProblem.Id);
                var result = MapToProblemDto(problemWithUser!);
                _logger.LogInformation("Problem {ProblemId} created by user {UserId}",
                createdProblem.Id, userId);

                return (true, result, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating problem");
                return (false, null, "An error occurred while creating the problem");
            }
        }

        public async Task<(bool Success, string Error)> DeleteProblemAsync(Guid id, string userId)
        {
            try
            {
                var problem = await _problemRepository.GetByIdAsync(id);
                if (problem == null)
                {
                    return (false, "Problem not found");
                }

                if (problem.UserId != userId)
                {
                    return (false, "You don't have permission to delete this problem");
                }

                var deleted = await _problemRepository.DeleteAsync(id);
                if (!deleted)
                {
                    return (false, "Failed to delete problem");
                }

                _logger.LogInformation("Problem {ProblemId} deleted by user {UserId}", id, userId);

                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting problem {ProblemId}", id);
                return (false, "An error occurred while deleting the problem");
            }
        }

        public async Task<(bool Success, ProblemDetailDto? Data, string Error)> GetProblemByIdAsync(Guid id)
        {
            try
            {
                var problem = await _problemRepository.GetByIdWithSolutionsAsync(id);
                if (problem == null)
                {
                    return (false, null, "Problem not found");
                }

                // Increment view count
                await _problemRepository.IncrementViewCountAsync(id);

                var result = MapToProblemDetailDto(problem);

                return (true, result, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting problem {ProblemId}", id);
                return (false, null, "An error occurred while retrieving the problem");
            }
        }

        public async Task<PaginatedResultDto<ProblemDto>> GetProblemsAsync(ProblemFilterDto filter)
        {
            var (items, totalCount) = await _problemRepository.GetAllAsync(filter);

            var problemDtos = items.Select(MapToProblemDto).ToList();

            var totalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize);

            return new PaginatedResultDto<ProblemDto>
            {
                Items = problemDtos,
                TotalCount = totalCount,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.Page > 1,
                HasNextPage = filter.Page < totalPages
            };

        }

        public async Task<List<ProblemDto>> GetUserProblemsAsync(string userId)
        {
            var problems = await _problemRepository.GetByUserIdAsync(userId);
            return problems.Select(MapToProblemDto).ToList();
        }

        public async Task<(bool Success, ProblemDto? Data, string Error)> UpdateProblemAsync(Guid id, string userId, UpdateProblemDto dto)
        {
            try
            {
                var problem = await _problemRepository.GetByIdAsync(id);
                if (problem == null)
                {
                    return (false, null, "Problem not found");
                }

                if (problem.UserId != userId)
                {
                    return (false, null, "You don't have permission to update this problem");
                }

                // Update fields if provided
                if (!string.IsNullOrWhiteSpace(dto.Title))
                    problem.Title = dto.Title;

                if (!string.IsNullOrWhiteSpace(dto.Content))
                    problem.Content = dto.Content;

                if (dto.Category != null)
                    problem.Category = dto.Category;

                if (dto.Difficulty != null)
                    problem.Difficulty = dto.Difficulty;

                if (dto.Tags != null)
                    problem.Tags = dto.Tags.Any()
                        ? JsonSerializer.Serialize(dto.Tags)
                        : null;

                var updatedProblem = await _problemRepository.UpdateAsync(problem);
                var result = MapToProblemDto(updatedProblem);

                _logger.LogInformation("Problem {ProblemId} updated by user {UserId}", id, userId);

                return (true, result, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating problem {ProblemId}", id);
                return (false, null, "An error occurred while updating the problem");
            }
        }

        // Helper methods
        private ProblemDto MapToProblemDto(Problem problem)
        {
            return new ProblemDto
            {
                Id = problem.Id,
                UserId = problem.UserId,
                Username = problem.User?.UserName ?? "Unknown",
                UserAvatar = problem.User?.Avatar,
                Title = problem.Title,
                Content = problem.Content,
                Category = problem.Category,
                Difficulty = problem.Difficulty,
                Tags = !string.IsNullOrWhiteSpace(problem.Tags)
                    ? JsonSerializer.Deserialize<List<string>>(problem.Tags) ?? new List<string>()
                    : new List<string>(),
                ViewCount = problem.ViewCount,
                SolutionCount = problem.Solutions?.Count ?? 0,
                HasAcceptedSolution = problem.Solutions?.Any(s => s.IsAccepted) ?? false,
                CreatedAt = problem.CreatedAt,
                UpdatedAt = problem.UpdatedAt
            };
        }

        private ProblemDetailDto MapToProblemDetailDto(Problem problem)
        {
            return new ProblemDetailDto
            {
                Id = problem.Id,
                UserId = problem.UserId,
                Username = problem.User?.UserName ?? "Unknown",
                UserAvatar = problem.User?.Avatar,
                UserReputation = problem.User?.Reputation ?? 0,
                Title = problem.Title,
                Content = problem.Content,
                Category = problem.Category,
                Difficulty = problem.Difficulty,
                Tags = !string.IsNullOrWhiteSpace(problem.Tags)
                    ? JsonSerializer.Deserialize<List<string>>(problem.Tags) ?? new List<string>()
                    : new List<string>(),
                ViewCount = problem.ViewCount,
                CreatedAt = problem.CreatedAt,
                UpdatedAt = problem.UpdatedAt,
                Solutions = problem.Solutions?
                    .OrderByDescending(s => s.IsAccepted)
                    .ThenByDescending(s => s.VoteCount)
                    .Select(s => new SolutionDto
                    {
                        Id = s.Id,
                        ProblemId = s.ProblemId,
                        UserId = s.UserId,
                        Username = s.User?.UserName ?? "Unknown",
                        UserAvatar = s.User?.Avatar,
                        Content = s.Content,
                        IsAccepted = s.IsAccepted,
                        VoteCount = s.VoteCount,
                        CreatedAt = s.CreatedAt,
                        UpdatedAt = s.UpdatedAt
                    })
                    .ToList() ?? new List<SolutionDto>()
            };
        }
    }
}