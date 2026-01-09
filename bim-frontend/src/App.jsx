import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./utils/AuthProvider.jsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import { ResidentProvider } from "./utils/ResidentContext.jsx";
import { SettingsProvider } from "./utils/SettingsContext.jsx";
import socket from "./utils/socketService.jsx";

socket.on("connect", () => {
  console.log("Connected to socket server with ID:", socket.id);
});

const LoginForm = lazy(() => import("./pages/Login.jsx"));
const UserManagement = lazy(() =>
  import("./component/AdminComponents/UserManagement.jsx")
);
const AdminPage = lazy(() => import("./pages/Admin.jsx"));
const SecretaryPage = lazy(() => import("./pages/Secretary.jsx"));
const CaptainPage = lazy(() => import("./pages/Captain.jsx"));
const TreasurerPage = lazy(() => import("./pages/Treasurer.jsx"));
const TreasurerFormRenderer = lazy(() =>
  import("./component/TreasurerFormRenderer.jsx")
);

const ChangePassword = lazy(() => import("./pages/ChangePassword.jsx"));
function App() {
  return (
    <>
      <AuthProvider>
        <ResidentProvider>
          <SettingsProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<LoginForm />} />

                <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route
                  element={
                    <ProtectedRoutes
                      allowedRoles={[
                        "admin",
                        "captain",
                        "secretary",
                        "treasurer",
                      ]}
                    />
                  }
                >
                  <Route path="/change-password" element={<ChangePassword />} />
                </Route>
                <Route element={<ProtectedRoutes allowedRoles={["captain"]} />}>
                  <Route path="/captain" element={<CaptainPage />} />
                </Route>
                <Route
                  element={<ProtectedRoutes allowedRoles={["secretary"]} />}
                >
                  <Route path="/secretary" element={<SecretaryPage />} />
                </Route>
                <Route
                  element={<ProtectedRoutes allowedRoles={["treasurer"]} />}
                >
                  <Route path="/treasurer" element={<TreasurerPage />} />
                  <Route
                    path="/treasurer/:id"
                    element={<TreasurerFormRenderer />}
                  />
                </Route>
              </Routes>
            </Suspense>
          </SettingsProvider>
        </ResidentProvider>
      </AuthProvider>
    </>
  );
}

export default App;
