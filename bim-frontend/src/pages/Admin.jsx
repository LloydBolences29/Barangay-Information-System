import { useState, Suspense, lazy } from 'react'
import Mainlayout from '../component/Mainlayout.jsx'

//dynamic imports
const AdminDashboard = lazy(() => import('../component/AdminDashboard.jsx'));
const UserManagement = lazy(() => import('../component/UserManagement.jsx'));
const Admin = () => {
    const [activeComponent, setActiveComponent] = useState("dashboard");

  return (
    <div>
      <Mainlayout user_name="Admin User" activeComponent={activeComponent} setActiveComponent={setActiveComponent}>
        <Suspense fallback={<div>Loading...</div>}>
            {activeComponent === "dashboard" && <AdminDashboard />}
            {activeComponent === "user-management" && <UserManagement />}
        </Suspense>
      </Mainlayout>
    </div>
  )
}

export default Admin
