namespace SubscriptionManager.Api.Infrastructure.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.Entities;

public class PaymentHistoryRepository : IPaymentHistoryRepository
{
    private readonly SubscriptionDbContext _db;

    public PaymentHistoryRepository(SubscriptionDbContext db)
    {
        _db = db;
    }

    public async Task<List<PaymentHistory>> GetAllBySubscriptionIdAsync(int subscriptionId, string userId)
    {
        return await _db.PaymentHistories
            .AsNoTracking()
            .Include(p => p.Subscription)
            .Where(p => p.SubscriptionId == subscriptionId && p.Subscription!.UserId == userId)
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync();
    }

    public async Task<List<PaymentHistory>> GetAllByUserIdAsync(string userId)
    {
        return await _db.PaymentHistories
            .AsNoTracking()
            .Include(p => p.Subscription)
            .Where(p => p.Subscription!.UserId == userId)
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync();
    }

    public async Task<PaymentHistory?> GetByIdAsync(int id, string userId)
    {
        return await _db.PaymentHistories
            .Include(p => p.Subscription)
            .FirstOrDefaultAsync(p => p.Id == id && p.Subscription!.UserId == userId);
    }

    public async Task AddAsync(PaymentHistory payment)
    {
        await _db.PaymentHistories.AddAsync(payment);
    }

    public void Delete(PaymentHistory payment)
    {
        _db.PaymentHistories.Remove(payment);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _db.SaveChangesAsync();
    }
}
