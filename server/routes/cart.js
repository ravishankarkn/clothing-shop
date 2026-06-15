const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD TO CART
// ADD TO CART
router.post("/add", (req, res) => {

  const {
    user_id,
    product_id,
    quantity,
    selected_size
  } = req.body;

  if (
    !user_id ||
    !product_id ||
    !quantity
  ) {

    return res
      .status(400)
      .json({

        success: false,

        message: "Missing data"

      });

  }

  const checkSql = `

SELECT *

FROM cart

WHERE
user_id=?
AND
product_id=?
AND
selected_size=?

`;

  db.query(

    checkSql,

    [
      user_id,
      product_id,
      selected_size
    ],

    (err, result) => {

      if (err) {

        return res
          .status(500)
          .json(err);

      }

      if (result.length > 0) {

        const updateSql = `

UPDATE cart

SET quantity=

quantity+?

WHERE id=?

`;

        db.query(

          updateSql,

          [
            quantity,
            result[0].id
          ],

          (err) => {

            if (err) {

              return res
                .status(500)
                .json(err);

            }

            res.json({

              success: true,

              message:
                "Quantity Updated"

            });

          }

        );

      }

      else {

        const insertSql = `

INSERT INTO cart
(
user_id,
product_id,
quantity,
selected_size
)

VALUES
(
?,
?,
?,
?
)

`;

        db.query(

          insertSql,

          [
            user_id,
            product_id,
            quantity,
            selected_size
          ],

          (err) => {

            if (err) {

              return res
                .status(500)
                .json(err);

            }

            res.json({

              success: true,

              message:
                "Added To Cart"

            });

          }

        );

      }

    }

  );

});


// GET USER CART
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT
      cart.id,
      cart.quantity,
      cart.selected_size,
      products.title,
      products.price,
      products.image
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});


// REMOVE ITEM
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM cart WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
      });
    }
  );
});

module.exports = router;