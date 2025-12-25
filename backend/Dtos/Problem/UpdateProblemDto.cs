using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Problem
{
    public class UpdateProblemDto
    {
        [StringLength(500, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 500 characters")]
        public string? Title { get; set; }

        [StringLength(10000, MinimumLength = 10, ErrorMessage = "Content must be between 10 and 10000 characters")]
        public string? Content { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        [StringLength(50)]
        public string? Difficulty { get; set; }

        public List<string>? Tags { get; set; }

    }
}