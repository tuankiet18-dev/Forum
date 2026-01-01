using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Solution
{
    public class UpdateSolutionDto
    {
        [StringLength(10000, MinimumLength = 10, ErrorMessage = "Content must be between 10 and 10000 characters")]
        public string? Content { get; set; }

        public List<string>? Steps { get; set; }
    }
}