import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Buy from "./Buy";

import { createHashRouter, RouterProvider } from "react-router-dom";
import Info from "./Info";
import Home from "./Home";
import Analytics from "./Analytics";
import Roothasher from "./RootHasher";

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
  {
    path: "/analytics",
    element: <Analytics />,
  },
  {
    path: "/hasher",
    element: <Roothasher />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
