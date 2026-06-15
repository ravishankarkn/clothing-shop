import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import AdminSidebar from "../components/AdminSidebar";
import DashboardCard from "../components/DashboardCard";

import "../styles/admin.css";

const Admin = () => {
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });

  if (role !== "admin") {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/products"),
        axios.get("http://localhost:5000/orders"),
        axios.get("http://localhost:5000/users"),
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data || [];

      const revenue = orders
        .filter((order) => order.status === "Delivered")
        .reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        );

      const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
      ).length;

      const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
      ).length;

      const cancelledOrders = orders.filter(
        (order) => order.status === "Cancelled"
      ).length;

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue,
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-main">
        <h1
          style={{
            marginBottom: "30px",
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          Admin Dashboard
        </h1>

        <div className="dashboard-cards">
          <DashboardCard
            title="Products"
            value={stats.products}
          />

          <DashboardCard
            title="Total Orders"
            value={stats.orders}
          />

          <DashboardCard
            title="Users"
            value={stats.users}
          />

          <DashboardCard
            title="Revenue"
            value={`₹${stats.revenue}`}
          />

          <DashboardCard
            title="Delivered Orders"
            value={stats.deliveredOrders}
          />

          <DashboardCard
            title="Pending Orders"
            value={stats.pendingOrders}
          />

          <DashboardCard
            title="Cancelled Orders"
            value={stats.cancelledOrders}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;