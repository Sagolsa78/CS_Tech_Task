const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rootRouter = require("./Routes/index");

dotenv.config();

connectDB();

const app = express();

// app.use(cors({
//   origin: process.env.CLIENT_URL || "*", 
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// ✅ Allow requests from frontend
// app.use(cors({
//   origin: "http://localhost:5173", // your frontend
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }))


app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true,
}));

app.use(express.json());

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
