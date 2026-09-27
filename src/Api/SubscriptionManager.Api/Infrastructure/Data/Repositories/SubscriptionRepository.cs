namespace SubscriptionManager.Api.Infrastructure.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Entities;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly SubscriptionDbContext _db;

    public SubscriptionRepository(SubscriptionDbContext db)
    {
        _db = db;
    }

    public async Task<List<Subscription>> GetAllByUserIdAsync(string userId)
    {
        return await _db.Subscriptions
            .AsNoTracking()
            .Include(s => s.Category)
            .Where(s => s.UserId == userId)
            .ToListAsync();
    }

    public async Task<Subscription?> GetByIdAsync(int id, string userId)
    {
        return await _db.Subscriptions
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
    }

    public async Task<Category?> GetCategoryByIdAsync(int categoryId)
    {
        return await _db.Categories.FindAsync(categoryId);
    }

    public async Task AddAsync(Subscription subscription)
    {
        await _db.Subscriptions.AddAsync(subscription);
    }

    public void Update(Subscription subscription)
    {
        _db.Subscriptions.Update(subscription);
    }

    public void Delete(Subscription subscription)
    {
        _db.Subscriptions.Remove(subscription);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _db.SaveChangesAsync();
    }
}