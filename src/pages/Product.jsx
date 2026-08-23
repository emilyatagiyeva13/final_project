import { CiBoxList, CiGrid41 } from "react-icons/ci"
import "../assets/scss/Product.scss"
import SingleCard from "../components/SingleCard"

const Product = () => {
  return (
    <>
      <section class="book-header">
        <nav class="breadcrumb d-flex justify-content-center">
          <a href="#">Home</a>
          <span>&gt;</span>
          <span class="current">Shop</span>
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
              <div className="filter-card-title">
                <span>Category</span>
              </div>
              <ul className="list-unstyled">
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Books</span><span className="count">(13)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Fiction</span><span className="count">(11)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Kids Books</span><span className="count">(13)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Non Fiction</span><span className="count">(12)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Uncategorized</span><span className="count">(11)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Young Adult</span><span className="count">(4)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Science Fiction</span><span className="count">(9)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Mystery</span><span className="count">(7)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Biography</span><span className="count">(6)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>History</span><span className="count">(8)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Self Help</span><span className="count">(5)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Classics</span><span className="count">(10)</span></label></li>
              </ul>
            </div>
          </div>

          <div className="authors">
            <div className="filter-card">
              <div className="filter-card-title">
                <span>Authors</span>
              </div>
              <ul className="list-unstyled">
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>George R.R. Martin</span><span className="count">(5)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>J.K. Rowling</span><span className="count">(8)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Leo Tolstoy</span><span className="count">(4)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Emilya Taghiyeva</span><span className="count">(3)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Koshi</span><span className="count">(6)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Mais</span><span className="count">(4)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Jane Austen</span><span className="count">(7)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Charles Dickens</span><span className="count">(6)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Ernest Hemingway</span><span className="count">(5)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Fyodor Dostoevsky</span><span className="count">(4)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Gabriel García Márquez</span><span className="count">(3)</span></label></li>
                <li><label className="custom-checkbox"><input type="checkbox" /><span className="checkmark" /><span>Agatha Christie</span><span className="count">(9)</span></label></li>
              </ul>
            </div>
          </div>

        </div>

        {/* database elave edende duzelt */}

        <div className="main-shop d-flex flex-column">
          <div className="sorting">

            <div className="sort-grid-books">
              <button className="grid-books"><CiGrid41 /></button>
              <button className="list-books"><CiBoxList /></button>
            </div>

            <p>Showing 1-12 of 42 results</p>


            <div class="select">

              <div
                class="selected"
                data-default="All"
                data-one="option-1"
                data-two="option-2"
                data-three="option-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  class="arrow"
                >
                  <path
                    d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  ></path>
                </svg>
              </div>
              <div class="options">
                <div title="all">
                  <input id="all" name="option" type="radio" />
                  <label class="option" for="all" data-txt="All">All</label>
                </div>
                <div title="option-1">
                  <input id="option-1" name="option" type="radio" />
                  <label class="option" for="option-1" data-txt="option-1">Sort by latest</label>
                </div>
                <div title="option-2">
                  <input id="option-2" name="option" type="radio" />
                  <label class="option" for="option-2" data-txt="option-2">Sort by oldest</label>
                </div>
                <div title="option-3">
                  <input id="option-3" name="option" type="radio" />
                  <label class="option" for="option-3" data-txt="option-3">Sort by price: low to high</label>
                </div>
                <div title="option-3">
                  <input id="option-3" name="option" type="radio" />
                  <label class="option" for="option-3" data-txt="option-3">Sort by price: hight to low</label>
                </div>
               
              </div>
            </div>



          </div>




          <div className="product-box row ">
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
            <div className="col-md-4 col-sm-6"><SingleCard /></div>
          </div>
        </div>

      </section>
    </>
  )
}

export default Product