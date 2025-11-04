import { useEffect, useState } from "react";

//imports
import { Table, Button } from "react-bootstrap";

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/users/get-all-users`, {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched users:", data);
      if (response.ok) {
        setUserData(data.users);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    
  }, []);

  console.log("Users state:", userData);
  return (
    <>
      <Table striped bordered hover className="m-2">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(userData) &&
            userData.length > 0 &&
            userData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.username}</td>
                <td>{user.user_role}</td>
                <td>{user.is_active === 1 ? "active" : "inactive"}</td>
                <td>
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default AdminDashboard;
