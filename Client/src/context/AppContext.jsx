import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

   const navigate = useNavigate();
   const currency = import.meta.env.VITE_CURRENCY;

   //Global States
   const [token, setToken] = useState(null);
   const [user, setUser] = useState(null);

   const [isOwner, setIsOwner] = useState(false);
   const [showLogin, setShowLogin] = useState(false);

   const [pickupDate, setPickupDate] = useState("");
   const [returnDate, setReturnDate] = useState("");

   const [cars, setCars] = useState([]);


   const fetchUser = async () => {
      try {
         const { data } = await axios.get("/api/user/data");

         if (data.success) {
            setUser(data.user);
            setIsOwner(data.user.role === "owner");
         } else {
            navigate("/");
         }

      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      }
   };

   const fetchedCars = async () => {
      try {
         const { data } = await axios.get("/api/user/cars");
         data.success ? setCars(data.cars) : toast.error(data.message);
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      }
   };


   const logout = () => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsOwner(false);

      delete axios.defaults.headers.common["Authorization"];

      toast.success("You have been logged out");
      navigate("/");
   };

   useEffect(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);
      
   }, []);

   useEffect(() => {
      if (token) {
         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
         fetchUser();
         fetchedCars();
      }
   }, [token]);

   const value = {
      navigate,
      currency,
      axios,

      user,
      setUser,

      token,
      setToken,

      isOwner,
      setIsOwner,

      showLogin,
      setShowLogin,

      pickupDate,
      setPickupDate,
      returnDate,
      setReturnDate,

      cars,
      setCars,

      fetchUser,
      fetchedCars,
      logout
   };

   return (
      <AppContext.Provider value={value}>
         {children}
      </AppContext.Provider>
   );
};

export const useAppContext = () => useContext(AppContext);
