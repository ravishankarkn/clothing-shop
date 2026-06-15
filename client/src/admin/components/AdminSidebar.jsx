import {
  Link,
  useNavigate
} from "react-router-dom";

const AdminSidebar = () => {

  const navigate =
    useNavigate();

  const logout = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "role"
  );

  navigate("/");

};

  return (

    <div className="admin-sidebar">

      <h2>
        Clothing Admin
      </h2>

      <Link to="/admin">

        Dashboard

      </Link>

      <Link to="/admin-products">

        Manage Products

      </Link>

      <Link to="/orders">

        Manage Orders

      </Link>

      <Link to="/users">

        Manage Users

      </Link>

      <button
        onClick={logout}
        className="logout-btn"
      >

        Logout

      </button>

    </div>

  );

};

export default AdminSidebar;