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
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
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

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const [minPrice, setMinPrice] = useState(minPriceParam || "");
  const [maxPrice, setMaxPrice] = useState(maxPriceParam || "");

  const sortParam = searchParams.get("sort");
  const [sortBy, setSortBy] = useState(sortParam || "");

  const PAGE_SIZE = 7;
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState(Number(pageParam) || 1);

  // page_content sətirlərini { section: { key: text_az } } formasına çeviririk
  const buildContentMap = (rows) => {
    const map = {};
    rows.forEach((row) => {
      if (!map[row.section]) map[row.section] = {};
      map[row.section][row.key] = row.text_en;
    });
    return map;
  };

  useEffect(() => {
    const fetchProducts = async () => {

      const [
        { data, error },
        { data: categoriesData, error: categoriesError },
        { data: authorsData, error: authorsError },
        { data: contentData, error: contentError },
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
            sold_count,
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
        supabase
          .from("page_content")
          .select("section, key, text_en")
          .eq("page", "product"),
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

      if (contentError) {
        console.error("Content fetch error:", contentError);
      } else {
        setContent(buildContentMap(contentData));
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

  // URL-dəki price parametrləri dəyişərsə state-i sinxronlaşdır
  useEffect(() => {
    setMinPrice(minPriceParam || "");
    setMaxPrice(maxPriceParam || "");
  }, [minPriceParam, maxPriceParam]);

  // URL-dəki sort parametri dəyişərsə state-i sinxronlaşdır
  useEffect(() => {
    setSortBy(sortParam || "");
  }, [sortParam]);

  // URL-dəki page parametri dəyişərsə state-i sinxronlaşdır
  useEffect(() => {
    setCurrentPage(Number(pageParam) || 1);
  }, [pageParam]);

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
      searchParams.delete("page");
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
      searchParams.delete("page");
      setSearchParams(searchParams);

      return next;
    });
  };

  const applyPriceRange = () => {
    if (minPrice) {
      searchParams.set("minPrice", minPrice);
    } else {
      searchParams.delete("minPrice");
    }
    if (maxPrice) {
      searchParams.set("maxPrice", maxPrice);
    } else {
      searchParams.delete("maxPrice");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (value) {
      searchParams.set("sort", value);
    } else {
      searchParams.delete("sort");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    searchParams.set("page", page);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const matchesMinPrice = !minPriceParam || book.price >= Number(minPriceParam);
    const matchesMaxPrice = !maxPriceParam || book.price <= Number(maxPriceParam);
    return matchesCategory && matchesAuthor && matchesMinPrice && matchesMaxPrice;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return (b.sold_count || 0) - (a.sold_count || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBooks = sortedBooks.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="book-header">
        <nav className="breadcrumb d-flex justify-content-center">
          <Link to={`/`}>{content.breadcrumb?.home}</Link>
          <span>&gt;</span>
          <span>{content.breadcrumb?.shop}</span>
        </nav>

        <h1 className="title">{content.header?.title}</h1>

        <p className="description">
          {content.header?.description}
        </p>
      </section>

      <section className="d-flex gap-3 p-3">
        <div className="filter-box d-flex flex-column gap-3">

          <div className="category">
            <div className="filter-card">
              <div className="filter-card-title d-flex justify-content-between align-items-center">
                <span>{content.filters?.category_title}</span>
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
                <span>{content.filters?.authors_title}</span>
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

          <div className="price-range">
            <div className="filter-card">
              <div className="filter-card-title d-flex justify-content-between align-items-center">
                <span>{content.filters?.price_title}</span>
                <button
                  className={` ${isPriceOpen ? "open" : ""}`}
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <IoIosArrowDown />
                </button>
              </div>

              <div className={`price-range-body ${isPriceOpen ? "open" : ""}`}>
                <div className="price-inputs d-flex gap-2 align-items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    className="price-input"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    className="price-input"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <button className="price-apply-btn" onClick={applyPriceRange}>
                  {content.filters?.price_apply}
                </button>
              </div>
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

            <p className="results-count">
              Showing {sortedBooks.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}-
              {Math.min(safePage * PAGE_SIZE, sortedBooks.length)} of {sortedBooks.length} results
            </p>

            <div className="dropdown">
              <button className="dropbtn">
                {content.sorting?.sort_by} <IoIosArrowDown className="dropdown-arrow" />
              </button>
              <div className="dropdown-content">
                <div className="dropdown-inner">
                  <ul className="list-unstyled">
                    <li
                      className={sortBy === "popularity" ? "active" : ""}
                      onClick={() => handleSortChange("popularity")}
                    >
                      {content.sorting?.popularity}
                    </li>
                    <li
                      className={sortBy === "rating" ? "active" : ""}
                      onClick={() => handleSortChange("rating")}
                    >
                      {content.sorting?.rating}
                    </li>
                    <li
                      className={sortBy === "price_asc" ? "active" : ""}
                      onClick={() => handleSortChange("price_asc")}
                    >
                      {content.sorting?.price_low_high}
                    </li>
                    <li
                      className={sortBy === "price_desc" ? "active" : ""}
                      onClick={() => handleSortChange("price_desc")}
                    >
                      {content.sorting?.price_high_low}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="product-box row my-3">
            {paginatedBooks.map((i) => (
              <div
                key={i.id}
                className={viewMode === "grid" ? "col-6 col-md-4 col-lg-4 my-2" : "col-12 my-2"}
              >
                <SingleCard {...i} viewMode={viewMode} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination-box d-flex justify-content-center gap-2 my-3">
              <button
                className="page-btn"
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${page === safePage ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={safePage === totalPages}
                onClick={() => goToPage(safePage + 1)}
              >
                Next
              </button>
            </nav>
          )}

        </div>

      </section>

    </>
  )
}


export default Product