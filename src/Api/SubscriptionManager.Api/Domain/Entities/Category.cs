using System.ComponentModel.DataAnnotations;
namespace SubscriptionManager.Api.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public ICollection<Subscription> Subscriptions { get; set; } = [];
}
