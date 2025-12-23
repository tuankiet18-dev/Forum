using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Problem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = null!;

        [Required]
        public string Content { get; set; } = null!; // LaTeX content

        [MaxLength(100)]
        public string? Category { get; set; } // Algebra, Geometry, Calculus, etc.

        [MaxLength(50)]
        public Difficulty? Difficulty { get; set; } // Easy, Medium, Hard

        public string? Tags { get; set; } // JSON array: ["linear-algebra", "matrices"]

        public int ViewCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        // Navigation properties
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; } = null!;

        public virtual ICollection<Solution> Solutions { get; set; } = new List<Solution>();
    }
    public enum Difficulty
    {
        Easy, Medium, Hard
    }
}