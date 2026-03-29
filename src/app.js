const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://med-gallery-ui.vercel.app", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
module.exports = app;
