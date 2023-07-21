import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../AuthProvider/AuthProvider";

export const StateContext = createContext();

const StateProvider = ({ children }) => {
  // const [allData, setAllData] = useState([]);
  const { user } = useContext(AuthContext);

  const [designerId, setDesignerId] = useState("");

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

  const {
    data: products,
    isLoading: productsIsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(["products", user, userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/product/get-products?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
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
  });

  const fetchCouriers = async () => {
    if (user) {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/courier/get-couriers?sellerId=${
          userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
        }`
      );
      const data = await res.json();
      return data.couriers;
    }
  };

  const { data: couriers, refetch } = useQuery(
    ["couriers", user, userInfo],
    fetchCouriers
  );

  console.log("uid", user?.uid);
  console.log(userInfo);

  const {
    data: stores,
    isLoading: storesIsLoading,
    isError: storesIsError,
    error: storesError,
    refetch: storesRefetch,
  } = useQuery(["stores", user, userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/store/get-stores-by-owner-id?id=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
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
    return response.json().then((data) => data?.stores);
  });

  const {
    data: suppliers,
    isLoading: suppliersIsLoading,
    isError: suppliersIsError,
    error: suppliersError,
    refetch: refetchSuppliers,
  } = useQuery(["suppliers", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/supplier/get-supplier?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
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
    return response.json().then((data) => data?.suppliers);
  });

  const stateInfo = {
    products,
    refetchProducts,
    productsIsLoading,
    couriers,
    userInfo,
    userInfoIsLoading,
    stores,
    storesIsLoading,
    storesRefetch,
    suppliers,
    refetchSuppliers,
  };

  return (
    <StateContext.Provider value={stateInfo}>{children}</StateContext.Provider>
  );
};
export default StateProvider;
