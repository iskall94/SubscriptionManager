using SubscriptionManager.Api.Domain.Enums;

namespace SubscriptionManager.Api.Domain.DTOs;

public record UpdateSubscriptionDto(
    string Name,
    decimal Price,
    string Currency,
    BillingInterval Interval,
    DateOnly FirstBillingDate,
    DateOnly NextBillingDate,
    int CategoryId
);
