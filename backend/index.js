require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

//importing routes
const userRoutes =  require("./routes/userRoutes");
const residentRoutes = require("./routes/residentRoutes");
const statsRoutes = require("./routes/statsRoutes");
const systemSettingsRoutes = require("./routes/systemSettings");
const auditLogsRoutes = require("./routes/auditLogsRoutes");
const queueRoutes = require("./routes/queueRoutes");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
        credentials: true
    }
});

// 5. Create the Connection Handler
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // LISTENER: When the Treasurer confirms a payment
  socket.on("update_queue", (data) => {
    // BROADCAST: Send this data to everyone else (Secretary, Monitors)
    socket.broadcast.emit("receive_queue_update", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/system-settings", systemSettingsRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/queues", queueRoutes);

const PORT = process.env.PORT || 1000;
server.listen(PORT, '0.0.0.0',  () =>{
    console.log(`Server is running on port ${PORT}`)
})