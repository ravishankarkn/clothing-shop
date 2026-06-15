const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =====================
// GET ALL USERS
// =====================
router.get("/", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// =====================
// DELETE USER
// =====================
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "User deleted successfully" });
  });
});

// =====================
// UPDATE ROLE (user <-> admin)
// =====================
router.put("/:id/role", (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  db.query(
    "UPDATE users SET role=? WHERE id=?",
    [role, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Role updated successfully" });
    }
  );
});

module.exports = router;