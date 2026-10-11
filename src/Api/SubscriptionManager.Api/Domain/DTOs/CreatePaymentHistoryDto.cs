using SubscriptionManager.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace SubscriptionManager.Api.Domain.DTOs;

public record CreatePaymentHistoryDto(
    [Range(0.01, 1000000, ErrorMessage = "Amount must be greater than 0")]
    decimal Amount,
    DateTime PaidAt,
    PaymentStatus Status = PaymentStatus.Paid,
    bool AdvanceBillingCycle = true
);

public record UpdatePaymentStatusDto(
    PaymentStatus Status
);
