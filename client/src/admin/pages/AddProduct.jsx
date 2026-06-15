import axios from "axios";
import { toast } from "react-toastify";

import {
  useState
} from "react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

const AddProduct = () => {

  const navigate =
    useNavigate();

  const [productData,
    setProductData] =
    useState({

      title: "",

      description: "",

      price: "",

      category: "",

      stock: "",

      sizes: "",

      image: "",

      images: ""

    });

  const handleChange =
    (e) => {

      setProductData({

        ...productData,

        [e.target.name]:
          e.target.value

      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(

          "http://localhost:5000/products/add-product",

          productData
        );

        toast.success(
          "Product Added Successfully"
        );

        navigate(
          "/admin-products"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed To Add Product"
        );

      }

    };

  const role =
    localStorage.getItem(
      "role"
    );

  if (role !== "admin") {

    return (
      <Navigate to="/login" />
    );

  }

  return (

    <div className="add-product-page">

      <form
        onSubmit={handleSubmit}
        className="add-product-form"
      >

        <h1>
          Add Product
        </h1>

        <input
          type="text"
          placeholder="Main Image URL"
          name="image"
          value={productData.image}
          onChange={handleChange}
        />

        <textarea
          placeholder="Additional Image URLs separated by commas"
          name="images"
          value={productData.images}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Title"
          name="title"
          value={productData.title}
          onChange={handleChange}
        />

        <textarea
          placeholder="Description"
          name="description"
          value={productData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Price"
          name="price"
          value={productData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Category"
          name="category"
          value={productData.category}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Stock"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Sizes (S,M,L,XL)"
          name="sizes"
          value={productData.sizes}
          onChange={handleChange}
        />

        <button type="submit">

          Add Product

        </button>

      </form>

    </div>

  );

};

export default AddProduct;