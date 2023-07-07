import React, { useContext } from "react";
import StatCard from "../../components/Main/Dashboard/StatCard";
import { useQuery } from "react-query";
import { StateContext } from "../../contexts/StateProvider/StateProvider";

const LossProfitPage = () => {
  const { products } = useContext(StateContext);

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

  const completedOrders = orders?.filter(
    (order) => order.orderStatus === "completed"
  );

  console.log(completedOrders);

  const TotalProfit = completedOrders?.reduce((acc, order) => {
    // console.log(order);
    return (
      acc +
      order.products.reduce((ac, item) => {
        // console.log(ac);
        // console.log(item?.salePrice - item.liftPrice);
        const profit =
          Math.abs(item?.salePrice - item?.liftPrice) * item?.quantity;
        console.log(profit);
        return ac + profit;
      }, 0)
    );
  }, 0);

  console.log(orders?.length);
  console.log(TotalProfit);

  return (
    <div className="space-y-5">
      <div className="flex gap-5">
        <input
          type="text"
          className="input-bordered input"
          placeholder="From"
        />
        <input type="text" className="input-bordered input" placeholder="To" />
        <button className="btn-primary btn">Search</button>
      </div>
      <p className="text-4xl">Loss Profit Details</p>
      <p>
        This Figure is calculated based on the data you provided in your product
        details.
      </p>
      <p>Note: Red 0-39%, Yellow 40-59%, Blue 60-79%, Green above 79%</p>

      <div className="grid grid-cols-4 gap-5">
        <StatCard>
          <p className="font-semibold">Total Orders</p>
          <p>{orders?.length}</p>

          <progress
            className="progress-success progress w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
        <StatCard>
          <p className="font-semibold">Total Products</p>
          <p>{products?.length}</p>

          <progress
            className="progress-success progress w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
        <StatCard>
          <p className="font-semibold">Total Sale</p>
          <p>{completedOrders?.length}</p>

          <progress
            className="progress-success progress w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
        <StatCard>
          <p className="font-semibold">Total Profit</p>
          <p>{TotalProfit}</p>

          <progress
            className="progress-success progress w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
      </div>
    </div>
  );
};

export default LossProfitPage;
