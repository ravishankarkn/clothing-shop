import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
children,
adminOnly=false
})=>{

const token =
localStorage.getItem(
"token"
);

const role =
localStorage.getItem(
"role"
);

if(!token){

localStorage.setItem(
"redirectAfterLogin",
window.location.pathname
);

return <Navigate to="/login" />;

}

if(
adminOnly &&
role!=="admin"
){

return <Navigate to="/" />;

}

return children;

};

export default ProtectedRoute;