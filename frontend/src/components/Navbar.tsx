import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  AppBar, 
  Toolbar,
  Typography,
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import { useColorMode } from '../context/useColorMode';
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
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
      <Toolbar 
        sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1.5, sm: 3 } 
        }}
      >
        <Typography
          variant="h6"
          component={RouterLink}
          to={homePath}
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            fontSize: { xs: "1.05rem", sm: "1.25rem" },
            whiteSpace: "nowrap"
          }}
        >
          Subscription Manager
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleColorMode} color="inherit" size="small">
            {mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
            {isAuthenticated ? (
              <Button onClick={handleLogout} color="inherit" size="small">
                Log Out
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit" size="small">
                  Log In
                </Button>
                <Button component={RouterLink} to="/register" color="inherit" size="small">
                  Register
                </Button>
              </>
            )}
          </Box>

          <IconButton
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="inherit"
            size="small"
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {isAuthenticated ? (
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            ) : (
              [
                <MenuItem 
                  key="login" 
                  component={RouterLink} 
                  to="/login" 
                  onClick={handleClose}
                >
                  Log In
                </MenuItem>,
                <MenuItem 
                  key="register" 
                  component={RouterLink} 
                  to="/register" 
                  onClick={handleClose}
                >
                  Register
                </MenuItem>
              ]
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}