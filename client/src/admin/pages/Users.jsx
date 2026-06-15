import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/login" />;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://clothing-shop-server.onrender.com/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://clothing-shop-server.onrender.com/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await axios.put(`https://clothing-shop-server.onrender.com/users/${id}/role`, {
        role,
      });
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-main">
        <div className="products-header">
          <h1>Manage Users</h1>
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

        {/* STATS */}
        <div className="users-stats">
          <div className="user-stat-box">
            <span>Total Users</span>
            <h3>{users.length}</h3>
          </div>

          <div className="user-stat-box">
            <span>Verified</span>
            <h3>{users.filter((u) => u.is_verified).length}</h3>
          </div>

          <div className="user-stat-box">
            <span>Admins</span>
            <h3>{users.filter((u) => u.role === "admin").length}</h3>
          </div>
        </div>

        {/* EMPTY */}
        {filteredUsers.length === 0 && (
          <p className="no-orders">No users found.</p>
        )}

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="products-table users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`verified-badge ${
                        user.is_verified ? "yes" : "no"
                      }`}
                    >
                      {user.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>

                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    {user.role !== "admin" ? (
                      <button
                        onClick={() => changeRole(user.id, "admin")}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => changeRole(user.id, "user")}
                      >
                        Remove Admin
                      </button>
                    )}

                    <button
                      style={{ marginLeft: "10px", color: "red" }}
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;