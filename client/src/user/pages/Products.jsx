import axios from "axios";

import {
  useEffect,
  useState
} from "react";

import {
  useLocation
} from "react-router-dom";

import ProductCard from "../components/ProductCard";

const Products = () => {

  const [products, setProducts] =
    useState([]);

  const location =
    useLocation();

  const query =
    new URLSearchParams(
      location.search
    );

  const category =
    query.get("category");

  const sort =
    query.get("sort");

  const search =
    query.get("search") || "";

  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(
            "https://clothing-shop-server.onrender.com/products"
          );

        setProducts(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchProducts();

  }, []);

  // FILTER PRODUCTS

  let filteredProducts =
    [...products];

  // CATEGORY FILTER

  if(category){

    filteredProducts =
      filteredProducts.filter(
        (product) =>

          product.category
            .toLowerCase()
            ===
          category.toLowerCase()

      );

  }

  // SEARCH FILTER

  if(search){

    filteredProducts =
      filteredProducts.filter(
        (product) =>

          product.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );

  }

  // TRENDING / NEW PRODUCTS

  if(sort === "new"){

    filteredProducts =
      filteredProducts.reverse();

  }

  return (

    <div className="products">

      <h1>
        Products
      </h1>

      <div className="products-container">

        {

          filteredProducts.map(
            (product) => (

              <ProductCard

                key={product.id}

                product={product}

              />

            )
          )

        }

      </div>

    </div>

  );

};

export default Products;