using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Entities;
using SubscriptionManager.Api.Domain.Enums;
using SubscriptionManager.Api.Infrastructure.Identity;

namespace SubscriptionManager.Api.Infrastructure.Data;

public static class DbSeeding
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<SubscriptionDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        await db.Database.MigrateAsync();

        const string emailUser = "dev@test.com";

        var user = await userManager.FindByEmailAsync(emailUser);

        if (user is null)
        {
            user = new ApplicationUser
            {
                UserName = "dev@test.com",
                Email = "dev@test.com",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(user, "Password123!");
        }

        if (!await db.Subscriptions.AnyAsync())
        {
            db.Subscriptions.Add(new Subscription
            {
                Name = "Spotify",
                Price = 119m,
                Currency = "SEK",
                Interval = BillingInterval.Monthly,
                NextBillingDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)),
                IsActive = true,
                CategoryId = 1,
                UserId = user.Id
            });

            await db.SaveChangesAsync();
        }
    }
}