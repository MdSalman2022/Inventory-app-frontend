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
import InvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import AllOrdersSearch from "@/pages/AllOrdersSearch/AllOrdersSearch";
import ErrorPage from "@/layout/Main/ErrorPage";
import LandingPageLayout from "@/layout/LandingPageLayout";
import LandingPage from "@/pages/LandingPage/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/inventory/",
    element: (
      <PrivateRoute>
        <Main></Main>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/inventory/overview",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/customers",
        element: (
          <PrivateRoute>
            <Customers />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/customers/profile/:id",
        element: <CustomerProfile />,
      },
      {
        path: "/inventory/marchants/seller/profile/:id",
        element: <SellerProfile />,
      },
      {
        path: "/inventory/start-order",
        element: (
          <PrivateRoute>
            <StartOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/products",
        element: (
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/orders-processing",
        element: (
          <PrivateRoute>
            <OrderProcessing />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/orders-processing/import-csv",
        element: (
          <PrivateRoute>
            <ImportBulkOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/all-ready-orders",
        element: (
          <PrivateRoute>
            <AllReadyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/completed-orders",
        element: (
          <PrivateRoute>
            <CompletedOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/returned-orders",
        element: (
          <PrivateRoute>
            <ReturnedOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/cancelled-orders",
        element: (
          <PrivateRoute>
            <CancelledOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/loss-profit",
        element: (
          <PrivateRoute>
            <LossProfitPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/transactions",
        element: (
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/profile",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/users",
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/marchants",
        element: (
          <PrivateRoute>
            <Marchants />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/couriers",
        element: (
          <PrivateRoute>
            <Couriers />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/couriers/:name",
        element: (
          <PrivateRoute>
            <CourierPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/stores",
        element: (
          <PrivateRoute>
            <Store />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/supplier",
        element: (
          <PrivateRoute>
            <SupplierPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/invoice-generator",
        element: (
          <PrivateRoute>
            <InvoiceGenerator />
          </PrivateRoute>
        ),
      },
      {
        path: "/inventory/orders/all",
        element: (
          <PrivateRoute>
            <AllOrdersSearch />
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
