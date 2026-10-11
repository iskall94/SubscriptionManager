namespace SubscriptionManager.Api.Infrastructure.Data.Repositories;

using SubscriptionManager.Api.Domain.Entities;

public interface IPaymentHistoryRepository
{
    Task<List<PaymentHistory>> GetAllBySubscriptionIdAsync(int subscriptionId, string userId);
    Task<List<PaymentHistory>> GetAllByUserIdAsync(string userId);
    Task<PaymentHistory?> GetByIdAsync(int id, string userId);
    Task AddAsync(PaymentHistory payment);
    void Delete(PaymentHistory payment);
    Task<int> SaveChangesAsync();
}
