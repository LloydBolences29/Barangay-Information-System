import io from "socket.io-client";

// Get your backend URL from your env file (or hardcode it if testing)
const VITE_API_URL = import.meta.env.VITE_API_URL;

// Initialize the socket connection
const socket = io.connect(VITE_API_URL, {
  transports: ["websocket"], // Forces modern, fast connection
  autoConnect: true,         // Reconnect automatically if Wi-Fi drops
});

export default socket;