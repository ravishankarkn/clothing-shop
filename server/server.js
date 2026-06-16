require('dotenv').config(); // 👈 ADD THIS AS FIRST LINE

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});