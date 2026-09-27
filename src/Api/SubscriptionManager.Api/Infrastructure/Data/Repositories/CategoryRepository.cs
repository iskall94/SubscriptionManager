namespace SubscriptionManager.Api.Infrastructure.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Entities;

public class CategoryRepository : ICategoryRepository
{
    private readonly SubscriptionDbContext _db;

    public CategoryRepository(SubscriptionDbContext db)
    {
        _db = db;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _db.Categories
            .AsNoTracking()
            .ToListAsync();
    }
}