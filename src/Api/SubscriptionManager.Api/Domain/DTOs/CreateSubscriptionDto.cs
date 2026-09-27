using SubscriptionManager.Api.Domain.Enums;

namespace SubscriptionManager.Api.Domain.DTOs;

public record CreateSubscriptionDto(
    string Name,
    decimal Price,
    string Currency,
    BillingInterval Interval,
    DateOnly FirstBillingDate,
    DateOnly NextBillingDate,
    int CategoryId = 0 // Default Category
);
