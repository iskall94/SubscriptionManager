using SubscriptionManager.Api.Domain.Enums;

namespace SubscriptionManager.Api.Services.Common;

public static class SubscriptionExtension
{
    public static DateOnly CalculateNextBillingDate(DateOnly startDate, BillingInterval interval)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var next = startDate;

        Func<DateOnly, DateOnly> step = interval switch
        {
            BillingInterval.Weekly => d => d.AddDays(7),
            BillingInterval.Monthly => d => d.AddMonths(1),
            BillingInterval.Yearly => d => d.AddYears(1),
            // Handle unexpected values
            _ => throw new ArgumentOutOfRangeException(nameof(interval))
        };

        while (next < today)
        {
            next = step(next);
        }   

        return next;
    }
}