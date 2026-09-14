using SubscriptionManager.Api.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Entities;

namespace SubscriptionManager.Api.Infrastructure.Data;

public class SubscriptionDbContext : IdentityDbContext<ApplicationUser>
{
    public SubscriptionDbContext(DbContextOptions<SubscriptionDbContext> options) : base(options)
    {
    }
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<PaymentHistory> PaymentHistories => Set<PaymentHistory>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Subscription>(entity =>
        {
            entity.HasOne(s => s.Category)
                  .WithMany(c => c.Subscriptions)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Streaming" },
            new Category { Id = 2, Name = "Software" },
            new Category { Id = 3, Name = "Gaming" }
        );
    }
}