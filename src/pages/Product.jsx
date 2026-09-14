import { CiBoxList, CiGrid41 } from "react-icons/ci"
import "../assets/scss/Product.scss"
import SingleCard from "../components/SingleCard"
import { supabase } from "../supabaseClient.js"
import { Link } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { useState, useEffect } from "react"
import Loader from "../components/Loader"
// import { Pagination } from "react-bootstrap"
// import usePagination from "../components/hooks/usePagination"

const Product = () => {
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  // const { currentPage, totalPages, booksData, goToPage } = usePagination(booksData, 10)

  useEffect(() => {
    const fetchProducts = async () => {
      
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          slug,
          title_az,
          description_az,
          price,
          stock,
          image_url,
          rating,
          categories ( name_az ),
          authors ( name )
        `)
        .eq("is_active", true);
        

      if (error) {
        console.error("Products fetch error:", error);
        
      } else {
        // author/category-ni flat sahə kimi çıxarırıq ki, aşağıdakı filterlər işləsin
        const formatted = data.map((book) => ({
          ...book,
          category: book.categories?.name_az,
          author: book.authors?.name,
        }));
        console.log("Product IDs:", formatted.map(b => b.id));
        setBooksData(formatted);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const authorCounts = booksData.reduce((acs, book) => {
    acs[book.author] = (acs[book.author] || 0) + 1;
    return acs;
  }, {});

  const categoryCounts = booksData.reduce((acs, book) => {
    acs[book.category] = (acs[book.category] || 0) + 1;
    return acs;
  }, {});

  if (loading) {
    return <Loader/>;
  }

  return (
    <>
      <section className="book-header">
        <nav className="breadcrumb d-flex justify-content-center">
          <Link to={`/`}>Home</Link>
          <span>&gt;</span>
          <span>Shop</span>
        </nav>

        <h1 className="title">All Books</h1>

        <p className="description">
          Discover your favorite book: you will find a wide range of selected books from bestseller
          to newcomer, children's book to crime novel or thriller to science fiction novel.
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
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <li key={category}>
                    <label className="custom-checkbox">
                      <input type="checkbox" />
                      <span className="checkmark" />
                      <span>{category}</span>
                      <span className="count">{count}</span>
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

        <div className="main-shop d-flex flex-column align-items-center">

          <div className="sorting ">
            <div className="sort-grid-books">
              <button className={`grid-books ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}><CiGrid41 /></button>
              <button className={`list-books ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}><CiBoxList /></button>
            </div>

            <p className="results-count">Showing 1-{booksData.length} of {booksData.length} results</p>

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
              <div
                key={i.id}
                className={viewMode === "grid" ? "col-6 col-md-4 col-lg-4 my-2" : "col-12 my-2"}
              >
                <SingleCard {...i} viewMode={viewMode} />
              </div>
            ))}
          </div>
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage} /> */}
            
        </div>

      </section>
      
    </>
  )
}


export default Product