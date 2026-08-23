import "../assets/scss/Loader.scss";
import "../assets/scss/Loader.scss"

const Loader = () => {
    return (
        <div className="loader-wrapper">
            <div className="book-loader">
                <div className="book-page"></div>
                <div className="book-page"></div>
                <div className="book-page"></div>
            </div>
            <p>Loading your library...</p>
        </div>
    );
};

export default Loader;