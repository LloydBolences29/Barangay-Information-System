import { useState, Suspense, lazy } from 'react'
import Mainlayout from '../component/Mainlayout.jsx'

//dynamic imports
const AdminDashboard = lazy(() => import('../component/AdminComponents/AdminDashboard.jsx'));
const UserManagement = lazy(() => import('../component/AdminComponents/UserManagement.jsx'));
const Admin = () => {
    const componentLabel = [
    { key: "dashboard", label: "Dashboard" },
    { key: "user-management", label: "User Management" },
    
    ]

    const [activeComponent, setActiveComponent] = useState("dashboard");

  return (
    <div>
      <Mainlayout user_name="Admin User" activeComponent={activeComponent} setActiveComponent={setActiveComponent} componentLabel={componentLabel}>
        <Suspense fallback={<div>Loading...</div>}>
            {activeComponent === "dashboard" && <AdminDashboard />}
            {activeComponent === "user-management" && <UserManagement />}
        </Suspense>
      </Mainlayout>
    </div>
  )
}

export default Admin
