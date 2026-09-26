import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { 
  AppBar, 
  Toolbar,
  Typography,
  Button, 
  Box, 
  IconButton
} from "@mui/material"
import { useColorMode } from '../context/useColorMode';
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homePath = isAuthenticated ? "/dashboard" : "/";

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar>
        <Typography
            variant="h6"
            component={RouterLink}
            to={homePath}
            sx={{
              flexGrow: 1,
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
          Subscription Manager
        </Typography>

        <Box 
          sx={{
            position: "absolute",
            right: 16,
            alignItems: "center",
            display: "flex", 
            gap: 1 
          }}
        >
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            aria-label="Toggle light/dark mode"
            size="small"
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        
          {isAuthenticated ? (
            <>
              <Button
                onClick={handleLogout}
                color="inherit"
              >
                Log Out
              </Button>
            </>
            ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
              >
                Log In
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                color="inherit"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}