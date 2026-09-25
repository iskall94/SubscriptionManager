import { useState, useEffect, type SubmitEvent } from "react";
import { 
  getSubscriptions, 
  createSubscription, 
  deleteSubscription 
} from "../api/subscriptionApi";
import type { Subscription } from "../types/subscription";

// Helper function to calculate the next billing date based on the first billing date and interval
function calculateNextDate(firstBillingDate: string, intervalValue: number): string {
	if (!firstBillingDate)
	{
		return "";
	}

	// T00:00:00 added to fix timezone issues when creating a new Date object
	const date = new Date(`${firstBillingDate}T00:00:00`);

  if (intervalValue === 1) 
	{
    // Weekly (+7 days)
    date.setDate(date.getDate() + 7);
  } else if (intervalValue === 2) {
    // Monthly (+1 month)
    date.setMonth(date.getMonth() + 1);
  } else if (intervalValue === 3) {
    // Yearly (+1 year)
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString().split("T")[0];
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("SEK");
  const [interval, setInterval] = useState(2); // 2 = Monthly
	const [firstBillingDate, setfirstBillingDate] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSubscriptions()
      .then(setSubscriptions)
      .catch(() => setError("Failed to fetch subscriptions"))
      .finally(() => setIsLoading(false));
  }, []);

  // Calculate total for each currency
  const totals: Record<string, number> = {};
  for (const sub of subscriptions) {
    const curr = sub.currency || "SEK";
    totals[curr] = (totals[curr] || 0) + Number(sub.price);
  }

  const handleCreateSubscription = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

		const parsedPrice = parseFloat(price);
		if (parsedPrice < 0) 
		{
    	setError("Price cannot be negative");
    	return;
		}

    try {
      const newSub = await createSubscription({
        name,
        price: parsedPrice,
        currency,
        interval: Number(interval),
				firstBillingDate,
        nextBillingDate,
        categoryId: 1,
      });

      setSubscriptions([...subscriptions, newSub]);
      setName("");
      setPrice("");
			setfirstBillingDate("");
      setNextBillingDate("");
    } catch {
      setError("Failed to create subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteSubscription(id.toString());
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2>Subscriptions</h2>

      {error && <p role="alert">{error}</p>}

      <div>
        <h3>Total Subscriptions Cost:</h3>
        {Object.keys(totals).length === 0 ? (
          <p>No sum for any subscriptions</p>
        ) : (
          Object.entries(totals).map(([curr, sum]) => (
            <p key={curr}>
              {curr}: {sum}
            </p>
          ))
        )}
      </div>

      <hr />

      <form onSubmit={handleCreateSubscription}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            step="0.01"
						min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={isLoading}
          />
        </label>

        <label>
          Currency:
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={isLoading}
          >
            <option value="SEK">SEK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </label>

        <label>
          Billing Cycle:
          <select
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            disabled={isLoading}
          >
            <option value={1}>Weekly</option>
            <option value={2}>Monthly</option>
            <option value={3}>Yearly</option>
          </select>
        </label>

				<label>
  				First Billing Date:
  				<input
  					type="date"
    				value={firstBillingDate}
   					onChange={(e) => {
							const newFirstBillingDate = e.target.value;
							setfirstBillingDate(newFirstBillingDate);
							setNextBillingDate(calculateNextDate(newFirstBillingDate, interval));
						}}
    				required
    				disabled={isLoading}
  				/>
				</label>

        <label>
          Next Billing Date:
          <input
            type="date"
            value={nextBillingDate}
            onChange={(e) => {
      				const newInterval = Number(e.target.value);
      				setInterval(newInterval);
      				setNextBillingDate(calculateNextDate(firstBillingDate, newInterval));
    				}}
            required
            disabled={isLoading}
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Subscription"}
        </button>
      </form>

      <hr />

      {subscriptions.length === 0 ? (
        <p>There are currently no subscriptions to be displayed.</p>
      ) : (
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.id}>
              <span>
                {sub.name} - {sub.price} {sub.currency} (Next: {sub.nextBillingDate})
              </span>{" "}
              <button
                type="button"
                onClick={() => handleDeleteSubscription(sub.id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}