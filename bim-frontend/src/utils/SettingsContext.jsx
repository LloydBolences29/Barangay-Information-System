import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // 1. Define the function (Just logic, no hooks or returns inside)
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/system-settings/all`);
      const data = await response.json();
      console.log("API DATA:", data); // <--- Add this line!
  

      const settingsArray = data.settings || [];
      const settingsObj = settingsArray.reduce((acc, item) => {
        // CHECK FOR 1 (Int) or "1" (String)

        acc[item.setting_key] = item.setting_value == 1;

        return acc;
      }, {});

      setSettings(settingsObj);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching settings:", error);
      setLoading(false);
    }
  };

  // 2. Call the Hook (Must be at the top level)
  useEffect(() => {
    fetchSettings();
  }, []);

  // 3. Return the JSX (Must be returned by the component, not the function)
  return (
    <SettingsContext.Provider
      value={{ settings, loading, refreshSettings: fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; // <--- End of Component

export const useSettings = () => {
  return useContext(SettingsContext);
};
