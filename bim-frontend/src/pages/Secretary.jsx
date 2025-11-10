import { Suspense, lazy, useState } from "react"
import Mainlayout from "../component/Mainlayout.jsx"

const SecretaryComponent = lazy(() => import('../component/SecretaryComponent/ResidentManagement.jsx'));
const Dashboard = lazy(() => import('../component/SecretaryComponent/SecretaryDashboard.jsx'))
const Secretary = () => {
    const [activeComponent, setActiveComponent] = useState("dashboard");

    const componentLabel = [
    { key: "dashboard", label: "Dashboard" },
    { key: "resident-information-system", label: "Resident Information System" },
    
    ]
  return (
    <div>
      <Mainlayout user_name="Secretary User" activeComponent={activeComponent} setActiveComponent={setActiveComponent} componentLabel={componentLabel}>
        <Suspense fallback={<div>Loading...</div>}>
        {activeComponent === "dashboard"  && <Dashboard />}
        {activeComponent === "resident-information-system"  && <SecretaryComponent />}
        </Suspense>
      </Mainlayout>
    </div>
  )
}

export default Secretary;
