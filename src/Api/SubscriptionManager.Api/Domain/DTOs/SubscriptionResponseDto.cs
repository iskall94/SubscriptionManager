using SubscriptionManager.Api.Domain.Enums;

namespace SubscriptionManager.Api.Domain.DTOs;

public record SubscriptionResponseDto(
    int Id,
    string Name,
    decimal Price,
    string Currency,
    BillingInterval Interval,
    DateOnly FirstBillingDate,
    DateOnly NextBillingDate,
    int CategoryId,
    string? CategoryName
);