import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./utils/AuthProvider.jsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";

function App() {
  const LoginForm = lazy(() => import("./pages/Login.jsx"));
  const UserManagement = lazy(() => import("./component/UserManagement.jsx"));
  const AdminPage = lazy(() => import("./pages/Admin.jsx"));

  return (
    <>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginForm />} />

            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </>
  );
}

export default App;
