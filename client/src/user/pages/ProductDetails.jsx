import axios from "axios";

import {
  useEffect,
  useState,
  useContext
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  CartContext
} from "../../context/CartContext";
import { toast } from "react-toastify";

const ProductDetails = () => {

  const navigate = useNavigate();

  const [product, setProduct] =
    useState({});

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState("");

  const params = useParams();
  const productId = params.id;

  // ✅ Destructure addToCart from context
  const { addToCart } =
    useContext(CartContext);

  const fetchOneProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products/${productId}`
      );
      setProduct(response.data[0]);
      setSelectedImage(response.data[0].image);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOneProduct();
  }, []);

  const allImages = [
    product.image,
    ...(product.images
      ? product.images
        .split(",")
        .map((img) => img.trim())
      : [])
  ].filter(Boolean);

  const handlePrev = () => {
    const currentIndex =
      allImages.indexOf(selectedImage);
    const prevIndex =
      currentIndex <= 0
        ? allImages.length - 1
        : currentIndex - 1;
    setSelectedImage(allImages[prevIndex]);
  };

  const handleNext = () => {
    const currentIndex =
      allImages.indexOf(selectedImage);
    const nextIndex =
      currentIndex >= allImages.length - 1
        ? 0
        : currentIndex + 1;
    setSelectedImage(allImages[nextIndex]);
  };

  const handleCart = async () => {
    try {

      if (!selectedSize) {
        toast.warn("Select Size");
        return;
      }

      // ✅ Check token first (same as Buy Now)
      const token =
        localStorage.getItem("token");

      if (!token) {

        navigate("/login");

        return;

      }

      // ✅ Get user for backend call
      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (!user?.id) {
        navigate("/login");
        return;
      }

      // ✅ Save to backend (per-user in DB)
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          selected_size: selectedSize
        }
      );

      // ✅ Update CartContext (per-user in localStorage)
      addToCart(product, selectedSize);

      toast.success("Product Added To Cart");

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="modern-details-page">

      <h1 className="product-title">
        {product.title}
      </h1>

      {/* TOP MENU */}
      <div className="details-tabs">
        <button className="active-tab">
          General Info
        </button>
        {/* <button>Product Details</button>
        <button>Reviews</button> */}
      </div>

      <div className="modern-details-container">

        {/* LEFT SECTION */}
        <div className="left-section">

          {/* MAIN IMAGE */}
          <div className="main-image-box">

            <button
              className="slider-btn left"
              onClick={handlePrev}
            >
              ❮
            </button>

            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="main-product-image"
            />

            <button
              className="slider-btn right"
              onClick={handleNext}
            >
              ❯
            </button>

          </div>

          {/* THUMBNAILS */}
          <div className="thumbnail-images">
            {allImages &&
              allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`product-${index}`}
                  className={
                    selectedImage === img
                      ? "thumb active-thumb"
                      : "thumb"
                  }
                  onClick={() =>
                    setSelectedImage(img)
                  }
                />
              ))}
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">

          <div className="price-section">
            <h2>₹ {product.price}</h2>
            <span className="old-price">
              ₹ 3999
            </span>
            <span className="offer-tag">
              -50%
            </span>
          </div>

          {/* SIZE */}
          <div className="size-section">
            <h3>Select Size</h3>
            <div className="size-buttons">
              {product.sizes &&
                product.sizes
                  .split(",")
                  .map((size, index) => (
                    <button
                      key={index}
                      className={
                        selectedSize === size
                          ? "active-size"
                          : ""
                      }
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >
                      {size}
                    </button>
                  ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="action-buttons">

            <button
              className="cart-button"
              onClick={handleCart}
            >
              Add To Cart
            </button>

            <button
              className="buy-button"
              onClick={() => {

                if (!selectedSize) {
                  toast.warn("Please Select Size");
                  return;
                }

                const token =
                  localStorage.getItem("token");

                if (!token) {
                  navigate("/login", {
                    state: { fromOrder: true }
                  });
                  return;
                }

                navigate("/order", {
                  state: {
                    ...product,
                    selectedSize
                  }
                });

              }}
            >
              Buy Now
            </button>

          </div>

          {/* DELIVERY */}
          <div className="delivery-box">
            <h3>Delivery</h3>
            <p>
              Free shipping on all orders
              above ₹999.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Days</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard</td>
                  <td>3-5 Days</td>
                  <td>₹50</td>
                </tr>
                <tr>
                  <td>Express</td>
                  <td>1 Day</td>
                  <td>₹150</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RETURN */}
          <div className="return-box">
            <h3>Return Policy</h3>
            <p>
              Easy 7 days return &
              exchange available.
            </p>
          </div>

        </div>

      </div>

    </div>

  );

};

export default ProductDetails;