import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { graphqlRequest } from '../utils/graphql';
import { Clock, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const query = `
        query {
          movies(isActive: true) {
            id
            title
            description
            genre
            duration
            language
            rating
            minimumAge
            thumbnail
            releaseDate
          }
        }
      `;

      const data = await graphqlRequest(query);
      setMovies(data.movies);
    } catch (error) {
      toast.error('Failed to fetch movies');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ marginBottom: '32px', fontSize: '36px', textAlign: 'center' }}>
        Now Showing
      </h1>

      {movies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
          <p>No movies available at the moment.</p>
        </div>
      ) : (
        <div className="grid">
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none' }}>
              <div className="card">
                <img src={movie.thumbnail} alt={movie.title} className="card-img" />
                <div className="card-body">
                  <h3 className="card-title">{movie.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{movie.rating}</span>
                    <span className="badge badge-primary">{movie.language}</span>
                    <span className="badge badge-primary">{movie.genre}</span>
                  </div>
                  <p className="card-text" style={{ marginBottom: '12px' }}>
                    {movie.description.substring(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: 'var(--gray)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={16} />
                      {movie.duration} min
                    </span>
                    {movie.minimumAge > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={16} />
                        {movie.minimumAge}+ years
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
