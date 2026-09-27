using SubscriptionManager.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SubscriptionManager.Api.Domain.DTOs;

public record CreateSubscriptionDto(
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
    string Name,
    [Range(0, 1000000, ErrorMessage = "Price must be greater than or equal to 0")]
    decimal Price,
    string Currency,
    BillingInterval Interval,
    [Required(ErrorMessage = "First billing date is required")]
    DateOnly FirstBillingDate,
    DateOnly NextBillingDate,
    [Range(1, int.MaxValue, ErrorMessage = "A valid CategoryId must be selected")]
    int CategoryId = 0 // Default Category
);
