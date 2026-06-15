import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import AdminSidebar from "../components/AdminSidebar";

import "../styles/admin.css";
import { toast } from "react-toastify";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/login" />;

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/orders/${orderId}/status`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchFilter =
      filter === "All" || order.status === filter;

    const matchSearch =
      order.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="admin-main">

        {/* HEADER */}
        <div className="products-header">
          <h1>Manage Orders</h1>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER BUTTONS */}
        <div className="filter-buttons">
          <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button>
          <button className={filter === "Pending" ? "active" : ""} onClick={() => setFilter("Pending")}>Pending</button>
          <button className={filter === "Processing" ? "active" : ""} onClick={() => setFilter("Processing")}>Processing</button>
          <button className={filter === "Shipped" ? "active" : ""} onClick={() => setFilter("Shipped")}>Shipped</button>
          <button className={filter === "Delivered" ? "active" : ""} onClick={() => setFilter("Delivered")}>Delivered</button>
          <button className={filter === "Cancelled" ? "active" : ""} onClick={() => setFilter("Cancelled")}>Cancelled</button>
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <p className="no-orders">No orders found.</p>
        )}

        {/* ORDERS LIST */}
        {filteredOrders.map((order) => {
          let address = {};
          let items = [];

          try {
            address =
              typeof order.address === "object"
                ? order.address
                : JSON.parse(order.address || "{}");
          } catch {
            address = {};
          }

          try {
            items = Array.isArray(order.items)
              ? order.items
              : JSON.parse(order.items || "[]");
          } catch {
            items = [];
          }

          return (
            <div key={order.id} className="order-card">

              {/* HEADER */}
              <div className="order-header">
                <div className="order-id">Order #{order.id}</div>
                <div className={`order-status ${order.status?.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              {/* CUSTOMER INFO */}
              <div className="order-info">
                <div className="info-group">
                  <span className="info-label">Customer</span>
                  <span className="info-value">{order.user_name}</span>
                </div>

                <div className="info-group">
                  <span className="info-label">Email</span>
                  <span className="info-value">{order.email}</span>
                </div>

                <div className="info-group">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{order.mobile}</span>
                </div>

                <div className="info-group">
                  <span className="info-label">Payment</span>
                  <span className="info-value">{order.payment_method}</span>
                </div>

                <div className="info-group">
                  <span className="info-label">Total</span>
                  <span className="info-value total">₹{order.total}</span>
                </div>

                <div className="info-group">
                  <span className="info-label">Date</span>
                  <span className="info-value">
                    {new Date(order.created_at).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="order-address">
                <span className="info-label">Delivery Address</span>
                <p>
                  {address.address}, {address.city} — {address.pincode}
                </p>
              </div>

              {/* ITEMS */}
              <div className="order-items">
                <span className="info-label">Items</span>

                <div className="items-list">
                  {items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.title} />

                      <div className="item-info">
                        <p className="item-title">{item.title}</p>
                        <p className="item-meta">Size: {item.selectedSize}</p>
                        <p className="item-meta">Qty: {item.quantity || 1}</p>
                        <p className="item-price">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATUS UPDATE */}
              <div className="order-actions">
                <span className="info-label">Update Status</span>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Orders;