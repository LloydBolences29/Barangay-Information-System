import { Button } from "react-bootstrap";

const Navigation = ({ componentToRender, activeComponent, setActiveComponent }) => {
  return (
    <div id="sidebar-nav-container">
      <ul id="sidebar-nav-list">
        {componentToRender &&
          componentToRender.map((item) => {
            const isActive = activeComponent === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  onClick={() => setActiveComponent(item.id)}
                  // Combine base class with conditional active class
                  className={`nav-button ${isActive ? "active" : ""}`}
                  // Remove Bootstrap styling variants to use our custom CSS
                  variant="light" 
                >
                  {/* You can add icons here later */}
                  {item.label}
                </Button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Navigation;