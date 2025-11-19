import { useState, Suspense, lazy } from "react";
import Mainlayout from "../component/Mainlayout.jsx";
import { useAuth } from "../utils/AuthProvider.jsx";

const AdminDashboard = lazy(() =>
  import("../component/AdminComponent/AdminDashboard.jsx")
);
const ResidentInFormationSystem = lazy(() =>
  import("../component/SecretaryComponent/ResidentManagement.jsx")
);
const Captain = () => {
    const { auth } = useAuth();
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const componentLabel = [
    { key: "dashboard", label: "Dashboard" },
    {
      key: "resident-information-system",
      label: "Resident Information System",
    },
  ];

  console.log("Captain auth:", auth);
  return (
    <div>
      <Mainlayout user_name={auth.user} activeComponent={activeComponent} setActiveComponent={setActiveComponent} componentLabel={componentLabel}>
        <Suspense fallback={<div>Loading...</div>}>
          {activeComponent === "dashboard" && <AdminDashboard />}
          {activeComponent === "resident-information-system" && 
            <ResidentInFormationSystem />
          }
        </Suspense>
      </Mainlayout>
    </div>
  );
};

export default Captain;
