import {
  useLocation,
  useNavigate
} from "react-router-dom";

import "../styles/user.css";

const OrderSuccess = () => {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const data =
    location.state;

  return (

    <div className="success-page">

      <div className="success-card">

        <div className="success-icon">

          ✓

        </div>

        <h1>
          Order Placed Successfully
        </h1>

        <p>
          Your order has been confirmed.
        </p>

        {/* DELIVERY DETAILS */}

        <div className="success-details">

          <h2>
            Delivery Details
          </h2>

          <p>

            <strong>Name :</strong>
            {" "}
            {data?.orderDetails?.name}

          </p>

          <p>

            <strong>Phone :</strong>
            {" "}
            {data?.orderDetails?.phone}

          </p>

          <p>

            <strong>City :</strong>
            {" "}
            {data?.orderDetails?.city}

          </p>

          <p>

            <strong>Payment :</strong>
            {" "}
            {data?.orderDetails?.payment}

          </p>

        </div>

        <button

          className="continue-btn"

          onClick={() =>
            navigate("/products")
          }

        >

          Continue Shopping

        </button>

      </div>

    </div>

  );

};

export default OrderSuccess;