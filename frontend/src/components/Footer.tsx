import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Subscription Manager. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}