namespace SubscriptionManager.Api.Services;

using SubscriptionManager.Api.Domain.DTOs;
using SubscriptionManager.Api.Domain.Entities;
using SubscriptionManager.Api.Infrastructure.Data.Repositories;
using SubscriptionManager.Api.Services.Common;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _repo;

    public SubscriptionService(ISubscriptionRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<SubscriptionResponseDto>> GetAllAsync(string userId)
    {
        var subs = await _repo.GetAllByUserIdAsync(userId);
        return subs.Select(MapToResponse).ToList();
    }

    public async Task<SubscriptionResponseDto?> GetByIdAsync(int id, string userId)
    {
        var sub = await _repo.GetByIdAsync(id, userId);
        return sub is null ? null : MapToResponse(sub);
    }

    public async Task<SubscriptionResponseDto?> CreateAsync(CreateSubscriptionDto dto, string userId)
    {
        var category = await _repo.GetCategoryByIdAsync(dto.CategoryId);
        if (category is null) return null;

        var computedNextDate = SubscriptionExtension.CalculateNextBillingDate(dto.FirstBillingDate, dto.Interval);

        var sub = new Subscription
        {
            Name = dto.Name,
            Price = dto.Price,
            Currency = dto.Currency,
            Interval = dto.Interval,
            FirstBillingDate = dto.FirstBillingDate,
            NextBillingDate = computedNextDate,
            CategoryId = dto.CategoryId,
            Category = category,
            UserId = userId,
            IsActive = true,
            Created = DateTime.UtcNow
        };

        await _repo.AddAsync(sub);
        await _repo.SaveChangesAsync();

        return MapToResponse(sub);
    }

    public async Task<SubscriptionResponseDto?> UpdateAsync(int id, UpdateSubscriptionDto dto, string userId)
    {
        var sub = await _repo.GetByIdAsync(id, userId);
        if (sub is null) return null;

        if (sub.CategoryId != dto.CategoryId)
        {
            var category = await _repo.GetCategoryByIdAsync(dto.CategoryId);
            if (category is null) return null;
            sub.CategoryId = dto.CategoryId;
            sub.Category = category;
        }

        sub.Name = dto.Name;
        sub.Price = dto.Price;
        sub.Currency = dto.Currency;
        sub.Interval = dto.Interval;
        sub.FirstBillingDate = dto.FirstBillingDate;
        sub.NextBillingDate = SubscriptionExtension.CalculateNextBillingDate(dto.FirstBillingDate, dto.Interval);
        sub.Updated = DateTime.UtcNow;

        _repo.Update(sub);
        await _repo.SaveChangesAsync();

        return MapToResponse(sub);
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var sub = await _repo.GetByIdAsync(id, userId);
        if (sub is null) return false;

        _repo.Delete(sub);
        await _repo.SaveChangesAsync();
        return true;
    }

    private static SubscriptionResponseDto MapToResponse(Subscription s) =>
        new(
            s.Id,
            s.Name,
            s.Price,
            s.Currency,
            s.Interval,
            s.FirstBillingDate,
            s.NextBillingDate,
            s.CategoryId,
            s.Category?.Name
        );
}