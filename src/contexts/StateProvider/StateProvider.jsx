import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../AuthProvider/AuthProvider";

export const StateContext = createContext();

const StateProvider = ({ children }) => {
  // const [allData, setAllData] = useState([]);
  const { user } = useContext(AuthContext);

  const [designerId, setDesignerId] = useState("");

  const {
    data: products,
    isLoading: productsIsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(
    ["products", user],
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/product/get-products`,
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
      return response.json().then((data) => {
        return data.products;
      });
    },
    {
      cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
      staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    }
  );

  const fetchCouriers = async () => {
    if (user) {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/courier/get-couriers`
      );
      const data = await res.json();
      return data.couriers;
    }
  };

  const { data: couriers, refetch } = useQuery(
    ["couriers", user],
    fetchCouriers
  );

  console.log("uid", user?.uid);

  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    isError: userIsError,
    error: userError,
    refetch: userRefetch,
  } = useQuery(
    ["user", user?.uid],
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/get-user?id=${user?.uid}`,
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
      return response.json().then((data) => {
        return data.user;
      });
    },
    {
      cacheTime: 10 * 60 * 1000, // Cache data for 30 minutes
      staleTime: 5 * 60 * 1000, // Consider data fresh for 10 minutes
    }
  );

  const stateInfo = {
    products,
    refetchProducts,
    productsIsLoading,
    couriers,
    userInfo,
    userInfoIsLoading,
  };

  return (
    <StateContext.Provider value={stateInfo}>{children}</StateContext.Provider>
  );
};
export default StateProvider;
