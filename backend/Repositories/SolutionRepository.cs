using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces.IRepositories;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SolutionRepository : ISolutionRepository
    {
        private readonly ApplicationDbContext _context;
        public SolutionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AcceptSolutionAsync(Guid solutionId, Guid problemId)
        {
            // Unaccept all other solutions for this problem
            var otherSolutions = await _context.Solutions
                .Where(s => s.ProblemId == problemId && s.Id != solutionId)
                .ToListAsync();

            foreach (var solution in otherSolutions)
            {
                solution.IsAccepted = false;
            }

            // Accept the selected solution
            var selectedSolution = await GetByIdAsync(solutionId);
            if (selectedSolution == null) return false;

            selectedSolution.IsAccepted = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Solution> CreateAsync(Solution solution)
        {
            await _context.Solutions.AddAsync(solution);
            await _context.SaveChangesAsync();
            return solution;
        }

        public async Task<SolutionVote> CreateVoteAsync(SolutionVote vote)
        {
            await _context.SolutionVotes.AddAsync(vote);
            await _context.SaveChangesAsync();
            return vote;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var solution = await GetByIdAsync(id);
            if (solution == null) return false;

            solution.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteVoteAsync(Guid solutionId, string userId)
        {
            var vote = await GetUserVoteAsync(solutionId, userId);
            if (vote == null) return false;

            _context.SolutionVotes.Remove(vote);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Solution?> GetByIdAsync(Guid id, bool includeDeleted = false)
        {
            var query = _context.Solutions
                .Include(s => s.User)
                .Include(s => s.Problem)
                .AsQueryable();

            if (!includeDeleted)
            {
                query = query.Where(s => !s.IsDeleted);
            }
            return await query.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Solution?> GetByIdWithDetailsAsync(Guid id, string? userId = null)
        {
            var query = _context.Solutions
                .Include(s => s.User)
                .Include(s => s.Problem)
                .Include(s => s.Votes)
                .Include(s => s.Comments.Where(c => !c.IsDeleted))
                    .ThenInclude(c => c.User)
                .Where(s => !s.IsDeleted)
                .AsQueryable();

            return await query.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Solution>> GetByProblemIdAsync(Guid problemId, string? userId = null)
        {
            var query = _context.Solutions
                .Include(s => s.User)
                .Include(s => s.Votes)
                .Include(s => s.Comments.Where(c => !c.IsDeleted))
                .Where(s => s.ProblemId == problemId && !s.IsDeleted)
                .OrderByDescending(s => s.IsAccepted)
                .ThenByDescending(s => s.VoteCount)
                .ThenByDescending(s => s.CreatedAt);

            return await query.ToListAsync();
        }

        public async Task<List<Solution>> GetByUserIdAsync(string userId)
        {
            return await _context.Solutions
                .Include(s => s.Problem)
                .Include(s => s.Votes)
                .Where(s => s.UserId == userId && !s.IsDeleted)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<SolutionVote?> GetUserVoteAsync(Guid solutionId, string userId)
        {
            return await _context.SolutionVotes
                .FirstOrDefaultAsync(v => v.SolutionId == solutionId && v.UserId == userId);
        }

        public async Task<Solution> UpdateAsync(Solution solution)
        {
            solution.UpdatedAt = DateTime.UtcNow;
            _context.Solutions.Update(solution);
            await _context.SaveChangesAsync();
            return solution;
        }

        public async Task<SolutionVote> UpdateVoteAsync(SolutionVote vote)
        {
            _context.SolutionVotes.Update(vote);
            await _context.SaveChangesAsync();
            return vote;
        }

        public async Task UpdateVoteCountAsync(Guid solutionId)
        {
            var solution = await GetByIdAsync(solutionId);
            if (solution == null) return;

            var voteSum = await _context.SolutionVotes
                .Where(v => v.SolutionId == solutionId)
                .SumAsync(v => v.VoteType);

            solution.VoteCount = voteSum;
            await _context.SaveChangesAsync();

        }
    }
}