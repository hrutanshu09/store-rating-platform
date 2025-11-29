import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserStores from "./pages/user/UserStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import UpdatePassword from "./pages/common/UpdatePassword";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import WelcomePage from "./pages/WelcomePage";

function Layout() {
  const location = useLocation();
  const noNavbarPages = ["/login", "/signup", "/"]; 

  const hideNavbar = noNavbarPages.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* USER */}
        <Route path="/stores" element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserStores />
          </ProtectedRoute>
        }/>

        {/* OWNER */}
        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={["OWNER"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }/>

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }/>

        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUsers />
          </ProtectedRoute>
        }/>

        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminStores />
          </ProtectedRoute>
        }/>

        <Route path="/admin/users/:id" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUserDetails />
          </ProtectedRoute>
        }/>

        {/* COMMON */}
        <Route path="/update-password" element={
          <ProtectedRoute allowedRoles={["USER","ADMIN","OWNER"]}>
            <UpdatePassword />
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
