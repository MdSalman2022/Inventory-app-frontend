import React from "react";
import { useQuery } from "react-query";

const Users = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    "customers",
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/get-users`,
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
      return response.json().then((data) => data?.users);
    },
    {
      cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
      staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    }
  );

  return (
    <div className="space-y-5">
      <p>Users</p>
      <hr />

      <div className="space-y-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <p>Show</p>
            <select name="page" id="page" className="input-bordered input p-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <p>entries</p>
          </div>
          <div className="flex items-center gap-2">
            <p>Search</p>
            <form>
              <input
                name="search-key"
                type="text"
                className="input-bordered input"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table bg-white">
            {/* head */}
            <thead>
              <tr>
                <th className="w-5"></th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id}>
                  <th className="w-5">1</th>
                  <td>{user?.username}</td>
                  <td>{user?.email}</td>
                  <td>
                    <button className="badge badge-success">Active</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-white">
              <tr>
                <th>Showing 1 to 2 of 2 entries</th>
                <th></th>
                <th></th>
                <th className="flex justify-end">
                  <div className="join">
                    <button className="join-item btn">Previous</button>
                    <button className="btn-primary join-item btn">1</button>
                    <button className="join-item btn ">Next</button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
