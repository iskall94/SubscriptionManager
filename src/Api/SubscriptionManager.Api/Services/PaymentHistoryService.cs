namespace SubscriptionManager.Api.Services;

using SubscriptionManager.Api.Domain.DTOs;
using SubscriptionManager.Api.Domain.Entities;
using SubscriptionManager.Api.Domain.Enums;
using SubscriptionManager.Api.Infrastructure.Data.Repositories;
using SubscriptionManager.Api.Services.Common;

public class PaymentHistoryService : IPaymentHistoryService
{
    private readonly IPaymentHistoryRepository _paymentRepo;
    private readonly ISubscriptionRepository _subscriptionRepo;

    public PaymentHistoryService(
        IPaymentHistoryRepository paymentRepo,
        ISubscriptionRepository subscriptionRepo)
    {
        _paymentRepo = paymentRepo;
        _subscriptionRepo = subscriptionRepo;
    }

    public async Task<List<PaymentHistoryResponseDto>> GetAllForUserAsync(string userId)
    {
        var payments = await _paymentRepo.GetAllByUserIdAsync(userId);
        return payments.Select(MapToResponse).ToList();
    }

    public async Task<List<PaymentHistoryResponseDto>> GetBySubscriptionIdAsync(int subscriptionId, string userId)
    {
        var payments = await _paymentRepo.GetAllBySubscriptionIdAsync(subscriptionId, userId);
        return payments.Select(MapToResponse).ToList();
    }

    public async Task<PaymentHistoryResponseDto?> CreateAsync(int subscriptionId, CreatePaymentHistoryDto dto, string userId)
    {
        var subscription = await _subscriptionRepo.GetByIdAsync(subscriptionId, userId);
        if (subscription is null) return null;

        var payment = new PaymentHistory
        {
            SubscriptionId = subscriptionId,
            Amount = dto.Amount,
            PaidAt = dto.PaidAt.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(dto.PaidAt, DateTimeKind.Utc) 
                : dto.PaidAt.ToUniversalTime(),
            Status = dto.Status,
            Subscription = subscription
        };

        await _paymentRepo.AddAsync(payment);

        if (dto.Status == PaymentStatus.Paid && dto.AdvanceBillingCycle)
        {
            subscription.NextBillingDate = SubscriptionExtension.CalculateNextBillingDate(
                subscription.NextBillingDate.AddDays(1),
                subscription.Interval
            );
            subscription.Updated = DateTime.UtcNow;
            _subscriptionRepo.Update(subscription);
        }

        await _paymentRepo.SaveChangesAsync();

        return MapToResponse(payment);
    }

    public async Task<PaymentHistoryResponseDto?> UpdateStatusAsync(int id, UpdatePaymentStatusDto dto, string userId)
    {
        var payment = await _paymentRepo.GetByIdAsync(id, userId);
        if (payment is null) return null;

        payment.Status = dto.Status;
        await _paymentRepo.SaveChangesAsync();

        return MapToResponse(payment);
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var payment = await _paymentRepo.GetByIdAsync(id, userId);
        if (payment is null) return false;

        _paymentRepo.Delete(payment);
        await _paymentRepo.SaveChangesAsync();
        return true;
    }

    private static PaymentHistoryResponseDto MapToResponse(PaymentHistory p) =>
        new(
            p.Id,
            p.SubscriptionId,
            p.Subscription?.Name ?? string.Empty,
            p.Amount,
            p.Subscription?.Currency ?? "SEK",
            p.PaidAt,
            p.Status
        );
}
