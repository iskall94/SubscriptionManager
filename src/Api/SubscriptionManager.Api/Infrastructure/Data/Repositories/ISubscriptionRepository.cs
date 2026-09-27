namespace SubscriptionManager.Api.Infrastructure.Data.Repositories;

using SubscriptionManager.Api.Domain.Entities;

public interface ISubscriptionRepository
{
    Task<List<Subscription>> GetAllByUserIdAsync(string userId);
    Task<Subscription?> GetByIdAsync(int id, string userId);
    Task<Category?> GetCategoryByIdAsync(int categoryId);
    Task AddAsync(Subscription subscription);
    void Update(Subscription subscription);
    void Delete(Subscription subscription);
    Task<int> SaveChangesAsync();
}