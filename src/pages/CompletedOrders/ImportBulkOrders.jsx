import React from "react";

const ImportBulkOrders = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <p className="font-semibold text-2xl">Import Order Csv</p>
        <button className="btn btn-primary btn-outline">Sample CSV</button>
      </div>

      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
      />
      <button className="btn btn-primary btn-outline w-fit">Upload</button>
    </div>
  );
};

export default ImportBulkOrders;
