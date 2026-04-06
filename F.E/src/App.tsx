import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./core/routes";
import { queryClient } from "./core/utils/queryClientHook";
import "./core/css/style.css";
import "./core/css/animate.css";
import "./core/css/login.css";
import "./core/css/customs-menu-antd.css";
import "./core/css/customs-tabs-antd.css";
import { ConfigProvider } from "antd";

import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#2196f3",
            },
            components: {
              Menu: {
                itemSelectedBg: "transparent",
              },

            },
          }}
        >
          <Toaster position="top-center" reverseOrder={false} />
          <RouterProvider router={router} />
        </ConfigProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
