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
        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string? UserAvatar { get; set; }
        public int UserReputation { get; set; }
        public string Content { get; set; } = null!;
        public List<string> Steps { get; set; } = new List<string>();
        public bool IsAccepted { get; set; }
        public int VoteCount { get; set; }
        public int CommentCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CurrentUserVote { get; set; } // 1: upvote, -1: downvote, null: no vote
    }
}