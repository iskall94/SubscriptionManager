import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Box } from "@mui/material";

export default function Layout() {
  return (
		<Box 
			sx={{ 
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Navbar />
			<Box component="main" sx={{ flexGrow: 1 }}>
				<Outlet />
			</Box>
			<Footer />
    </Box>
  );
}