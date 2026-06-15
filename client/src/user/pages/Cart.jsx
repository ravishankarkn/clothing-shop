import { useNavigate } from "react-router-dom";

import {
  useContext,
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  CartContext
} from "../../context/CartContext";
import { toast } from "react-toastify";


const Cart = () => {

  const navigate =
    useNavigate();

  const {

    increaseQuantity,

    decreaseQuantity,

    removeItem,

    toggleBuyLater

  } = useContext(
    CartContext
  );

  const [cart, setCart] =
    useState([]);


  // BUY ITEMS

  const buyItems =
    cart.filter(
      (item) =>
        !item.buyLater
    );

  // BUY LATER ITEMS

  const laterItems =
    cart.filter(
      (item) =>
        item.buyLater
    );

  // TOTAL PRICE ONLY BUY ITEMS

  const totalPrice =
    buyItems.reduce(

      (total, item) =>

        total +
        item.price *
        item.quantity,

      0

    );

  // ORDER FUNCTION

  const handleOrder = () => {

    const token =
      localStorage.getItem(
        "token"
      );

    // EMPTY CHECK

    if (buyItems.length === 0) {

      toast.warn(
        "No Products Selected For Buying"
      );

      return;

    }

    // LOGIN CHECK

    if (!token) {

      navigate("/login", {

        state: {
          fromOrder: true
        }

      });

      return;

    }

    // ORDER PAGE

    navigate("/order", {

      state: {
        cart: buyItems
      }

    });

  };

  // SAVE BUY LATER STATE TO LOCALSTORAGE
  const saveBuyLaterState = (updatedCart) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const buyLaterKey = `buyLater_${user.id}`;
    const buyLaterIds = updatedCart
      .filter((item) => item.buyLater)
      .map((item) => item.id);
    localStorage.setItem(buyLaterKey, JSON.stringify(buyLaterIds));
  };

  // GET BUY LATER IDS FROM LOCALSTORAGE
  const getBuyLaterIds = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return [];
    const buyLaterKey = `buyLater_${user.id}`;
    return JSON.parse(localStorage.getItem(buyLaterKey)) || [];
  };

  useEffect(() => {

  const fetchCart =
    async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        if (!user) return;

        const res =
          await axios.get(

            `https://clothing-shop-server.onrender.com/api/cart/${user.id}`

          );

        // APPLY SAVED BUY LATER STATE
        const buyLaterIds = getBuyLaterIds();
        const cartWithBuyLater = res.data.map((item) => ({
          ...item,
          buyLater: buyLaterIds.includes(item.id),
        }));

        setCart(
          cartWithBuyLater
        );

      }

      catch (error) {

        console.log(
          error
        );

      }

    };

  fetchCart();

  window.addEventListener(
    "cartUpdated",
    fetchCart
  );

  return () =>
    window.removeEventListener(
      "cartUpdated",
      fetchCart
    );

}, []);

useEffect(() => {
  const loadCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const cartKey = `cart_${user.id}`;
    const data = JSON.parse(localStorage.getItem(cartKey)) || [];

    // APPLY SAVED BUY LATER STATE
    const buyLaterIds = getBuyLaterIds();
    const cartWithBuyLater = data.map((item) => ({
      ...item,
      buyLater: buyLaterIds.includes(item.id),
    }));

    setCart(cartWithBuyLater);
  };

  loadCart();

  window.addEventListener("cartUpdated", loadCart);
  window.addEventListener("storage", loadCart);

  return () => {
    window.removeEventListener("cartUpdated", loadCart);
    window.removeEventListener("storage", loadCart);
  };
}, []);
  return (

    <div className="modern-cart-page">

      <h1 className="cart-heading">

        Shopping Cart

      </h1>

      <div className="cart-container">

        {/* LEFT SIDE */}

        <div className="cart-items-section">

          {

            buyItems.length === 0 &&

              laterItems.length === 0 ? (

              <div className="empty-cart">

                <h2>
                  Your Cart is Empty
                </h2>

              </div>

            ) : (

              <>

                {/* BUY ITEMS */}

                {

                  buyItems.map((item, index) => (

                    <div
                      key={index}
                      className="modern-cart-item"
                    >

                      {/* IMAGE */}

                      <div className="cart-image-box">

                        <img
                          src={item.image}
                          alt=""
                        />

                      </div>

                      {/* CONTENT */}

                      <div className="cart-content">

                        <h2>
                          {item.title}
                        </h2>

                        <p>
                          Premium Fashion Collection
                        </p>

                        <h3>
                          ₹ {item.price}
                        </h3>

                        <h4>

                          Size :
                          {" "}
                          {item.selected_size}

                        </h4>

                        {/* QUANTITY */}

                        <div className="qty-box">

                          <button
                            onClick={() => {

                              const updatedCart = cart

                                  .map(

                                    (product) =>

                                      product.id === item.id

                                        ? {

                                          ...product,

                                          quantity:

                                            product.quantity - 1

                                        }

                                        : product

                                  )

                                  .filter(

                                    (product) =>

                                      product.quantity > 0

                                  );

                              setCart(updatedCart);

                            }}
                          >

                            -

                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => {

                              const updatedCart = cart.map(

                                  (product) =>

                                    product.id === item.id

                                      ? {

                                        ...product,

                                        quantity:

                                          product.quantity + 1

                                      }

                                      : product

                                );

                              setCart(updatedCart);

                            }}
                          >

                            +

                          </button>

                        </div>

                        {/* REMOVE */}

                        <button

                          className="remove-btn"

                          onClick={async () => {

                            try {

                              await axios.delete(

                                `https://clothing-shop-server.onrender.com/api/cart/${item.id}`

                              );

                              const updatedCart = cart.filter(

                                  (c) =>

                                    c.id !== item.id

                                );

                              setCart(updatedCart);
                              saveBuyLaterState(updatedCart);

                            }

                            catch (error) {

                              console.log(error);

                            }

                          }}

                        >

                          Remove

                        </button>

                        {/* BUY LATER */}

                        <button

                          className="later-btn"

                          onClick={() => {

                            const updatedCart = cart.map(

                                (product) =>

                                  product.id === item.id

                                    ? {

                                      ...product,

                                      buyLater:

                                        !product.buyLater

                                    }

                                    : product

                              );

                            setCart(updatedCart);
                            saveBuyLaterState(updatedCart);

                          }}

                        >

                          Buy Later

                        </button>
                      </div>

                    </div>

                  ))

                }

                {/* BUY LATER SECTION */}

                {

                  laterItems.length > 0 && (

                    <div className="buy-later-section">

                      <h2>
                        Buy Later
                      </h2>

                      {

                        laterItems.map((item, index) => (

                          <div
                            key={index}
                            className="modern-cart-item"
                          >

                            <div className="cart-image-box">

                              <img
                                src={item.image}
                                alt=""
                              />

                            </div>

                            <div className="cart-content">

                              <h2>
                                {item.title}
                              </h2>

                              <h3>
                                ₹ {item.price}
                              </h3>

                              <button

                                className="later-btn"

                                onClick={() => {

                                  const updatedCart = cart.map(

                                      (product) =>

                                        product.id === item.id

                                          ? {

                                            ...product,

                                            buyLater:

                                              !product.buyLater

                                          }

                                          : product

                                    );

                                  setCart(updatedCart);
                                  saveBuyLaterState(updatedCart);

                                }}
                              >

                                Move To Buy

                              </button>

                            </div>

                          </div>

                        ))

                      }

                    </div>

                  )

                }

              </>

            )

          }

        </div>

        {/* RIGHT SIDE */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Total Items
            </span>

            <span>
              {buyItems.length}
            </span>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              Free
            </span>

          </div>

          <div className="summary-row total-row">

            <span>
              Total Price
            </span>

            <span>
              ₹ {totalPrice}
            </span>

          </div>

          <button

            className="checkout-btn"

            onClick={handleOrder}

          >

            Order Now

          </button>

        </div>

      </div>

    </div>

  );

};

export default Cart;