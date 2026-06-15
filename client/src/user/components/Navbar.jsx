import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/user.css";

const Navbar = () => {
  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const products = [

    "Hoodie",
    "Oversized Hoodie",
    "T Shirt",
    "Jeans",
    "Women Fashion",
    "Black Hoodie",
    "Premium Shirt"

  ];

  const handleSearchChange = (e) => {

    const value = e.target.value;

    setSearch(value);

    if (value.length >= 1) {

      const filtered =
        products.filter((item) =>

          item
            .toLowerCase()
            .includes(
              value.toLowerCase()
            )

        );

      setSuggestions(filtered);

    } else {

      setSuggestions([]);

    }

  };

  const handleSuggestionClick = (item) => {

    setSearch(item);

    setSuggestions([]);

    navigate(
      `/products?search=${item}`
    );

  };

  const handleSearch = () => {

    navigate(
      `/products?search=${search}`
    );

    setSuggestions([]);

  };

  let [menu, setMenu] =
    useState(false);

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "token"
    );

  const userName =
    localStorage.getItem(
      "name"
    );

  // CLOSE MENU

  let closeMenu = () => {

    setMenu(false);

  };

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "name"
    );

    navigate("/");

    closeMenu();

  };

  return (

    <nav className="modern-navbar">

      {/* LOGO */}

      <div className="nav-logo">

        <h1>
          Lebrel
        </h1>

      </div>

      {/* MOBILE LOGIN / USER */}

      <div className="mobile-login">

        {

          token ? (

            <div className="mobile-user-section">

              <span>
                Hi, {userName}
              </span>

              <button
                className="mobile-logout-btn"
                onClick={handleLogout}
              >

                Logout

              </button>

            </div>

          ) : (

            <Link
              to="/login"
              onClick={closeMenu}
            >

              Login

            </Link>

          )

        }

      </div>

      {/* MENU ICON */}

      <div
        className="menu-icon"
        onClick={() =>
          setMenu(!menu)
        }
      >

        {menu ? "✕" : "☰"}

      </div>

      {/* SIDEBAR */}

      <div
        className={
          menu
            ? "modern-nav-links active"
            : "modern-nav-links"
        }
      >
        <div className="search-container">

          <div className="search-box">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />

            <button onClick={handleSearch}>
              🔍
            </button>

          </div>

          {

            suggestions.length > 0 && (

              <div className="search-suggestions">

                {

                  suggestions.map((item, index) => (

                    <p

                      key={index}

                      onClick={() =>
                        handleSuggestionClick(item)
                      }

                    >

                      {item}

                    </p>

                  ))

                }

              </div>

            )

          }

        </div>

        <Link
          to="/"
          onClick={closeMenu}
        >

          Home

        </Link>

        <Link
          to="/products"
          onClick={closeMenu}
        >

          Products

        </Link>

        <Link
          to="/cart"
          onClick={closeMenu}
        >

          Cart

        </Link>

        <Link to="/my-orders" onClick={closeMenu}>
          My Orders
        </Link>



      </div>

      {/* DESKTOP RIGHT SECTION */}

      <div className="nav-right-section">


        {

          token ? (

            <div className="desktop-user-section">

              <span className="desktop-user-name">

                Hi, {userName}

              </span>

              <button
                className="nav-shop-btn"
                onClick={handleLogout}
              >

                Logout

              </button>

            </div>

          ) : (

            <Link to="/login">

              <button className="nav-shop-btn">

                Login

              </button>

            </Link>

          )

        }

      </div>

    </nav>

  );

};

export default Navbar;