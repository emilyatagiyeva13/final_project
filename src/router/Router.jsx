import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import Home from "../pages/Home"
import Contact from "../pages/Contact"
import About from "../pages/About"
import Product from "../pages/Product"
import Wishlist from "../pages/Wishlist"
import Basket from "../pages/Basket"
import FAQ from "../pages/FAQ"
import Blog from "../pages/Blog"
import Login from "../pages/auth/Login"
import SignUp from "../pages/auth/SignUp"
import { useAuthStore } from "../store/authStore"
import { useEffect } from "react"
import ProtectedRoute from "../components/ProtectedRoute"
import Dashboard from "../pages/admin/dashboard"
import ProductsPage from "../components/dashboard/ProductsPage"
import ScrollToTop from "../components/ScrollToTop"
import ProductDetails from "../components/ProductDetails"
import BlogDetails from "../components/BlogDetails"
import { ToastContainer } from "react-toastify"
import Checkout from "../pages/Checkout"
import NotFound from "../components/NotFound"
import Success from "../components/Success"
// import AdminLayout from "../pages/admin/AdminLayout"
// import ProductsPage from "../pages/admin/ProductsPage"
// import CategoriesPage from "../pages/admin/CategoriesPage"
// import AuthorsPage from "../pages/admin/AuthorsPage"




const Router = () => {

  useEffect(() => {
    useAuthStore.getState().init();
  }, []);
  return (
    <>

      <BrowserRouter>
        <ScrollToTop />

        <Header />

        <Routes>

          <Route path="/" element={<Home />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/aboutus" element={<About />}></Route>
          <Route path="/shop" element={<Product />}></Route>
          <Route path="/shop/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="/basket" element={<Basket />}></Route>
          <Route path="/faqs" element={<FAQ />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/success" element={<Success />}></Route>
          <Route path="*" element={<NotFound />}></Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="products" element={<ProductsPage />} />

          </Route>




        </Routes>





        <Footer />

      </BrowserRouter>
      <ToastContainer />







    </>
  )
}

export default Router