using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Problem
{
    public class ProblemFilterDto
    {
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public string? SearchTerm { get; set; }
        public string? Tag { get; set; }
        public bool? HasAcceptedSolution { get; set; }
        public string SortBy { get; set; } = "CreatedAt"; // CreatedAt, ViewCount, SolutionCount
        public bool IsDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}