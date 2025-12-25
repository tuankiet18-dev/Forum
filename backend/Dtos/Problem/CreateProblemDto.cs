using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Problem
{
    public class CreateProblemDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(500, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 500 characters")]
        public string Title { get; set; } = null!;

        [Required(ErrorMessage = "Content is required")]
        [StringLength(10000, MinimumLength = 10, ErrorMessage = "Content must be between 10 and 10000 characters")]
        public string Content { get; set; } = null!;

        [StringLength(100)]
        public string? Category { get; set; } // Algebra, Geometry, Calculus, etc.

        [StringLength(50)]
        public string? Difficulty { get; set; } // Easy, Medium, Hard

        public List<string>? Tags { get; set; } // ["linear-algebra", "matrices"]

    }
}