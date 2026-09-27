import { useState, useEffect, type SubmitEvent } from "react";
import { 
  getSubscriptions, 
  createSubscription, 
  deleteSubscription,
  updateSubscription
} from "../api/subscriptionApi";
import { getCategories } from "../api/categoryApi";
import type { Category } from "../types/category";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("SEK");
  const [interval, setInterval] = useState(2); // 2 = Monthly
	const [firstBillingDate, setFirstBillingDate] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number>(1);

  useEffect(() => {
    Promise.all([getSubscriptions(), getCategories()])
      .then(([subs, cats]) => {
        setSubscriptions(subs);
        setCategories(cats);
        if (cats.length > 0) 
        {
          setCategoryId(cats[0].id);
        }
      })
      .catch(() => setError("Failed to fetch subscriptions"))
      .finally(() => setIsLoading(false));
  }, []);

  // Calculate total for each currency
  const totals: Record<string, number> = {};
  for (const sub of subscriptions) {
    const curr = sub.currency || "SEK";
    totals[curr] = (totals[curr] || 0) + Number(sub.price);
  }

  const resetForm = () => {
    setName("");
    setPrice("");
    setCurrency("SEK");
    setInterval(2);
    setFirstBillingDate("");
    setNextBillingDate("");
    setSelectedSubId("");
    setIsEditing(false);
    if (categories.length > 0) 
    {
      setCategoryId(categories[0].id);
    } 
};

  const openCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openUpdate = (subToEdit?: Subscription) => {
    if (subscriptions.length === 0) return;
    setIsEditing(true);

    const sub = subToEdit ?? subscriptions[0];
    setSelectedSubId(sub.id);
    setName(sub.name);
    setPrice(sub.price.toString());
    setCurrency(sub.currency);
    setInterval(sub.interval);
    setFirstBillingDate(sub.firstBillingDate);
    setNextBillingDate(sub.nextBillingDate);
    setCategoryId(sub.categoryId);
    setIsDialogOpen(true);
  };

const handleCloseDialog = () => {
  setIsDialogOpen(false);
  resetForm();
};

  const handleSubmit = async (e: SubmitEvent) => {
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
      if (isEditing && typeof selectedSubId === "number")
      {
        const updatedSub = await updateSubscription(selectedSubId, {
          name,
          price: parsedPrice,
          currency,
          interval: Number(interval),
          firstBillingDate,
          nextBillingDate,
          categoryId: Number(categoryId),
        });
        setSubscriptions(subscriptions.map((s) => (s.id === selectedSubId ? updatedSub : s)));
      } else {
        const newSub = await createSubscription({
        name,
        price: parsedPrice,
        currency,
        interval: Number(interval),
				firstBillingDate,
        nextBillingDate: firstBillingDate,
        categoryId: Number(categoryId),
      });

      setSubscriptions([...subscriptions, newSub]);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch {
      setError(isEditing ? "Failed to update subscription" : "Failed to create subscription");
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
      <Typography 
        variant="h6" 
        component="h2"
        gutterBottom 
        sx={{
          fontWeight:"bold",
          fontSize: { xs: "1.25rem", sm: "1.5rem" }
        }} 
      >
        Subscription Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "text.secondary" 
            }}
          >
            Total Subscription Costs by Currency
          </Typography>
        {Object.keys(totals).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No subscriptions recorded yet.
          </Typography>
        ) : (
          Object.entries(totals).map(([curr, sum]) => (
            <Typography 
              key={curr} 
              variant="body2" 
              sx={{ 
                fontSize: { xs: "0.9rem", sm: "1rem" },
                lineHeight: 1.6 
              }}
            >
              <strong style={{ fontWeight: 600 }}>{curr}:</strong> {sum}
            </Typography>
          ))
        )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "text.secondary" 
            }}
          >
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
                  sx={{
                    pr: 11,
                    alignItems: "flex-start",
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => openUpdate(sub)}
                        disabled={isLoading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeleteSubscription(sub.id)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    sx={{ my: 0 }}
                    primary={
                      <Box 
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: 1,
                        }} 
                      >
                        <Typography
                        component="span" 
                        sx={{ 
                          fontSize: { xs: "0.95rem", sm: "1.1rem" },
                          wordBreak: "break-word"
                        }}
                        >
                          {sub.name}
                        </Typography>
                        {sub.categoryName && (
                          <Typography 
                            variant="caption"
                            color="text.secondary" 
                            sx={{
                              border: "1px solid #ccc",
                              px: 0.8,
                              py: 0.2, 
                              borderRadius: 1,
                              whiteSpace: "nowrap",
                              mt: 0.3
                            }}
                          >
                            {sub.categoryName}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                        <Typography
                          component="span"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          }}
                        >
                          {`${sub.price} ${sub.currency}`}
                        </Typography>
                        <Typography
                          component="span"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            fontSize: { xs: "0.75rem", sm: "0.8rem" },
                          }}
                        >
                          {`Next billing date: ${sub.nextBillingDate}`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={openCreate} disabled={isLoading}>
            Create Subscription
          </Button>
        </Stack>
      </Card>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditing ? "Update Subscription" : "Create Subscription"}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  fullWidth
                  required
                  disabled={isLoading || categories.length === 0}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Price"
                  type="number"
                  slotProps={{
                    htmlInput: {
                      step: "0.01",
                      min: 0,
                    },
                  }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  sx={{ minWidth: 110 }}
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
                  onChange={(e) => setInterval(Number(e.target.value))}
                  fullWidth
                >
                  <MenuItem value={1}>Weekly</MenuItem>
                  <MenuItem value={2}>Monthly</MenuItem>
                  <MenuItem value={3}>Yearly</MenuItem>
                </TextField>

                <TextField
                  label="First Billing Date"
                  type="date"
                  value={firstBillingDate}
                  onChange={(e) => setFirstBillingDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  required
                />

                <TextField
                  label="Next Billing Date"
                  type="date"
                  value={nextBillingDate}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  disabled
                  helperText="Auto-calculated on save"
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}