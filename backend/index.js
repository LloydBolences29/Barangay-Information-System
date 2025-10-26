require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

//importing routes
const userRoutes =  require("./routes/userRoutes");


app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 1000;
app.listen(PORT, '0.0.0.0',  () =>{
    console.log(`Server is running on port ${PORT}`)
})