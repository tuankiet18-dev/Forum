using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Problem
{
    public class ProblemDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string? UserAvatar { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public int ViewCount { get; set; }
        public int SolutionCount { get; set; }
        public bool HasAcceptedSolution { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
}