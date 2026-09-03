import { CiBoxList, CiGrid41 } from "react-icons/ci"
import "../assets/scss/Product.scss"
import SingleCard from "../components/SingleCard"
import { booksData } from "../data/data"
import { Link } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { useState } from "react"

const Product = () => {

  const authorCounts = booksData.reduce((acs, book) => {
    acs[book.author] = (acs[book.author] || 0) + 1;
    return acs;
  }, {});
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  return (
    <>
      <section class="book-header">
        <nav class="breadcrumb d-flex justify-content-center">
          <Link to={`/`}>Home</Link>
          <span>&gt;</span>
          <span>Shop</span>
        </nav>

        <h1 class="title">All Books</h1>

        <p class="description">
          Discover your favorite book: you will find a wide range of selected books from bestseller
          to newcomer, children’s book to crime novel or thriller to science fiction novel.
        </p>
      </section>


      <section className="d-flex gap-3 p-3">
        <div className="filter-box d-flex flex-column gap-3">

          <div className="category">
            <div className="filter-card">
              <div className="filter-card-title d-flex justify-content-between align-items-center">
                <span>Category</span>
                <button
                  className={` ${isCategoryOpen ? "open" : ""}`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <IoIosArrowDown />
                </button>
              </div>

              <ul className={`list-unstyled filter-list ${isCategoryOpen ? "open" : ""}`}>
                {booksData.map((i) => (
                  <li key={i.category}>
                    <label className="custom-checkbox">
                      <input type="checkbox" />
                      <span className="checkmark" />
                      <span>{i.category}</span>
                      <span className="count">{i.stock}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="authors">
            <div className="filter-card">
              <div className="filter-card-title d-flex justify-content-between align-items-center">
                <span>Authors</span>
                <button
                  className={` ${isAuthorsOpen ? "open" : ""}`}
                  onClick={() => setIsAuthorsOpen(!isAuthorsOpen)}
                >
                  <IoIosArrowDown />
                </button>
              </div>
              <ul className={`list-unstyled filter-list ${isAuthorsOpen ? "open" : ""}`}>

                {Object.entries(authorCounts).map(([author, count]) => (
                  <li key={author}>
                    <label className="custom-checkbox">
                      <input type="checkbox" />
                      <span className="checkmark" />
                      <span>{author}</span>
                      <span className="count">{count}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* database elave edende duzelt */}

        <div className="main-shop d-flex flex-column align-items-center">

          <div className="sorting ">
            <div className="sort-grid-books">
              <button className={`grid-books ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}><CiGrid41 /></button>
              <button className={`list-books ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}><CiBoxList /></button>
            </div>

            <p className="results-count">Showing 1-12 of 42 results</p>

            <div className="dropdown">
              <button className="dropbtn">
                Sort by <IoIosArrowDown className="dropdown-arrow" />
              </button>
              <div className="dropdown-content">
                <div className="dropdown-inner">
                  <ul className="list-unstyled">
                    <li>Popularity</li>
                    <li>Rating</li>
                    <li>Price: low to high</li>
                    <li>Price: high to low</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="product-box row my-3">
            {booksData.map((i) => (
              <div className={viewMode === "grid" ? "col-6 col-md-4 col-lg-4 my-2" : "col-12 my-2"} >
                <SingleCard {...i} key={i.id} viewMode={viewMode} />
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  )
}

export default Product