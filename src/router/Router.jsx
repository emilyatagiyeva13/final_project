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

const Router = () => {
  return (
    <>

      <BrowserRouter>

        <Header />

        <Routes>

          <Route path="/" element={<Home />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/aboutus" element={<About />}></Route>
          <Route path="/shop" element={<Product />}></Route>
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="/basket" element={<Basket />}></Route>
          <Route path="/faqs" element={<FAQ />}></Route>
          <Route path="/blog" element={<Blog />}></Route>




        </Routes>





        <Footer />

      </BrowserRouter>







    </>
  )
}

export default Router