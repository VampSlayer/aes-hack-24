import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Buy from "./Buy";

import { createHashRouter, RouterProvider } from "react-router-dom";
import Info from "./Info";
import Home from "./Home";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/buy",
    element: <Buy />,
  },
  {
    path: "/info",
    element: <Info />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
