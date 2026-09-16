import { CiBoxList, CiGrid41 } from "react-icons/ci"
import "../assets/scss/Product.scss"
import SingleCard from "../components/SingleCard"
import { supabase } from "../supabaseClient.js"
import { Link, useSearchParams } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { useState, useEffect } from "react"
import Loader from "../components/Loader"
// import { Pagination } from "react-bootstrap"
// import usePagination from "../components/hooks/usePagination"

const Product = () => {
  const [booksData, setBooksData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? categoryParam.split(",") : []
  );

  const authorParam = searchParams.get("author");
  const [selectedAuthors, setSelectedAuthors] = useState(
    authorParam ? authorParam.split(",") : []
  );
  // const { currentPage, totalPages, booksData, goToPage } = usePagination(booksData, 10)

  useEffect(() => {
    const fetchProducts = async () => {

      const [
        { data, error },
        { data: categoriesData, error: categoriesError },
        { data: authorsData, error: authorsError },
      ] = await Promise.all([
        supabase
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
            categories ( slug, name_az,name_en ),
            authors ( name, slug )
          `)
          .eq("is_active", true),
        supabase
          .from("categories")
          .select("slug, name_az, name_en")
          .order("name_az"),
        supabase
          .from("authors")
          .select("slug, name")
          .order("name"),
      ]);

      if (error) {
        console.error("Products fetch error:", error);
      } else {
        const formatted = data.map((book) => ({
          ...book,
          category: book.categories?.name_az,
          categorySlug: book.categories?.slug,
          author: book.authors?.name,
          authorSlug: book.authors?.slug,
        }));
        setBooksData(formatted);
      }

      if (categoriesError) {
        console.error("Categories fetch error:", categoriesError);
      } else {
        setAllCategories(categoriesData);
      }

      if (authorsError) {
        console.error("Authors fetch error:", authorsError);
      } else {
        setAllAuthors(authorsData);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // URL-dəki category dəyişərsə (məs. carousel-dən yenidən klik) filtri sinxronlaşdır
  useEffect(() => {
    setSelectedCategories(categoryParam ? categoryParam.split(",") : []);
  }, [categoryParam]);

  // URL-dəki author dəyişərsə (məs. AuthorsCarousel-dən klik) filtri sinxronlaşdır
  useEffect(() => {
    setSelectedAuthors(authorParam ? authorParam.split(",") : []);
  }, [authorParam]);

  const toggleCategory = (slug) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];

      if (next.length === 0) {
        searchParams.delete("category");
      } else {
        searchParams.set("category", next.join(","));
      }
      setSearchParams(searchParams);

      return next;
    });
  };

  const toggleAuthor = (authorSlug) => {
    setSelectedAuthors((prev) => {
      const next = prev.includes(authorSlug)
        ? prev.filter((a) => a !== authorSlug)
        : [...prev, authorSlug];

      if (next.length === 0) {
        searchParams.delete("author");
      } else {
        searchParams.set("author", next.join(","));
      }
      setSearchParams(searchParams);

      return next;
    });
  };

  // authors cədvəlindən qururuq ki, məhsulu olmayanlar da (0 ilə) görünsün
  const authorList = allAuthors.map((author) => ({
    slug: author.slug,
    name: author.name,
    count: booksData.filter((b) => b.authorSlug === author.slug).length,
  }));

  // categories cədvəlindən qururuq ki, məhsulu olmayanlar da (0 ilə) görünsün
  const categoryList = allCategories.map((cat) => ({
    slug: cat.slug,
    name: cat.name_en,
    count: booksData.filter((b) => b.categorySlug === cat.slug).length,
  }));

  const filteredBooks = booksData.filter((book) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(book.categorySlug);
    const matchesAuthor =
      selectedAuthors.length === 0 || selectedAuthors.includes(book.authorSlug);
    return matchesCategory && matchesAuthor;
  });

  if (loading) {
    return <Loader />;
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
                {categoryList.map(({ slug, name, count }) => (
                  <li key={slug}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(slug)}
                        onChange={() => toggleCategory(slug)}
                      />
                      <span className="checkmark" />
                      <span>{name}</span>
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
                {authorList.map(({ slug, name, count }) => (
                  <li key={slug}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(slug)}
                        onChange={() => toggleAuthor(slug)}
                      />
                      <span className="checkmark" />
                      <span>{name}</span>
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

            <p className="results-count">Showing 1-{filteredBooks.length} of {filteredBooks.length} results</p>

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
            {filteredBooks.map((i) => (
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