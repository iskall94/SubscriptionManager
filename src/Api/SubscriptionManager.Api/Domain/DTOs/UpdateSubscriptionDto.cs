using SubscriptionManager.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SubscriptionManager.Api.Domain.DTOs;

public record UpdateSubscriptionDto(
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
    string Name,
    [Range(0, 1000000, ErrorMessage = "Price must be greater than or equal to 0")]
    decimal Price,
    [StringLength(10, MinimumLength = 1, ErrorMessage = "Currency must be between 1 and 10 characters")]
    string Currency,
    BillingInterval Interval,
    DateOnly FirstBillingDate,
    [Required(ErrorMessage = "First billing date is required")]
    DateOnly NextBillingDate,
    int CategoryId
);
