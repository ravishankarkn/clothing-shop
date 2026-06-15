import axios from "axios";
import { Navigate } from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {

    const params =
        useParams();

    const navigate =
        useNavigate();

    const productId =
        params.id;

    const [productData,
        setProductData] =
        useState({

            title: "",

            description: "",

            price: "",

            category: "",

            stock: "",

            sizes: ""

        });

    const handleChange =
        (e) => {

            setProductData({

                ...productData,

                [e.target.name]:
                    e.target.value

            });

        };

    const fetchOneProduct =
        async () => {

            try {

                const response =
                    await axios.get(

                        `http://localhost:5000/products/${productId}`
                    );

                setProductData(
                    response.data[0]
                );

            } catch (error) {

                console.log(error);

            }

        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                await axios.put(

                    `http://localhost:5000/products/${productId}`,

                    productData
                );

                toast.info(
                    "Product Updated"
                );

                navigate(
                    "/admin-products"
                );

            } catch (error) {

                console.log(error);

            }

        };

    useEffect(() => {

        fetchOneProduct();

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

        <div className="add-product-page">

            <form
                onSubmit={handleSubmit}
                className="add-product-form"
            >

                <h1>
                    Edit Product
                </h1>

                <input
                    type="text"
                    name="title"
                    value={productData.title}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="sizes"
                    value={productData.sizes}
                    onChange={handleChange}
                />

                <button>

                    Update Product

                </button>

            </form>

        </div>

    );

};

export default EditProduct;