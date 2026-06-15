import {
BrowserRouter,
Routes,
Route,
useLocation
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./user/components/Navbar";

import Home from "./user/pages/Home";

import Products from "./user/pages/Products";

import ProductDetails from "./user/pages/ProductDetails";

import Cart from "./user/pages/Cart";

import Login from "./user/pages/Login";

import OrderPage from "./user/pages/OrderPage";

import OrderSuccess from "./user/pages/OrderSuccess";

import Admin from "./admin/pages/Admin";

import AddProduct from "./admin/pages/AddProduct";

import AdminProducts from "./admin/pages/AdminProducts";

import EditProduct from "./admin/pages/EditProduct";

import Orders from "./admin/pages/Orders";

import Users from "./admin/pages/Users";
import MyOrders from "./user/pages/MyOrders";
import { ToastContainer } from "react-toastify";


const AppContent = () => {

const location =
useLocation();

const isAdminPage =

location.pathname.startsWith(
"/admin"
)

||

location.pathname ===
"/add-product"

||

location.pathname ===
"/admin-products"

||

location.pathname.startsWith(
"/edit-product"
)

||

location.pathname ===
"/orders"

||

location.pathname ===
"/users";

return(

<>

{

!isAdminPage &&

<Navbar/>

}

<Routes>

<Route
path="/"
element={<Home/>}
/>

<Route
path="/products"
element={<Products/>}
/>

<Route path="/my-orders" element={<MyOrders />} />

<Route
path="/products/:id"
element={<ProductDetails/>}
/>

<Route
path="/login"
element={<Login/>}
/>

{/* USER */}

<Route
path="/cart"
element={

<ProtectedRoute>

<Cart/>

</ProtectedRoute>

}
/>

<Route
path="/order"
element={

<ProtectedRoute>

<OrderPage/>

</ProtectedRoute>

}
/>

<Route
path="/order-success"
element={

<ProtectedRoute>

<OrderSuccess/>

</ProtectedRoute>

}
/>

{/* ADMIN */}

<Route
path="/admin"
element={

<ProtectedRoute
adminOnly={true}
>

<Admin/>

</ProtectedRoute>

}
/>

<Route
path="/add-product"
element={

<ProtectedRoute
adminOnly={true}
>

<AddProduct/>

</ProtectedRoute>

}
/>

<Route
path="/admin-products"
element={

<ProtectedRoute
adminOnly={true}
>

<AdminProducts/>

</ProtectedRoute>

}
/>

<Route
path="/edit-product/:id"
element={

<ProtectedRoute
adminOnly={true}
>

<EditProduct/>

</ProtectedRoute>

}
/>

<Route
path="/orders"
element={

<ProtectedRoute
adminOnly={true}
>

<Orders/>

</ProtectedRoute>

}
/>

<Route
path="/users"
element={

<ProtectedRoute
adminOnly={true}
>

<Users/>

</ProtectedRoute>

}
/>

</Routes>

<ToastContainer
  position="top-right"
  autoClose={1000} 
  closeOnClick
  pauseOnHover={false}
  draggable={false}
  theme="dark"
/>

</>



);

};

const App = () => {

return(

<BrowserRouter>

<AppContent/>

</BrowserRouter>

);

};

export default App;