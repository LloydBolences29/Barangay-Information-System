import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

function App() {
  const LoginForm = lazy(() => import("./pages/Login.jsx"));
  const UserManagement = lazy(() => import("./component/UserManagement.jsx"));

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/user-management" element={<UserManagement />} />
          </Routes>
      </Suspense>
    </>
  );
}

export default App;
