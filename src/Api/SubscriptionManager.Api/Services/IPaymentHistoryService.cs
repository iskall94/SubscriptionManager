namespace SubscriptionManager.Api.Services;

using SubscriptionManager.Api.Domain.DTOs;

public interface IPaymentHistoryService
{
    Task<List<PaymentHistoryResponseDto>> GetAllForUserAsync(string userId);
    Task<List<PaymentHistoryResponseDto>> GetBySubscriptionIdAsync(int subscriptionId, string userId);
    Task<PaymentHistoryResponseDto?> CreateAsync(int subscriptionId, CreatePaymentHistoryDto dto, string userId);
    Task<PaymentHistoryResponseDto?> UpdateStatusAsync(int id, UpdatePaymentStatusDto dto, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}
