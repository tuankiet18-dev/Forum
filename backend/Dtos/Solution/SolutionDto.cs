using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Solution
{
    public class SolutionDto
    {
        public Guid Id { get; set; }
        public Guid ProblemId { get; set; }
        public string? UserId { get; set; }
        public string? Username { get; set; }
        public string? UserAvatar { get; set; }
        public string? Content { get; set; }
        public bool IsAccepted { get; set; }
        public int VoteCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}