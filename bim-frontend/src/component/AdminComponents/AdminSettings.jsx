import React from 'react'
import { useSettings } from '../../utils/SettingsContext'
const AdminSettings = () => {

    const { settings, loading, refreshSettings } = useSettings();
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    const handleToggle =  async (key, currentValue) => {
        const newValue = !currentValue;

        try {
            await fetch(`${VITE_API_URL}/api/system-settings/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key, value: newValue }),
            });

            // Refresh settings after update
            refreshSettings();
        } catch (error) {
            console.error("Failed to update setting:", error);
        }
    }
  return (
<div className="p-4">
            <h2>System Configuration</h2>
            
            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.payment_required}
                    onChange={() => handleToggle('payment_required', settings.payment_required)}
                />
                <label className="form-check-label">
                    Require Payment for Certificates
                </label>
            </div>

            {/* <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.feature_captain_approval || false}
                    onChange={() => handleToggle('feature_captain_approval', settings.feature_captain_approval)}
                />
                <label className="form-check-label">
                    Require Captain Approval
                </label>
            </div> */}
        </div>
  )
}

export default AdminSettings
