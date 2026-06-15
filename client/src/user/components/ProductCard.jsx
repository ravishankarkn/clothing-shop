import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {

  return (

    <div className="modern-product-card">

      {/* PRODUCT IMAGE */}

      <Link
        to={`/products/${product.id}`}
      >

        <div className="product-image-box">

          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />

        </div>

      </Link>

      {/* PRODUCT CONTENT */}

      <div className="product-content">

        <h2>
          {product.title}
        </h2>

        <p>
          {product.description}
        </p>

        <h3>
          ₹ {product.price}
        </h3>

        <Link
          to={`/products/${product.id}`}
        >

          <button className="details-btn">

            View Details

          </button>

        </Link>

      </div>

    </div>

  );

};

export default ProductCard;