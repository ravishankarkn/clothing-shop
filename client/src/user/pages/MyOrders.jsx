import axios from "axios";
import { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => {
        let items = [];
        try {
          items = typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items || [];
        } catch {
          items = [];
        }

        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`order-status ${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="items">
              {items.map((item, index) => (
                <div key={index} className="item">
                  {/* ✅ show image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="item-image"
                      onError={(e) => e.target.style.display = "none"}
                    />
                  )}
                  <div className="item-details">
                    {/* ✅ title field (some orders use title, some use name) */}
                    <p>{item.title || item.name}</p>
                    <p>Size: {item.selectedSize || item.selected_size}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <p>Total: ₹{order.total}</p>
              <p>Payment: {order.payment_method}</p>
              <p>Date: {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;