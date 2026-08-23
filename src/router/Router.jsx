import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import Home from "../pages/Home"
import Contact from "../pages/Contact"
import About from "../pages/About"
import Product from "../pages/Product"

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




        </Routes>





        <Footer />

      </BrowserRouter>







    </>
  )
}

export default Router