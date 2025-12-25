using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Solution;

namespace backend.Dtos.Problem
{
    public class ProblemDetailDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string? UserAvatar { get; set; }
        public int UserReputation { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public int ViewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<SolutionDto> Solutions { get; set; } = new List<SolutionDto>();
    }
}