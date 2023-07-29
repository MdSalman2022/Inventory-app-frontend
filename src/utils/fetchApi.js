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
