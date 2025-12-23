using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Solution
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ProblemId { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        public string Content { get; set; } = null!; // LaTeX content

        public string? Steps { get; set; } // JSON array of solution steps

        public bool IsAccepted { get; set; } = false;

        public int VoteCount { get; set; } = 0; // Calculated field for performance

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        // Navigation properties
        [ForeignKey(nameof(ProblemId))]
        public virtual Problem Problem { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; } = null!;

        public virtual ICollection<SolutionVote> Votes { get; set; } = new List<SolutionVote>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}