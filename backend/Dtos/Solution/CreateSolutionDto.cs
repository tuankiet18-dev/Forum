using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Solution
{
    public class CreateSolutionDto
    {
        [Required(ErrorMessage = "Problem ID is required")]
        public Guid ProblemId { get; set; }

        [Required(ErrorMessage = "Content is required")]
        [StringLength(10000, MinimumLength = 10, ErrorMessage = "Content must be between 10 and 10000 characters")]
        public string Content { get; set; } = null!;

        public List<string>? Steps { get; set; }
    }
}