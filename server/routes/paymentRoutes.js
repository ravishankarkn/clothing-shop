const express =
require("express");

const Razorpay =
require("razorpay");

const router =
express.Router();

const razorpay = new Razorpay({

  key_id: "rzp_test_Sv6YeP45FKMDM8",

  key_secret: "Y0IZNs1QZtVpGjvdoyOUQprd"

});

module.exports = razorpay;

router.post(
  "/create-order",

  async (req, res) => {

    try {

      const options = {

        amount:
          req.body.amount * 100,

        currency: "INR",

        receipt:
          "receipt_order"

      };

      const order =

        await razorpay
          .orders
          .create(options);

      res.json(order);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Payment Failed"

      });

    }

  }

);

module.exports =
router;