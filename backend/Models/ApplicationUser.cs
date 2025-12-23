using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Bio { get; set; }
        public string? Avatar { get; set; }
        public int Reputation { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public virtual ICollection<Problem> Problems { get; set; } = new List<Problem>();
        public virtual ICollection<Solution> Solutions { get; set; } = new List<Solution>();
        public virtual ICollection<SolutionVote> SolutionVotes { get; set; } = new List<SolutionVote>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}