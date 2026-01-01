using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Solution
{
    public class VoteSolutionDto
    {
        [Required]
        public Guid SolutionId { get; set; }

        [Required]
        [Range(-1, 1, ErrorMessage = "VoteType must be 1 (upvote) or -1 (downvote)")]
        public int VoteType { get; set; } // 1: upvote, -1: downvote
    }
}