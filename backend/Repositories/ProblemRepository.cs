using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Problem;
using backend.Interfaces.IRepositories;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ProblemRepository : IProblemRepository
    {
        private readonly ApplicationDbContext _context;

        public ProblemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Problem> CreateAsync(Problem problem)
        {
            await _context.Problems.AddAsync(problem);
            await _context.SaveChangesAsync();
            return problem;

        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var problem = await GetByIdAsync(id);
            if (problem == null) return false;

            problem.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<(List<Problem> Items, int TotalCount)> GetAllAsync(ProblemFilterDto filter)
        {
            var query = _context.Problems
                .Include(p => p.User)
                .Include(p => p.Solutions.Where(s => !s.IsDeleted))
                .Where(p => !p.IsDeleted)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filter.Category))
            {
                query = query.Where(p => p.Category == filter.Category);
            }

            if (!string.IsNullOrWhiteSpace(filter.Difficulty))
            {
                query = query.Where(p => p.Difficulty == filter.Difficulty);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(p =>
                    p.Title.Contains(filter.SearchTerm) ||
                    p.Content.Contains(filter.SearchTerm));
            }

            if (!string.IsNullOrWhiteSpace(filter.Tag))
            {
                query = query.Where(p => p.Tags != null && p.Tags.Contains(filter.Tag));
            }

            if (filter.HasAcceptedSolution.HasValue)
            {
                query = query.Where(p =>
                    p.Solutions.Any(s => s.IsAccepted) == filter.HasAcceptedSolution.Value);
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            query = filter.SortBy.ToLower() switch
            {
                "viewcount" => filter.IsDescending
                    ? query.OrderByDescending(p => p.ViewCount)
                    : query.OrderBy(p => p.ViewCount),
                "solutioncount" => filter.IsDescending
                    ? query.OrderByDescending(p => p.Solutions.Count)
                    : query.OrderBy(p => p.Solutions.Count),
                _ => filter.IsDescending
                    ? query.OrderByDescending(p => p.CreatedAt)
                    : query.OrderBy(p => p.CreatedAt)
            };

            // Apply pagination
            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Problem?> GetByIdAsync(Guid id, bool includeDeleted = false)
        {
            var query = _context.Problems
                .Include(p => p.User)
                .AsQueryable();

            if (!includeDeleted)
            {
                query = query.Where(p => !p.IsDeleted);
            }
            return await query.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Problem?> GetByIdWithSolutionsAsync(Guid id)
        {
            return await _context.Problems
                .Include(p => p.User)
                .Include(p => p.Solutions.Where(s => !s.IsDeleted))
                    .ThenInclude(s => s.User)
                .Include(p => p.Solutions.Where(s => !s.IsDeleted))
                    .ThenInclude(s => s.Votes)
                .Where(p => !p.IsDeleted)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Problem>> GetByUserIdAsync(string userId)
        {
            return await _context.Problems
                .Include(p => p.Solutions.Where(s => !s.IsDeleted))
                .Where(p => p.UserId == userId && !p.IsDeleted)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> IncrementViewCountAsync(Guid id)
        {
            var problem = await GetByIdAsync(id);
            if (problem == null) return false;

            problem.ViewCount++;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Problem> UpdateAsync(Problem problem)
        {
            problem.UpdatedAt = DateTime.UtcNow;
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();
            return problem;

        }
    }
}