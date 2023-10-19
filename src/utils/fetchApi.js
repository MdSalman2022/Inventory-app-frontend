export const CreateUserLog = (id) => {
  fetch(`${import.meta.env.VITE_SERVER_URL}/userlog/create-log`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      userId: id,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        console.log(result);
      } else {
        console.error(result);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export const EditUserLog = (id, logType, logMessage) => {
  fetch(`${import.meta.env.VITE_SERVER_URL}/userlog/edit-log?id=${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      logType,
      logMessage,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("result edit user", result);
      if (result.success) {
        console.log("edit log success", result);
      } else {
        console.log("edit log failed", result);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export const searchOrderByIdUniFunc = async (orderId, userInfo) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/order/search-order?orderId=${orderId}&sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const resultFromDB = await response.json();
      if (resultFromDB.success) {
        return resultFromDB.orders;
      } else {
        throw new Error("Failed to find order");
      }
    } else {
      throw new Error("Failed to find order");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to find order");
  }
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  return { date: formattedDate, time: formattedTime };
};
