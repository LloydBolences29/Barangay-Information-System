import { Suspense, lazy, useState } from "react";
import Mainlayout from "../component/Mainlayout.jsx";
import { useAuth } from "../utils/AuthProvider.jsx";


const TreasurerComponent = lazy(() =>
  import("../component/TreasurerComponent/TreasurerForm.jsx")
);
const Dashboard = lazy(() =>
  import("../component/TreasurerComponent/TreasurerDashboard.jsx")
);
const Treasurer = () => {
  const { auth } = useAuth();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const componentLabel = [
    { key: "dashboard", label: "Dashboard" },
    { key: "treasurer-form", label: "Forms" },
  ];
  return (
    <div>
      <Mainlayout
        user_name={`${auth.user.charAt(0).toUpperCase() + auth.user.slice(1)} user`}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        componentLabel={componentLabel}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {activeComponent === "dashboard" && <Dashboard />}
          {activeComponent === "treasurer-form" && <TreasurerComponent />}
        </Suspense>
      </Mainlayout>
    </div>
  );
};

export default Treasurer;
