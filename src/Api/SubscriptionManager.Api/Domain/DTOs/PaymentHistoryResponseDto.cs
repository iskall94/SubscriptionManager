using SubscriptionManager.Api.Domain.Enums;

namespace SubscriptionManager.Api.Domain.DTOs;

public record PaymentHistoryResponseDto(
    int Id,
    int SubscriptionId,
    string SubscriptionName,
    decimal Amount,
    string Currency,
    DateTime PaidAt,
    PaymentStatus Status
);
