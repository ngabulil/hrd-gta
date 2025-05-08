import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
