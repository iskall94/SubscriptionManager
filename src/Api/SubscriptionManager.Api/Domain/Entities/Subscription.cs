using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SubscriptionManager.Api.Domain.Entities;

public class Subscription
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    [Precision(10,2)]
    public Decimal Price { get; set; }
    [MaxLength(10)]
    public string Currency { get; set; } = "SEK";
    public BillingInterval Interval { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime? Updated { get; set; }
    public DateOnly NextBillingDate {  get; set; }
    public bool IsActive { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    [ForeignKey(nameof(CategoryId))]
    public Category Category { get; set; } = new();

    public ICollection<PaymentHistory> PaymentHistories { get; set; } = [];
}
