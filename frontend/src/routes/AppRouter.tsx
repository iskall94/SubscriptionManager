import { createBrowserRouter, RouterProvider } from "react-router-dom";
import  HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
	{
    element: <Layout />,
      children: 
			[
        {
					path: "/",
					index: true,
        	element: <HomePage />
				},
    		{
        	path: "/login",
        	element: <LoginPage />
    		},
    		{
        	path: "/register",
        	element: <RegisterPage />
    		},
    		{
       		element: <ProtectedRoute />,
        	children: 
					[
            {
							path: "/dashboard",
              element: <DashboardPage />
            }
        	]
				},
				{
        path: "*",
        element: <NotFoundPage />,
      	},
      ]
  }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}