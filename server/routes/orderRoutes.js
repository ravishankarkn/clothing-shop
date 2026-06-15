const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// =====================
// MY ORDERS  ← moved above GET /
// =====================
router.get("/my-orders", (req, res) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );

    console.log("DECODED TOKEN:", decoded); // 👈 check this in terminal

    const userId = decoded.id || decoded.userId || decoded.user_id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const sql = `
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
      }

      const parsed = result.map((order) => {
        let items = [];
        let address = {};

        try {
          items =
            typeof order.items === "string"
              ? JSON.parse(order.items)
              : order.items || [];
        } catch (e) {
          items = [];
        }

        try {
          address =
            typeof order.address === "string"
              ? JSON.parse(order.address)
              : order.address || {};
        } catch (e) {
          address = {};
        }

        return { ...order, items, address };
      });

      res.json(parsed);
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// =====================
// PLACE ORDER
// =====================
router.post("/", async (req, res) => {
  const {
    user_id,
    user_name,
    email,
    mobile,
    items,
    total,
    address,
    payment_method,
  } = req.body;

  const sql = `
    INSERT INTO orders 
    (user_id, user_name, email, mobile, items, total, address, payment_method, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
  `;

  db.query(
    sql,
    [
      user_id,
      user_name,
      email,
      mobile,
      JSON.stringify(items || []),
      total,
      JSON.stringify(address || {}),
      payment_method,
    ],
    (err, result) => {
      if (err) {
        console.log("Order DB Error:", err);
        return res.status(500).send({ message: "Order Failed" });
      }

      res.status(200).send({
        message: "Order Placed",
        orderId: result.insertId,
      });
    }
  );
});

// =====================
// GET ALL ORDERS
// =====================
router.get("/", (req, res) => {
  const sql = "SELECT * FROM orders ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Fetch Orders Error:", err);
      return res.status(500).send({ message: "Server Error" });
    }

    const parsed = result.map((order) => {
      let items = [];
      let address = {};

      try {
        items =
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items || [];
      } catch (e) {
        items = [];
      }

      try {
        address =
          typeof order.address === "string"
            ? JSON.parse(order.address)
            : order.address || {};
      } catch (e) {
        address = {};
      }

      return { ...order, items, address };
    });

    res.status(200).send(parsed);
  });
});

// =====================
// UPDATE ORDER STATUS
// =====================
router.put("/:id/status", (req, res) => {
  const { status } = req.body;

  const sql = "UPDATE orders SET status=? WHERE id=?";

  db.query(sql, [status, req.params.id], (err) => {
    if (err) {
      console.log("Status Update Error:", err);
      return res.status(500).send({ message: "Update Failed" });
    }

    res.status(200).send({ message: "Status Updated" });
  });
});

module.exports = router;