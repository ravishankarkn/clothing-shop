import axios from "axios";
import { Navigate } from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import AdminSidebar
    from "../components/AdminSidebar";

import "../styles/admin.css";
import { toast } from "react-toastify";

const AdminProducts = () => {

    const [products, setProducts] =
        useState([]);

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

    const deleteProduct =
        async (id) => {

            try {

                await axios.delete(

                    `https://clothing-shop-server.onrender.com/products/${id}`
                );

                toast.error(
                    "Product Deleted"
                );

                fetchProducts();

            } catch (error) {

                console.log(error);

            }

        };

    useEffect(() => {

        fetchProducts();

    }, []);
    const role =
        localStorage.getItem(
            "role"
        );

    if (role !== "admin") {

        return <Navigate
            to="/login"
        />;

    }

    return (

        <div className="admin-container">

            <AdminSidebar />

            <div className="admin-main">


                <div className="products-header">

                    <h1>
                        Manage Products
                    </h1>

                    <Link
                        to="/add-product"
                        className="add-btn"
                    >

                        Add Product

                    </Link>

                </div>

                <table className="products-table">

  <thead>

    <tr>

      <th>ID</th>

      <th>Image</th>

      <th>Title</th>

      <th>Category</th>

      <th>Price</th>

      <th>Stock</th>

      <th>Sizes</th>

      <th>Actions</th>

    </tr>

  </thead>

  <tbody>

    {
      products.map((product) => (

        <tr key={product.id}>

  <td>{product.id}</td>

  <td>
    <img
      src={product.image}
      alt={product.title}
      className="table-product-image"
    />
  </td>

  <td className="product-title-cell">
    {product.title}
  </td>

  <td>{product.category}</td>

  <td>₹{product.price}</td>

  <td>{product.stock}</td>

  <td>{product.sizes}</td>

  <td>
    <div className="action-buttons">

      <Link
        to={`/edit-product/${product.id}`}
        className="edit-btn"
      >
        Edit
      </Link>

      <button
        className="delete-btn"
        onClick={() =>
          deleteProduct(product.id)
        }
      >
        Delete
      </button>

    </div>
  </td>

</tr>

      ))
    }

  </tbody>

</table>

            </div>

        </div>

    );

};

export default AdminProducts;