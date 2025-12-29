// Navigation.jsx
import { Button } from "react-bootstrap";

// Receive activeComponent and setActiveComponent from props
const Navigation = ({ componentToRender, activeComponent, setActiveComponent }) => {

  return (
    <div id="sidebar-nav-container">
      <ul id="sidebar-nav-list">
        {componentToRender &&
          componentToRender.map((label) => (
            <li key={label.id}>
              <Button
                // Use the setter passed from parent
                onClick={() => setActiveComponent(label.id)} 
                className="nav-button"
                variant={
                  // Compare with the prop passed from parent
                  activeComponent === label.id
                    ? "primary"
                    : "outline-primary"
                }
              >
                {label.label}
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Navigation;