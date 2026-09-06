using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace SubscriptionManager.Api.Domain.Entities;

public class PaymentHistory
{
    public int Id { get; set; }

    [Precision(10, 2)]
    public decimal Amount { get; set; }
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public int SubscriptionId { get; set; }
    [ForeignKey(nameof(SubscriptionId))]
    public Subscription? Subscription { get; set; }
}
