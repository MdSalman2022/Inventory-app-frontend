import React, { useState } from "react";

const ImportBulkOrders = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/post-orders`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(file);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Import Order Csv</p>
        <button className="btn-primary btn-outline btn">Sample CSV</button>
      </div>

      <form onSubmit={handleUpload} className="flex flex-col gap-5">
        <input
          onChange={handleFileChange}
          type="file"
          className="file-input-bordered file-input w-full max-w-xs"
        />
        <button type="submit" className="btn-primary btn-outline btn w-fit">
          Upload
        </button>
      </form>
    </div>
  );
};

export default ImportBulkOrders;
