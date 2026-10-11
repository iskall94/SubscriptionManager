import { useState, useEffect, type SubmitEvent } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { 
  getAllPayments, 
  recordPayment, 
  deletePayment, 
  updatePaymentStatus 
} from "../api/paymentHistoryApi";
import { getSubscriptions } from "../api/subscriptionApi";
import type { PaymentHistory, PaymentStatus } from "../types/paymentHistory";
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
  Box,
  Chip,
  FormControlLabel,
  Checkbox,
  Divider,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PaymentsPage() {
  const [searchParams] = useSearchParams();
  const initialSubFilter = searchParams.get("subscriptionId") 
    ? Number(searchParams.get("subscriptionId")) 
    : "ALL";

  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubFilter, setSelectedSubFilter] = useState<number | "ALL">(initialSubFilter);
  const [statusFilter, setStatusFilter] = useState<number | "ALL">("ALL");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetSubId, setTargetSubId] = useState<number | "">("");
  const [amount, setAmount] = useState<string>("");
  const [paidAt, setPaidAt] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(1); // 1 = Paid
  const [advanceBillingCycle, setAdvanceBillingCycle] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [paymentsData, subscriptionsData] = await Promise.all([
        getAllPayments(),
        getSubscriptions()
      ]);
      setPayments(paymentsData);
      setSubscriptions(subscriptionsData);

      if (subscriptionsData.length > 0 && targetSubId === "") {
        const querySubId = searchParams.get("subscriptionId");
        if (querySubId && subscriptionsData.some(s => s.id === Number(querySubId))) {
          setTargetSubId(Number(querySubId));
        } else {
          setTargetSubId(subscriptionsData[0].id);
        }
      }
    } catch {
      setError("Failed to load payments or subscriptions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubChangeInDialog = (subId: number) => {
    setTargetSubId(subId);
    const sub = subscriptions.find((s) => s.id === subId);
    if (sub) {
      setAmount(sub.price.toString());
    }
  };

  const openRecordDialog = (preselectedSubId?: number) => {
    setError("");
    setSuccessMessage("");
    const subIdToUse = preselectedSubId ?? (subscriptions.length > 0 ? subscriptions[0].id : "");
    setTargetSubId(subIdToUse);

    if (typeof subIdToUse === "number") {
      const sub = subscriptions.find((s) => s.id === subIdToUse);
      if (sub) {
        setAmount(sub.price.toString());
      }
    } else {
      setAmount("");
    }

    setPaidAt(new Date().toISOString().split("T")[0]);
    setPaymentStatus(1);
    setAdvanceBillingCycle(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (typeof targetSubId !== "number") {
      setError("Please select a subscription.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const newPayment = await recordPayment(targetSubId, {
        amount: parsedAmount,
        paidAt: new Date(paidAt).toISOString(),
        status: paymentStatus,
        advanceBillingCycle
      });

      setPayments([newPayment, ...payments]);
      setSuccessMessage("Payment recorded successfully!");
      setIsDialogOpen(false);
    } catch {
      setError("Failed to record payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    setIsLoading(true);
    try {
      await deletePayment(id);
      setPayments(payments.filter((p) => p.id !== id));
      setSuccessMessage("Payment record deleted.");
    } catch {
      setError("Failed to delete payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    setIsLoading(true);
    try {
      const updated = await updatePaymentStatus(id, { status: 1 });
      setPayments(payments.map((p) => (p.id === id ? updated : p)));
      setSuccessMessage("Payment marked as Paid.");
    } catch {
      setError("Failed to update status.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    const matchesSub = selectedSubFilter === "ALL" || p.subscriptionId === selectedSubFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSub && matchesStatus;
  });

  // Calculate totals by currency for paid payments
  const totalsByCurrency: Record<string, number> = {};
  for (const p of payments) {
    if (p.status === 1) { // Paid
      const curr = p.currency || "SEK";
      totalsByCurrency[curr] = (totalsByCurrency[curr] || 0) + Number(p.amount);
    }
  }

  const renderStatusChip = (status: PaymentStatus) => {
    switch (status) {
      case 1:
        return <Chip label="Paid" color="success" size="small" />;
      case 2:
        return <Chip label="Pending" color="warning" size="small" />;
      case 3:
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack 
        direction="row" 
        sx={{ 
          mb: 3, 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1
        }}
      >
        <Button
          component={RouterLink}
          to="/dashboard"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openRecordDialog()}
          disabled={isLoading || subscriptions.length === 0}
        >
          Record Payment
        </Button>
      </Stack>

      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1.35rem", sm: "1.75rem" }
        }}
      >
        Payment History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Summary Card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Total Paid to Date
          </Typography>
          {Object.keys(totalsByCurrency).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No completed payments recorded yet.
            </Typography>
          ) : (
            <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
              {Object.entries(totalsByCurrency).map(([curr, sum]) => (
                <Typography key={curr} variant="h6" sx={{ fontWeight: 600 }}>
                  {sum.toFixed(2)} {curr}
                </Typography>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            label="Filter by Subscription"
            value={selectedSubFilter}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSubFilter(val === "ALL" ? "ALL" : Number(val));
            }}
            fullWidth
            size="small"
          >
            <MenuItem value="ALL">All Subscriptions</MenuItem>
            {subscriptions.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => {
              const val = e.target.value;
              setStatusFilter(val === "ALL" ? "ALL" : Number(val));
            }}
            fullWidth
            size="small"
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value={1}>Paid</MenuItem>
            <MenuItem value={2}>Pending</MenuItem>
            <MenuItem value={3}>Failed</MenuItem>
          </TextField>
        </Stack>
      </Card>

      {/* Payments List */}
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 600, color: "text.secondary", px: 1 }}
          >
            Recorded Transactions ({filteredPayments.length})
          </Typography>

          {filteredPayments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
              {payments.length === 0 
                ? "No payments recorded yet. Click 'Record Payment' to log your first payment." 
                : "No payments match the selected filters."}
            </Typography>
          ) : (
            <List>
              {filteredPayments.map((p, idx) => (
                <Box key={p.id}>
                  {idx > 0 && <Divider />}
                  <ListItem
                    sx={{
                      alignItems: "center",
                      px: 1,
                      py: 1.5
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        {p.status !== 1 && (
                          <Tooltip title="Mark as Paid">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleMarkAsPaid(p.id)}
                              disabled={isLoading}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete payment record">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(p.id)}
                            disabled={isLoading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                          <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1.05rem" } }}>
                            {p.subscriptionName || `Subscription #${p.subscriptionId}`}
                          </Typography>
                          {renderStatusChip(p.status)}
                        </Stack>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} sx={{ mt: 0.5, flexWrap: "wrap" }}>
                          <Typography variant="body2" color="text.secondary">
                            Date: {new Date(p.paidAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                            Amount: {p.amount.toFixed(2)} {p.currency || "SEK"}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Record Payment</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                select
                label="Subscription"
                value={targetSubId}
                onChange={(e) => handleSubChangeInDialog(Number(e.target.value))}
                fullWidth
                required
                disabled={subscriptions.length === 0}
              >
                {subscriptions.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name} ({sub.price} {sub.currency})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Amount"
                type="number"
                slotProps={{
                  htmlInput: {
                    step: "0.01",
                    min: 0.01
                  }
                }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Payment Date"
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                required
              />

              <TextField
                select
                label="Status"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(Number(e.target.value) as PaymentStatus)}
                fullWidth
                required
              >
                <MenuItem value={1}>Paid</MenuItem>
                <MenuItem value={2}>Pending</MenuItem>
                <MenuItem value={3}>Failed</MenuItem>
              </TextField>

              {paymentStatus === 1 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={advanceBillingCycle}
                      onChange={(e) => setAdvanceBillingCycle(e.target.checked)}
                    />
                  }
                  label="Advance next billing date for this subscription"
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Save Payment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
