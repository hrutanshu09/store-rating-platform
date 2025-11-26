import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserStores from "./pages/user/UserStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import UpdatePassword from "./pages/common/UpdatePassword";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminAddStore from "./pages/admin/AdminAddStore";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public */}
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

        {/* Common */}
        <Route path="/update-password" element={
          <ProtectedRoute allowedRoles={["USER","ADMIN","OWNER"]}>
            <UpdatePassword />
          </ProtectedRoute>
        }/>

        {/* NEW ROUTES */}
        <Route path="/admin/add-user" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminAddUser />
          </ProtectedRoute>
        }/>

        <Route path="/admin/add-store" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminAddStore />
          </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  );
}
