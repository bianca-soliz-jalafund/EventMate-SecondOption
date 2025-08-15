import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./pages/MainLayout.tsx";
import EventsMainPage from "./pages/EventsMainPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { AuthProvider } from "./contexts/auth/AuthContext.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import MyEventsPage from "./pages/MyEventsPage.tsx";
import PermissionsPage from "./pages/PermissionsPage.tsx";
import { FirebaseNotificationsProvider } from "./contexts/notifications/FirebaseNotificationsContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <>
        <Toaster richColors/>
          <FirebaseNotificationsProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<EventsMainPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="my-events" element={<MyEventsPage />} />
                <Route path="permissions" element={<PermissionsPage />} />
              </Route>
            </Routes>
          </FirebaseNotificationsProvider>
        </>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
