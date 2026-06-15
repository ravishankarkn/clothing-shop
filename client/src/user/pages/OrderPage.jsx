import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/user.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderPage = () => {
const navigate = useNavigate();
const location = useLocation();

const productData = location.state;

const [formData, setFormData] = useState({
name: "",
phone: "",
address: "",
city: "",
pincode: "",
payment: "COD",
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const clearPurchasedCart = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) return;

  const orderedItems = productData.cart ? productData.cart : [productData];

  try {
    await Promise.all(
      orderedItems.map((item) =>
        axios.delete(`https://clothing-shop-server.onrender.com/api/cart/${item.id}`)
      )
    );
  } catch (err) {
    console.log("Cart cleanup error:", err);
  }

  const cartKey = `cart_${user.id}`;

  localStorage.removeItem(cartKey);

  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("cartUpdated"));
};

const handleOrder = async () => {
  if (
    !formData.name ||
    !formData.phone ||
    !formData.address ||
    !formData.city ||
    !formData.pincode
  ) {
    toast.warn("Please Fill All Details");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    toast.info("User not logged in");
    return;
  }

  const amount = productData.cart
    ? productData.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    : productData.price;

  const orderPayload = {
    user_id: user.id,
    user_name: user.name || "User",
    email: user.email || "",
    mobile: formData.phone,
    items: productData.cart ? productData.cart : [productData],
    total: amount,
    address: {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
    },
    payment_method: formData.payment,
  };

  if (formData.payment === "COD") {
    try {
      await axios.post("https://clothing-shop-server.onrender.com/orders", orderPayload);

      await clearPurchasedCart();

      navigate("/order-success", {
        state: {
          orderDetails: formData,
          productDetails: productData,
        },
      });
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Order Failed. Please try again.");
    }
  }

  else if (formData.payment === "UPI") {
    try {
      const res = await axios.post(
        "https://clothing-shop-server.onrender.com/payment/create-order",
        { amount }
      );

      const options = {
        key: "rzp_test_Sv6YeP45FKMDM8",
        amount: res.data.amount,
        currency: "INR",
        name: "Lebrel Store",
        description: "Fashion Order",
        order_id: res.data.id,

        handler: async function () {
          try {
            await axios.post("https://clothing-shop-server.onrender.com/orders", orderPayload);

            await clearPurchasedCart();

            navigate("/order-success", {
              state: {
                orderDetails: formData,
                productDetails: productData,
              },
            });
          } catch (err) {
            console.log(err.response?.data || err.message);
            toast.error("Order saving failed after payment.");
          }
        },

        theme: { color: "#000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Payment Failed");
    }
  }
};

return (

<div className="order-page">

<div className="order-container">

<div className="order-product">

{productData?.cart ? (

productData.cart.map(
(
item,
index
) => (

<div
key={index}
className="order-item"
>

<img
src={item.image}
alt=""
/>

<div>

<h2>
{item.title}
</h2>

<h3>
₹ {item.price}
</h3>

<p>
Size :
{item.selectedSize}
</p>

<p>
Quantity :
{item.quantity}
</p>

</div>

</div>

)
)

) : (

<div className="order-item">

<img
src={productData.image}
alt=""
/>

<div>

<h2>
{productData.title}
</h2>

<h3>
₹ {productData.price}
</h3>

<p>
Size :
{productData.selectedSize}
</p>

</div>

</div>

)}

</div>

<div className="delivery-form">

<h1>
Delivery Details
</h1>

<input
type="text"
placeholder="Full Name"
name="name"
onChange={handleChange}
/>

<input
type="number"
placeholder="Phone Number"
name="phone"
onChange={handleChange}
/>

<textarea
placeholder="Address"
name="address"
onChange={handleChange}
/>

<input
type="text"
placeholder="City"
name="city"
onChange={handleChange}
/>

<input
type="number"
placeholder="Pincode"
name="pincode"
onChange={handleChange}
/>

<select
name="payment"
onChange={handleChange}
>

<option value="COD">
Cash On Delivery
</option>

<option value="UPI">
UPI
</option>

</select>

<button
onClick={handleOrder}
>
Place Order
</button>

</div>

</div>

</div>

);

};

export default OrderPage;