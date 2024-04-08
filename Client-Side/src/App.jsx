import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { DNA } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { SelectToken } from "./Redux-Store/TokenSlice";
import { SignIn } from "./Components/SignIn";
import { SignUp } from "./Components/SignUp";
import { Error } from "./Errors/Error";
import { ErrorPage } from "./Errors/ErrorPage";
import { Items } from "./Components/Items";
import { SellItem } from "./Components/SellItems";
import { SpecificItem } from "./Components/SpecificItem";
import { jwtDecode } from 'jwt-decode'
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const token = useSelector(SelectToken);
  console.log("Redux Token :", token);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const storedToken = localStorage.getItem("token");
    console.log("Token from local storage:", storedToken);

  }, []);

  const logBefore = () =>
    toast.warn("Please, Login first", {
      theme: "light",
      autoClose: "2000",
      transition: Zoom,
    });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ErrorBoundary fallback={<Error />}>
          <SignIn />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: (
        <ErrorBoundary fallback={<Error />}>
          <SignUp />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/items",
      loader: async () => {
        try {
          // Include token in request headers
          const storedToken = localStorage.getItem("token");
          // console.log("Token from local storage:", storedToken);
          
          if (storedToken) {
            const jwt_decode = jwtDecode(token || storedToken)
            const currentTime = Date.now() / 1000

            if(jwt_decode.exp < currentTime){
              return redirect("/")
            }
          } else{
            logBefore();
            return redirect("/")
          }

          const headers = {
            "Authorization": `Bearer ${storedToken || token}`,
          }

          const url = "http://localhost:9001/items";
          const getItems = await fetch(url, {
            method: "GET",
            headers: headers,
          });
          const response = await getItems.json();
          
          // response.forEach(ef => {
          //   const cv = ef.image
          //   console.log(cv)
          // })
          
          return response;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
      element: (
        <ErrorBoundary fallback={<Error />}>
          <Items />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/items/sell",
      element: (
        <ErrorBoundary fallback={<Error />}>
          <SellItem />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/items/details/:id",
      loader: async ({params}) => {
        try {
          const storedToken = localStorage.getItem("token")
          const id = params.id

          if (storedToken) {
            const jwt_decode = jwtDecode(token || storedToken)
            const currentTime = Date.now() / 1000

            if(jwt_decode.exp < currentTime){
              return redirect("/")
            }
          } else{
            logBefore();
            return redirect("/")
          }

          const headers = {
            "Authorization": `Bearer ${storedToken || token}`,
          } 
          const url = `http://localhost:9001/items/${id}`;
          const item = await fetch(url, {
            method: "GET",
            headers: headers
          })
          const GetItem = await item.json()
          return GetItem;
        } catch (error) {
          console.log(error)
          return null;
        }
      },
      element: (
        <ErrorBoundary fallback={<Error />}>
          <SpecificItem />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <>
    <ToastContainer position="top-center" />
    
      {isLoading ? ( // Show loader if isLoading is true
        <div className="loading">
          <div className="loader-container">
            <DNA
              visible={true}
              height="100"
              width="100"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
      
    </>
  );
}

export default App;
