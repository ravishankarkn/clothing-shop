const express = require("express");

const router = express.Router();

const db = require("../config/db");



// GET ALL PRODUCTS

router.get("/", (req, res) => {

  const sql =
    "SELECT * FROM products";

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      res.status(500).send(err);

    } else {

      res.send(result);

    }

  });

});



// GET SINGLE PRODUCT

router.get("/:id", (req, res) => {

  const productId =
    req.params.id;

  const sql =
    "SELECT * FROM products WHERE id=?";

  db.query(

    sql,

    [productId],

    (err, result) => {

      if (err) {

        console.log(err);

        res.status(500).send(err);

      } else {

        res.send(result);

      }

    }
  );

});



// ADD PRODUCT

router.post(

  "/add-product",

  (req, res) => {

    const {

      title,

      description,

      price,

      category,

      stock,

      sizes,

      image,

      images

    } = req.body;

    const sql =
    `
    INSERT INTO products
    (
      title,
      description,
      price,
      category,
      stock,
      sizes,
      image,
      images
    )

    VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(

      sql,

      [

        title,

        description,

        price,

        category,

        stock,

        sizes,

        image,

        images

      ],

      (err, result) => {

        if (err) {

          console.log(err);

          res.status(500).send(err);

        } else {

          res.send(
            "Product Added Successfully"
          );

        }

      }
    );

  }
);



// DELETE PRODUCT

router.delete(

  "/:id",

  (req, res) => {

    const productId =
      req.params.id;

    const sql =
      "DELETE FROM products WHERE id=?";

    db.query(

      sql,

      [productId],

      (err, result) => {

        if (err) {

          console.log(err);

          res.status(500).send(err);

        } else {

          res.send(
            "Product Deleted Successfully"
          );

        }

      }
    );

  }
);



// UPDATE PRODUCT

router.put(

  "/:id",

  (req, res) => {

    const productId =
      req.params.id;

    const {

      title,

      description,

      price,

      category,

      stock,

      sizes,

      image,

      images

    } = req.body;

    const sql =
    `
    UPDATE products

    SET
    title=?,
    description=?,
    price=?,
    category=?,
    stock=?,
    sizes=?,
    image=?,
    images=?

    WHERE id=?
    `;

    db.query(

      sql,

      [

        title,

        description,

        price,

        category,

        stock,

        sizes,

        image,

        images,

        productId

      ],

      (err, result) => {

        if (err) {

          console.log(err);

          res.status(500).send(err);

        } else {

          res.send(
            "Product Updated Successfully"
          );

        }

      }
    );

  }
);

module.exports = router;