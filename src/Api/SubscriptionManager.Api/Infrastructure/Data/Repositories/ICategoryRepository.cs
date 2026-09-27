namespace SubscriptionManager.Api.Infrastructure.Data.Repositories;

using SubscriptionManager.Api.Domain.Entities;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
}