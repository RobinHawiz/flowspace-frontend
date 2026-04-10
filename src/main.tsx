import "@src/main.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@src/queryClient";
import { AuthProvider } from "@contexts/AuthProvider";
import App from "@src/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/sign-up",
        lazy: () => import("@publicRoutes/sign-up/Page"),
        hydrateFallbackElement: <></>,
      },
      {
        path: "/log-in",
        lazy: () => import("@publicRoutes/log-in/Page"),
        hydrateFallbackElement: <></>,
      },
      {
        path: "/*",
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </AuthProvider>
  </QueryClientProvider>,
);
