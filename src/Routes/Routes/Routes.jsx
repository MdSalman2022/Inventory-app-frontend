import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/Main/Main";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Customers from "../../pages/Customers/Customers";
import StartOrder from "../../pages/StartOrder/StartOrder";
import Products from "../../pages/Products/Products";
import OrderProcessing from "../../pages/OrderProcessing/OrderProcessing";
import ImportBulkOrders from "../../pages/OrderProcessing/ImportBulkOrders";
import AllReadyOrders from "../../pages/AllReadyOrders/AllReadyOrders";
import CompletedOrders from "../../pages/CompletedOrders/CompletedOrders";
import ReturnedOrders from "../../pages/ReturnedOrders/ReturnedOrders";
import CancelledOrders from "../../pages/CancelledOrders/CancelledOrders";
import LossProfitPage from "../../pages/LossProfitPage/LossProfitPage";
import Transaction from "../../pages/Transaction/Transaction";
import Settings from "../../pages/Settings/Settings";
import Users from "../../pages/Users/Users";
import Couriers from "../../pages/Couriers/Couriers";
import CourierPage from "../../pages/CourierPage/CourierPage";
import Register from "../../pages/Authentication/Register/Register";
import Login from "../../pages/Authentication/Login/Login";
import PrivateRoute from "../PrivateRoutes/PrivateRoutes";
import EmailVerificationSentPage from "../../pages/EmailVerificationSentPage/EmailVerificationSentPage";
import FullScreenPage from "../../layout/Main/FullScreenPage/FullScreenPage";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import CustomerProfile from "@/pages/Customers/CustomerProfile";
import Store from "@/pages/Store/Store";
import SupplierPage from "@/pages/SupplierPage/SupplierPage";
import AccountDisabledPage from "@/pages/AccountDisabledPage/AccountDisabledPage";
import Marchants from "@/pages/Marchants/Marchants";
import SellerProfile from "@/pages/SellerProfile/SellerProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "/customers",
        element: (
          <PrivateRoute>
            <Customers />
          </PrivateRoute>
        ),
      },
      {
        path: "/customer/profile/:id",
        element: <CustomerProfile />,
      },
      {
        path: "/seller/profile/:id",
        element: <SellerProfile />,
      },
      {
        path: "/start-order",
        element: (
          <PrivateRoute>
            <StartOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "/products",
        element: (
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders-processing",
        element: (
          <PrivateRoute>
            <OrderProcessing />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders-processing/import-csv",
        element: (
          <PrivateRoute>
            <ImportBulkOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/all-ready-orders",
        element: (
          <PrivateRoute>
            <AllReadyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/completed-orders",
        element: (
          <PrivateRoute>
            <CompletedOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/returned-orders",
        element: (
          <PrivateRoute>
            <ReturnedOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/cancelled-orders",
        element: (
          <PrivateRoute>
            <CancelledOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/loss-profit",
        element: (
          <PrivateRoute>
            <LossProfitPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: "/marchants",
        element: (
          <PrivateRoute>
            <Marchants />
          </PrivateRoute>
        ),
      },
      {
        path: "/couriers",
        element: (
          <PrivateRoute>
            <Couriers />
          </PrivateRoute>
        ),
      },
      {
        path: "/couriers/:name",
        element: (
          <PrivateRoute>
            <CourierPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/stores",
        element: (
          <PrivateRoute>
            <Store />
          </PrivateRoute>
        ),
      },
      {
        path: "/supplier",
        element: (
          <PrivateRoute>
            <SupplierPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <FullScreenPage />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/email-verification-sent",
        element: <EmailVerificationSentPage />,
      },
      {
        path: "/account-disabled",
        element: <AccountDisabledPage />,
      },
    ],
  },
]);
