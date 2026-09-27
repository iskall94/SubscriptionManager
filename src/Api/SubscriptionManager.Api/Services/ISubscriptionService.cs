namespace SubscriptionManager.Api.Services;

using SubscriptionManager.Api.Domain.DTOs;
public interface ISubscriptionService
{
    Task<List<SubscriptionResponseDto>> GetAllAsync(string userId);
    Task<SubscriptionResponseDto?> GetByIdAsync(int id, string userId);
    Task<SubscriptionResponseDto?> CreateAsync(CreateSubscriptionDto dto, string userId);
    Task<SubscriptionResponseDto?> UpdateAsync(int id, UpdateSubscriptionDto dto, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}