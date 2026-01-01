using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Dtos.Solution;
using backend.Interfaces.IRepositories;
using backend.Interfaces.IServices;
using backend.Models;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace backend.Services
{
    public class SolutionService : ISolutionService
    {
        private readonly ISolutionRepository _solutionRepository;
        private ILogger<SolutionService> _logger;
        private readonly IProblemRepository _problemRepository;

        public SolutionService(
        ISolutionRepository solutionRepository,
        IProblemRepository problemRepository,
        ILogger<SolutionService> logger)
        {
            _solutionRepository = solutionRepository;
            _problemRepository = problemRepository;
            _logger = logger;
        }

        public async Task<(bool Success, string Error)> AcceptSolutionAsync(Guid solutionId, string userId)
        {
            try
            {
                var solution = await _solutionRepository.GetByIdAsync(solutionId);
                if (solution == null)
                {
                    return (false, "Solution not found");
                }

                // Check if user is the problem owner
                var problem = await _problemRepository.GetByIdAsync(solution.ProblemId);
                if (problem == null)
                {
                    return (false, "Problem not found");
                }

                if (problem.UserId != userId)
                {
                    return (false, "Only the problem owner can accept solutions");
                }

                var accepted = await _solutionRepository.AcceptSolutionAsync(solutionId, solution.ProblemId);
                if (!accepted)
                {
                    return (false, "Failed to accept solution");
                }

                _logger.LogInformation("Solution {SolutionId} accepted for problem {ProblemId} by user {UserId}",
                    solutionId, solution.ProblemId, userId);

                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accepting solution {SolutionId}", solutionId);
                return (false, "An error occurred while accepting the solution");
            }
        }

        public async Task<(bool Success, SolutionDto? Data, string Error)> CreateSolutionAsync(string userId, CreateSolutionDto dto)
        {
            try
            {
                // check if problem exist
                var problem = await _problemRepository.GetByIdAsync(dto.ProblemId);
                if (problem == null)
                {
                    return (false, null, "Problem not found");
                }

                var solution = new Solution
                {
                    ProblemId = dto.ProblemId,
                    UserId = userId,
                    Content = dto.Content,
                    Steps = dto.Steps != null && dto.Steps.Any() ? JsonSerializer.Serialize(dto.Steps) : null,
                    CreatedAt = DateTime.UtcNow,
                    VoteCount = 0
                };

                var createdSolution = await _solutionRepository.CreateAsync(solution);

                // reload with user info
                var solutionWithDetails = await _solutionRepository.GetByIdWithDetailsAsync(createdSolution.Id, userId);
                var result = MapToSolutionDto(solutionWithDetails!, userId);

                _logger.LogInformation("Solution {SolutionId} created for problem {ProblemId} by user {UserId}",
                    createdSolution.Id, dto.ProblemId, userId);

                return (true, result, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating solution");
                return (false, null, "An error occurred while creating the solution");
            }
        }

        public async Task<(bool Success, string Error)> DeleteSolutionAsync(Guid id, string userId)
        {
            try
            {
                var solution = await _solutionRepository.GetByIdAsync(id);
                if (solution == null) return (false, "Solution not found");

                if (solution.UserId != userId) return (false, "You don't have permission to delete this solution");

                var deleted = await _solutionRepository.DeleteAsync(id);
                if (!deleted) return (false, "Fail to delete solution");

                _logger.LogInformation("Solution {SolutionId} deleted by user {UserId}", id, userId);
                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting solution {SolutionId}", id);
                return (false, "An error occurred while deleting the solution");
            }
        }

        public async Task<(bool Success, SolutionDto? Data, string Error)> GetSolutionByIdAsync(Guid id, string? userId = null)
        {
            try
            {
                var solution = await _solutionRepository.GetByIdAsync(id);
                if (solution == null)
                {
                    return (false, null, "Solution not found");
                }

                var result = MapToSolutionDto(solution, userId);
                return (true, result, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting solution {SolutionId}", id);
                return (false, null, "An error occurred while retrieving the solution");
            }
        }

        public async Task<List<SolutionDto>> GetSolutionsByProblemIdAsync(Guid problemId, string? userId = null)
        {
            var solutions = await _solutionRepository.GetByProblemIdAsync(problemId, userId);
            return solutions.Select(s => MapToSolutionDto(s, userId)).ToList();
        }

        public async Task<List<SolutionDto>> GetUserSolutionsAsync(string userId)
        {
            var solutions = await _solutionRepository.GetByUserIdAsync(userId);
            return solutions.Select(s => MapToSolutionDto(s, userId)).ToList();
        }

        public async Task<(bool Success, string Error)> RemoveVoteAsync(Guid solutionId, string userId)
        {
            try
            {
                var deleted = await _solutionRepository.DeleteVoteAsync(solutionId, userId);
                if (!deleted)
                {
                    return (false, "Vote not found");
                }

                await _solutionRepository.UpdateVoteCountAsync(solutionId);

                _logger.LogInformation("User {UserId} removed vote from solution {SolutionId}",
                    userId, solutionId);

                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing vote from solution {SolutionId}", solutionId);
                return (false, "An error occurred while removing vote");
            }
        }

        public async Task<(bool Success, SolutionDto? Data, string Error)> UpdateSolutionAsync(Guid id, string userId, UpdateSolutionDto dto)
        {
            try
            {
                var solution = await _solutionRepository.GetByIdAsync(id);
                if (solution == null)
                {
                    return (false, null, "Solution not found");
                }

                if (!string.IsNullOrWhiteSpace(dto.Content))
                {
                    solution.Content = dto.Content;
                }

                if (dto.Steps != null)
                {
                    solution.Steps = dto.Steps.Any() ? JsonSerializer.Serialize(dto.Steps) : null;
                }

                var updatedSolution = await _solutionRepository.UpdateAsync(solution);

                //reload with detail
                var solutionWithDetails = await _solutionRepository.GetByIdWithDetailsAsync(updatedSolution.Id, userId);
                var result = MapToSolutionDto(solutionWithDetails!, userId);

                _logger.LogInformation("Solution {SolutionId} updated by user {UserId}", id, userId);
                return (true, result, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating solution {SolutionId}", id);
                return (false, null, "An error occurred while updating the solution");
            }
        }

        public async Task<(bool Success, int VoteCount, string Error)> VoteSolutionAsync(string userId, VoteSolutionDto dto)
        {
            try
            {
                // Check if solution exists
                var solution = await _solutionRepository.GetByIdAsync(dto.SolutionId);
                if (solution == null)
                {
                    return (false, 0, "Solution not found");
                }

                // Check if user is voting on their own solution
                if (solution.UserId == userId)
                {
                    return (false, 0, "You cannot vote on your own solution");
                }

                // Check if user already voted
                var existingVote = await _solutionRepository.GetUserVoteAsync(dto.SolutionId, userId);

                if (existingVote != null)
                {
                    // If same vote type, remove vote (toggle off)
                    if (existingVote.VoteType == dto.VoteType)
                    {
                        await _solutionRepository.DeleteVoteAsync(dto.SolutionId, userId);
                        await _solutionRepository.UpdateVoteCountAsync(dto.SolutionId);

                        var updatedSolution = await _solutionRepository.GetByIdAsync(dto.SolutionId);
                        return (true, updatedSolution!.VoteCount, string.Empty);
                    }
                    // If different vote type, update vote
                    else
                    {
                        existingVote.VoteType = dto.VoteType;
                        await _solutionRepository.UpdateVoteAsync(existingVote);
                        await _solutionRepository.UpdateVoteCountAsync(dto.SolutionId);

                        var updatedSolution = await _solutionRepository.GetByIdAsync(dto.SolutionId);
                        return (true, updatedSolution!.VoteCount, string.Empty);
                    }
                }

                // Create new vote
                var vote = new SolutionVote
                {
                    SolutionId = dto.SolutionId,
                    UserId = userId,
                    VoteType = dto.VoteType,
                    CreatedAt = DateTime.UtcNow
                };

                await _solutionRepository.CreateVoteAsync(vote);
                await _solutionRepository.UpdateVoteCountAsync(dto.SolutionId);

                var solutionAfterVote = await _solutionRepository.GetByIdAsync(dto.SolutionId);

                _logger.LogInformation("User {UserId} voted {VoteType} on solution {SolutionId}",
                    userId, dto.VoteType, dto.SolutionId);

                return (true, solutionAfterVote!.VoteCount, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error voting on solution {SolutionId}", dto.SolutionId);
                return (false, 0, "An error occurred while voting");
            }
        }

        // Helper method
        private SolutionDto MapToSolutionDto(Solution solution, string? currentUserId = null)
        {
            // Get current user's vote if userId is provided
            int? currentUserVote = null;
            if (!string.IsNullOrEmpty(currentUserId) && solution.Votes != null)
            {
                var userVote = solution.Votes.FirstOrDefault(v => v.UserId == currentUserId);
                currentUserVote = userVote?.VoteType;
            }

            return new SolutionDto
            {
                Id = solution.Id,
                ProblemId = solution.ProblemId,
                UserId = solution.UserId,
                Username = solution.User?.UserName ?? "Unknown",
                UserAvatar = solution.User?.Avatar,
                UserReputation = solution.User?.Reputation ?? 0,
                Content = solution.Content,
                Steps = !string.IsNullOrWhiteSpace(solution.Steps)
                    ? JsonSerializer.Deserialize<List<string>>(solution.Steps) ?? new List<string>()
                    : new List<string>(),
                IsAccepted = solution.IsAccepted,
                VoteCount = solution.VoteCount,
                CommentCount = solution.Comments?.Count ?? 0,
                CreatedAt = solution.CreatedAt,
                UpdatedAt = solution.UpdatedAt,
                CurrentUserVote = currentUserVote
            };
        }
    }
}