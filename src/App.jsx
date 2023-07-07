import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes/Routes.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
