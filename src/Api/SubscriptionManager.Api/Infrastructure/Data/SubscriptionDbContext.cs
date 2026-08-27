using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace SubscriptionManager.Api.Infrastructure.Data;

public class SubscriptionDbContext : IdentityDbContext<IdentityUser>
{
    public SubscriptionDbContext(DbContextOptions<SubscriptionDbContext> options) : base(options)
    {
    }
}