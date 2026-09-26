import { CiBoxList, CiGrid41 } from "react-icons/ci"
import "../assets/scss/Product.scss"
import SingleCard from "../components/SingleCard"
import { supabase } from "../supabaseClient.js"
import { Link, useSearchParams } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io"
import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import Loader from "../components/Loader"
import Aos from "aos"
import { useLocalize } from "../components/hooks/useLocalise.jsx"

const buildContentMap = (rows, localize) => {
  const map = {};
  rows.forEach((row) => {
    if (!map[row.section]) map[row.section] = {};
    map[row.section][row.key] = localize(row, "text");
  });
  return map;
};

const normalizeText = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const matchesWordStart = (text, normalizedQuery) => {
  if (!text) return false;
  const normalizedText = " " + normalizeText(text);
  return normalizedText.includes(" " + normalizedQuery);
};

const Product = () => {
  const { t } = useTranslation("shop");
  const { localize } = useLocalize();

  const [rawBooks, setRawBooks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [contentRows, setContentRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const selectedCategories = useMemo(
    () => (categoryParam ? categoryParam.split(",") : []),
    [categoryParam]
  );

  const authorParam = searchParams.get("author");
  const selectedAuthors = useMemo(
    () => (authorParam ? authorParam.split(",") : []),
    [authorParam]
  );

  const sortParam = searchParams.get("sort");
  const sortBy = sortParam || "";

  const searchQueryParam = searchParams.get("q") ?? searchParams.get("search");
  const searchQuery = searchQueryParam || "";

  const PAGE_SIZE = 7;
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const [minPrice, setMinPrice] = useState(minPriceParam || "");
  const [maxPrice, setMaxPrice] = useState(maxPriceParam || "");


  const [prevPriceParams, setPrevPriceParams] = useState([
    minPriceParam,
    maxPriceParam,
  ]);
  if (
    prevPriceParams[0] !== minPriceParam ||
    prevPriceParams[1] !== maxPriceParam
  ) {
    setPrevPriceParams([minPriceParam, maxPriceParam]);
    setMinPrice(minPriceParam || "");
    setMaxPrice(maxPriceParam || "");
  }

  const content = useMemo(
    () => buildContentMap(contentRows, localize),
    [contentRows, localize]
  );

  const booksData = useMemo(
    () =>
      rawBooks.map((book) => ({
        ...book,
        title: localize(book, "title"),
        description: localize(book, "description"),
        category: localize(book.categories, "name"),
        categorySlug: book.categories?.slug,
        author: localize(book.authors, "name"),
        authorSlug: book.authors?.slug,
      })),
    [rawBooks, localize]
  );

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
            title_en,
            description_az,
            description_en,
            price,
            stock,
            image_url,
            rating,
            sold_count,
            categories ( slug, name_az, name_en ),
            authors ( name, name_az, slug )
          `)
          .eq("is_active", true),
        supabase
          .from("categories")
          .select("slug, name_az, name_en")
          .order("name_az"),
        supabase
          .from("authors")
          .select("slug, name, name_az")
          .order("name"),
        supabase
          .from("page_content")
          .select("section, key, text_en, text_az")
          .eq("page", "product"),
      ]);

      if (error) console.error("Products fetch error:", error);
      else setRawBooks(data || []);

      if (categoriesError) console.error("Categories fetch error:", categoriesError);
      else setAllCategories(categoriesData || []);

      if (authorsError) console.error("Authors fetch error:", authorsError);
      else setAllAuthors(authorsData || []);

      if (contentError) console.error("Content fetch error:", contentError);
      else setContentRows(contentData || []);

      setLoading(false);
      setTimeout(() => Aos.refresh(), 0);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setTimeout(() => Aos.refreshHard(), 0);
  }, [viewMode]);

  const toggleCategory = (slug) => {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((s) => s !== slug)
      : [...selectedCategories, slug];

    if (next.length === 0) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", next.join(","));
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const toggleAuthor = (authorSlug) => {
    const next = selectedAuthors.includes(authorSlug)
      ? selectedAuthors.filter((a) => a !== authorSlug)
      : [...selectedAuthors, authorSlug];

    if (next.length === 0) {
      searchParams.delete("author");
    } else {
      searchParams.set("author", next.join(","));
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const applyPriceRange = () => {
    if (minPrice) searchParams.set("minPrice", minPrice);
    else searchParams.delete("minPrice");

    if (maxPrice) searchParams.set("maxPrice", maxPrice);
    else searchParams.delete("maxPrice");

    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const handleSortChange = (value) => {
    if (value) searchParams.set("sort", value);
    else searchParams.delete("sort");

    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    searchParams.set("page", page);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const authorList = allAuthors.map((author) => ({
    slug: author.slug,
    name: localize(author, "name"),
    count: booksData.filter((b) => b.authorSlug === author.slug).length,
  }));

  const categoryList = allCategories.map((cat) => ({
    slug: cat.slug,
    name: localize(cat, "name"),
    count: booksData.filter((b) => b.categorySlug === cat.slug).length,
  }));

  const normalizedSearch = normalizeText(searchQuery);

  const filteredBooks = booksData.filter((book) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(book.categorySlug);
    const matchesAuthor =
      selectedAuthors.length === 0 || selectedAuthors.includes(book.authorSlug);
    const matchesMinPrice = !minPriceParam || book.price >= Number(minPriceParam);
    const matchesMaxPrice = !maxPriceParam || book.price <= Number(maxPriceParam);

    const matchesSearch =
      !normalizedSearch ||
      matchesWordStart(book.title_az, normalizedSearch) ||
      matchesWordStart(book.title_en, normalizedSearch) ||
      matchesWordStart(book.authors?.name, normalizedSearch) ||
      matchesWordStart(book.authors?.name_az, normalizedSearch);

    return (
      matchesCategory &&
      matchesAuthor &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesSearch
    );
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

      <section className="shop-container">
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
                    placeholder="min"
                    className="price-input"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="max"
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

          <div className="sorting">
            <div className="sort-grid-books">
              <button className={`grid-books ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}><CiGrid41 /></button>
              <button className={`list-books ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}><CiBoxList /></button>
            </div>

            <p className="results-count m-0">
              {t('showing')} {sortedBooks.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}-
              {Math.min(safePage * PAGE_SIZE, sortedBooks.length)} {t('of')} {sortedBooks.length} {t('results')}
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

          <div className="product-box row justify-content-center align-items-center g-3 my-3">
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((i) => (
                <div
                  key={i.id}
                  className={
                    viewMode === "grid"
                      ? "col-12 col-sm-6 col-md-4 col-lg-4 d-flex justify-content-center"
                      : "col-12 my-2"
                  }
                >
                  <SingleCard {...i} viewMode={viewMode} />
                </div>
              ))
            ) : (
              <div className="text-center my-5 w-100">
                <h5>No product in this category.</h5>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav className="pagination-box d-flex justify-content-center gap-2 my-3">
              <button
                className="page-btn"
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
              >
                {t("pagination.prev")}
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
                {t("pagination.next")}
              </button>
            </nav>
          )}

        </div>

      </section>
    </>
  );
};

export default Product;