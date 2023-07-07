import React from "react";
import StatCard from "../../components/Main/Dashboard/StatCard";
import { AiOutlineOrderedList, AiOutlineShoppingCart } from "react-icons/ai";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { BsFillBarChartFill, BsPeopleFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { TbCurrencyTaka } from "react-icons/tb";

const Dashboard = () => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("orders", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/get-orders/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    return response.json().then((data) => data.orders);
  });

  const orderInProcess = orders?.filter(
    (order) => order.orderStatus === "processing"
  );

  const orderCashInProcess = orderInProcess?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const orderReady = orders?.filter((order) => order.orderStatus === "ready");

  const orderCashReady = orderReady?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const orderCompleted = orders?.filter(
    (order) => order.orderStatus === "completed"
  );

  const orderCashCompleted = orderCompleted?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const todaysOrders = orders?.filter((order) => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  console.log(todaysOrders);

  const todaysOrderCash = todaysOrders?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const YesterdayOrders = orders?.filter((order) => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return (
      orderDate.getDate() === today.getDate() - 1 &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  console.log(YesterdayOrders);

  const YesterdayOrderCash = YesterdayOrders?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const thisWeekOrdersFromFridayToToday = orders?.filter((order) => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return (
      orderDate.getDate() >= today.getDate() - 1 &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const thisWeekOrderCash = thisWeekOrdersFromFridayToToday?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const thisMonthOrders = orders?.filter((order) => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return (
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const thisMonthOrderCash = thisMonthOrders?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  const lastMonthOrders = orders?.filter((order) => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return (
      orderDate.getMonth() === today.getMonth() - 1 &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const lastMonthOrderCash = lastMonthOrders?.reduce(
    (acc, order) => acc + parseInt(order.total),
    0
  );

  console.log(thisWeekOrdersFromFridayToToday);

  const orderSummary = [
    {
      name: "On Process",
      value: `${orderInProcess?.length > 0 ? orderInProcess?.length : 0} (৳${
        orderInProcess?.length > 0 ? orderCashInProcess : 0
      })`,
      icon: <AiOutlineOrderedList />,
    },
    {
      name: "Ready Orders",
      value: `${orderReady?.length || 0} (৳${orderCashReady || 0})`,
      icon: <LiaFileInvoiceSolid />,
    },
    {
      name: "Today's Send",
      value: `${orderCompleted?.length || 0} (৳${orderCashCompleted || 0})`,
      icon: <BsFillBarChartFill />,
    },
    {
      name: "Today's Sale(Qty)",
      value: `${todaysOrders?.length || 0} (৳${todaysOrderCash || 0})`,
      icon: <AiOutlineShoppingCart />,
    },
  ];

  const customers = [
    {
      name: "Today",
      value: "0",
      icon: <BsPeopleFill />,
    },
    {
      name: "This Month",
      value: "3",
      icon: <BsPeopleFill />,
    },
    {
      name: "Total",
      value: "2",
      icon: <BsPeopleFill />,
    },
    {
      name: "Repeated",
      value: "1 (50.00)%",
      icon: <BsPeopleFill />,
    },
  ];

  const stats = [
    {
      name: "Yesterday's",
      sales: YesterdayOrderCash || 0,
      stats: {
        orders: YesterdayOrders?.length || 0,
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
    {
      name: "This Week",
      sales: thisWeekOrderCash || 0,
      stats: {
        orders: thisWeekOrdersFromFridayToToday?.length || 0,
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
    {
      name: "This Month",
      sales: thisMonthOrderCash || 0,
      stats: {
        orders: thisMonthOrders?.length || 0,
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
    {
      name: "Last Month",
      sales: lastMonthOrderCash || 0,
      stats: {
        orders: lastMonthOrders?.length || 0,
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xl">Order Summary</p>
      <div className="grid grid-cols-4 gap-5">
        {orderSummary.map((order, index) => (
          <StatCard key={index}>
            <div className="flex h-16 items-center justify-between p-2">
              <div className="flex flex-col gap-3">
                <p>{order.name}</p>
                <p className="text-2xl">{order.value}</p>
              </div>
              <span className="rounded-lg bg-[#f5f5f5] p-2 text-3xl">
                {order.icon}
              </span>
            </div>
          </StatCard>
        ))}
      </div>
      <p className="text-xl">Customers</p>
      <div className="grid grid-cols-4 gap-5">
        {customers.map((customer, index) => (
          <StatCard key={index}>
            <div className="flex h-16 items-center justify-between p-2">
              <div className="flex flex-col gap-3">
                <p>{customer.name}</p>
                <p className="text-2xl">{customer.value}</p>
              </div>
              <span className="rounded-lg bg-[#f5f5f5] p-2 text-3xl">
                {customer.icon}
              </span>
            </div>
          </StatCard>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <div className="flex flex-col gap-2 p-2">
              <p className="text-xl">{stat.name}</p>
              <div className="flex justify-between">
                <p className="font-medium">Sales:</p>
                <p className="flex w-32 justify-center rounded-lg bg-gray-200 py-1 text-2xl font-medium">
                  {stat.sales}
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <p className="font-medium">Orders:</p>
                  <p className="text-lg">{stat.stats.orders}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Quantity:</p>
                  <p className="text-lg">{stat.stats.quantity}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Customer:</p>
                  <p className="text-lg">{stat.stats.customer}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Return:</p>
                  <p className="text-lg">{stat.stats.return}</p>
                </div>
              </div>
            </div>
          </StatCard>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
