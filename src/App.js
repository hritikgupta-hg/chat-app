import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./components/chat/Chat";
import { authActions } from "./store/authSlice";
import { dimensionActions } from "./store/dimensionSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home/chat",
    element: <Chat />,
  },
]);

function App() {
  // const navigate = useNavigate();

  const { width } = useSelector((state) => state.dimension);
  const { height } = useSelector((state) => state.dimension);

  function handleResize() {
    dispatch(
      dimensionActions.changeDimention({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      window.addEventListener("resize", handleResize);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [height, width]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(authActions.updateUser(true));
      } else {
        dispatch(authActions.updateUser(false));
      }
    });
  }, [auth, onAuthStateChanged]);

  const { isLoggedIn } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  // console.log(isLoggedIn);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
