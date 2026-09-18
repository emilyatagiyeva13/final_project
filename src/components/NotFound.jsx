import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/scss/NotFound.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="icon-wrapper">
          <div className="icon-bg">
            <FileQuestion className="not-found-icon" size={56} />
          </div>
          <span className="badge-404">404</span>
        </div>

        <h1 className="error-code">404</h1>
        <h2 className="title">Page Not Found</h2>
        <p className="description">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
        </p>

        <div className="actions">
          <button onClick={() => navigate(-1)} className="btn-go-back">
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
          
          <Link to="/" className="btn-home">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;