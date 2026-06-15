import "../styles/user.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  const images = [

    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",

    "https://images.unsplash.com/photo-1483985988355-763728e1935b",

    "https://images.unsplash.com/photo-1496747611176-843222e1e57c",

    "https://images.unsplash.com/photo-1441986300917-64674bd600d8"

  ];

  const [currentImage, setCurrentImage] =
    useState(0);

  useEffect(() => {

    const slider =
      setInterval(() => {

        setCurrentImage((prev) =>

          prev === images.length - 1
            ? 0
            : prev + 1

        );

      }, 3000);

    return () => clearInterval(slider);

  }, []);

  const handleTrending = () => {

    navigate("/products?sort=new");

  };


  return (

    <div className="home-page">

      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-tag">
            New Fashion Collection
          </p>

          <h1>
            STYLE THAT
            <br />
            SPEAKS FOR YOU
          </h1>

          <p className="hero-desc">

            Discover premium fashion collections
            for Men & Women with trending styles,
            modern designs and premium quality.

          </p>

          <div className="hero-buttons">

            <button
              className="shop-btn"
              onClick={() =>
                navigate("/products")
              }
            >

              Shop Now

            </button>

            <button
              className="explore-btn"
              onClick={() =>
                navigate("/products")
              }
            >

              Explore

            </button>

          </div>

        </div>

        <div className="hero-image">

<div
className="slider-wrapper"
>

{

images.map(

(img,index)=>(

<img

key={index}

src={img}

alt=""

className={

index===currentImage

?

"slider-image active"

:

"slider-image"

}

/>

)

)

}

</div>

</div>

      </section>

      {/* CATEGORY SECTION */}

      <section className="categories-section">

        {/* MEN */}

        <div className="category-card men">

          <h2>
            Men Fashion
          </h2>

          <button
            onClick={() =>
              navigate("/products?category=Men")
            }
          >

            View More

          </button>

        </div>

        {/* WOMEN */}

        <div className="category-card women">

          <h2>
            Women Fashion
          </h2>

          <button
            onClick={() =>
              navigate("/products?category=Women")
            }
          >

            View More

          </button>

        </div>

        {/* TRENDING */}

        <div className="category-card trending">

          <h2>
            Trending Style
          </h2>

          <button
            onClick={handleTrending}
          >

            View More

          </button>

        </div>

      </section>
      {/* FEATURES */}

      <section className="features-section">

        <div className="feature-box">

          <h2>100%</h2>

          <p>Original Products</p>

        </div>

        <div className="feature-box">

          <h2>24/7</h2>

          <p>Customer Support</p>

        </div>

        <div className="feature-box">

          <h2>Fast</h2>

          <p>Delivery Service</p>

        </div>

      </section>

    </div>

  );

};

export default Home;