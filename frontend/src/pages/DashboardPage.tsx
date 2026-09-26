import { useState, useEffect, type SubmitEvent } from "react";
import { 
  getSubscriptions, 
  createSubscription, 
  deleteSubscription 
} from "../api/subscriptionApi";
import type { Subscription } from "../types/subscription";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{fontWeight:"bold"}} >
        Subscription Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Subscription Costs by Currency
          </Typography>
        {Object.keys(totals).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No subscriptions recorded yet.
          </Typography>
        ) : (
          Object.entries(totals).map(([curr, sum]) => (
            <Typography key={curr} variant="body1">
                <strong>{curr}:</strong> {sum}
              </Typography>
          ))
        )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Current Subscriptions
          </Typography>
          {subscriptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              There are currently no subscriptions to display.
            </Typography>
          ) : (
            <List>
              {subscriptions.map((sub) => (
                <ListItem
                  key={sub.id}
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDeleteSubscription(sub.id)}
                      disabled={isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={sub.name}
                    secondary={`${sub.price} ${sub.currency} (Next billing date: ${sub.nextBillingDate})`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Subscription
          </Typography>
          <form onSubmit={handleCreateSubscription}>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  disabled={isLoading}
                />
                <TextField
                  label="Price"
                  type="number"
                  slotProps={{ 
                    htmlInput: { 
                      step: "0.01",
                      min: 0,  
                    } 
                  }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  required
                  disabled={isLoading}
                />
                <TextField
                  select
                  label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  sx={{ minWidth: 120 }}
                  disabled={isLoading}
                >
                  <MenuItem value="SEK">SEK</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  </TextField>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>          
                <TextField
                  select
                  label="Billing Cycle"
                  value={interval}
                  onChange={(e) => {
                    const newInterval = (Number(e.target.value));
                    setInterval(newInterval);
                    setNextBillingDate(calculateNextDate(firstBillingDate, newInterval));
                  }}
                  fullWidth
                  disabled={isLoading}
                  >
                    <MenuItem value={1}>Weekly</MenuItem>
                    <MenuItem value={2}>Monthly</MenuItem>
                    <MenuItem value={3}>Yearly</MenuItem>
                  </TextField>

                  <TextField
                    label="First Billing Date"
                    type="date"
                    value={firstBillingDate}
                    onChange={(e) => {
                      const newFirstBillingDate = e.target.value;
                      setfirstBillingDate(newFirstBillingDate);
                      setNextBillingDate(calculateNextDate(newFirstBillingDate, interval));
                    }}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    required
                    disabled={isLoading}
                  />
                
                <TextField
                  label = "Next Billing Date"
                  type="date"
                  value={nextBillingDate}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  required
                  disabled
                />
              </Stack>

              <Button 
                type="submit"
                variant="contained"
                size="medium"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Subscription"}
              </Button>
            </Stack>
          </form>
        </CardContent> 
      </Card>
    </Container>
  );
}