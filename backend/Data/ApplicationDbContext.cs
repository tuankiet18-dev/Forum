using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Problem> Problems { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Solution> Solutions { get; set; }
        public DbSet<SolutionVote> SolutionVotes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Problem configuration
            builder.Entity<Problem>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.IsDeleted);

                entity.HasOne(p => p.User)
                    .WithMany(u => u.Problems)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Solution configuration
            builder.Entity<Solution>(entity =>
            {
                entity.HasIndex(e => e.ProblemId);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.IsAccepted);
                entity.HasIndex(e => e.CreatedAt);

                entity.HasOne(s => s.Problem)
                    .WithMany(p => p.Solutions)
                    .HasForeignKey(s => s.ProblemId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.User)
                    .WithMany(u => u.Solutions)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // SolutionVote configuration
            builder.Entity<SolutionVote>(entity =>
            {
                entity.HasIndex(e => new { e.SolutionId, e.UserId }).IsUnique();
                entity.HasIndex(e => e.UserId);

                entity.HasOne(v => v.Solution)
                    .WithMany(s => s.Votes)
                    .HasForeignKey(v => v.SolutionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(v => v.User)
                    .WithMany(u => u.SolutionVotes)
                    .HasForeignKey(v => v.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Comment configuration
            builder.Entity<Comment>(entity =>
            {
                entity.HasIndex(e => e.SolutionId);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.CreatedAt);

                entity.HasOne(c => c.Solution)
                    .WithMany(s => s.Comments)
                    .HasForeignKey(c => c.SolutionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            List<IdentityRole> roles = new List<IdentityRole>
            {
              new IdentityRole{Id = "1", Name = "Admin", NormalizedName = "ADMIN"},
              new IdentityRole{Id = "2", Name = "User", NormalizedName = "USER"},
            };
            builder.Entity<IdentityRole>().HasData(roles);
        }

    }
}