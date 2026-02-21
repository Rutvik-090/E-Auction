import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

import { UserLayout } from "../components/layout/UserLayout";

import { Home } from "../pages/Home";
import AuctionDetails from "../pages/user/AuctionDetails";
import AuctionList from "../pages/user/AuctionList";
import CreateAuction from "../pages/user/CreateAuction";
import DashBoard from "../pages/user/DashBoard";

import ProtectedRoute from "../routes/ProtectedRoute";

const router = createBrowserRouter([
  // Public Routes
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "auctions", element: <AuctionList /> },
      { path: "auction/:id", element: <AuctionDetails /> },

      // Protected Routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-auction",
        element: (
          <ProtectedRoute>
            <CreateAuction />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
