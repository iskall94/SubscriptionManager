namespace SubscriptionManager.Api.Services;

using SubscriptionManager.Api.Domain.DTOs;
using SubscriptionManager.Api.Infrastructure.Data.Repositories;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepo;

    public CategoryService(ICategoryRepository categoryRepo)
    {
        _categoryRepo = categoryRepo;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepo.GetAllAsync();
        return categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList();
    }
}