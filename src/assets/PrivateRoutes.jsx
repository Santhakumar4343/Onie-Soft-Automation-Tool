// Components/PrivateRoute.js

import {  Navigate } from 'react-router-dom';
import { isAuthenticated } from "../utils/Auth";



const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export default PrivateRoute;

