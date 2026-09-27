namespace SubscriptionManager.Api.Services;

using SubscriptionManager.Api.Domain.DTOs;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
}