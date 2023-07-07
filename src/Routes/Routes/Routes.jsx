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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/start-order",
        element: <StartOrder />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/orders-processing",
        element: <OrderProcessing />,
      },
      {
        path: "/orders-processing/import-csv",
        element: <ImportBulkOrders />,
      },
      {
        path: "/all-ready-orders",
        element: <AllReadyOrders />,
      },
      {
        path: "/completed-orders",
        element: <CompletedOrders />,
      },
      {
        path: "/returned-orders",
        element: <ReturnedOrders />,
      },
      {
        path: "/cancelled-orders",
        element: <CancelledOrders />,
      },
      {
        path: "/loss-profit",
        element: <LossProfitPage />,
      },
      {
        path: "/transactions",
        element: <Transaction />,
      },
      {
        path: "/profile",
        element: <Settings />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/couriers",
        element: <Couriers />,
      },
    ],
  },
]);
