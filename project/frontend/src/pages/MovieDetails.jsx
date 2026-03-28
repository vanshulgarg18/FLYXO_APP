import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { graphqlRequest } from '../utils/graphql';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Film, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      fetchShows();
    }
  }, [selectedDate]);

  const fetchMovieDetails = async () => {
    try {
      const query = `
        query {
          movie(id: ${id}) {
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
      setMovie(data.movie);

      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    } catch (error) {
      toast.error('Failed to fetch movie details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      const query = `
        query {
          shows(movieId: ${id}, showDate: "${selectedDate}") {
            id
            showDate
            showTime
            screen
            availableSeats
            totalSeats
            price
          }
        }
      `;

      const data = await graphqlRequest(query);
      setShows(data.shows);
    } catch (error) {
      toast.error('Failed to fetch shows');
      console.error(error);
    }
  };

  const handleBooking = (showId) => {
    if (!isAuthenticated) {
      toast.info('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/booking/${showId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="loading">Movie not found</div>;
  }

  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginBottom: '40px' }}>
        <div>
          <img src={movie.thumbnail} alt={movie.title} style={{ width: '100%', borderRadius: '12px' }} />
        </div>
        <div>
          <h1 style={{ marginBottom: '16px', fontSize: '36px' }}>{movie.title}</h1>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{movie.rating}</span>
            <span className="badge badge-primary">{movie.language}</span>
            <span className="badge badge-primary">{movie.genre}</span>
            {movie.minimumAge > 0 && (
              <span className="badge badge-warning">{movie.minimumAge}+ years</span>
            )}
          </div>
          <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '24px', color: 'var(--gray)' }}>
            {movie.description}
          </p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} />
              <span>{movie.duration} minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} />
              <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Select Show Date</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {getNextSevenDays().map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`btn ${selectedDate === date ? 'btn-primary' : 'btn-outline'}`}
            >
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>

        <h2 style={{ marginBottom: '24px' }}>Available Shows</h2>
        {shows.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '40px' }}>
            No shows available for this date
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {shows.map((show) => (
              <div key={show.id} className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '600' }}>
                      <Film size={20} />
                      {show.showTime}
                    </div>
                    <span className="badge badge-success">₹{show.price}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--gray)' }}>
                    <MapPin size={16} />
                    Screen {show.screen}
                  </div>
                  <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--gray)' }}>
                    <strong>{show.availableSeats}</strong> of {show.totalSeats} seats available
                  </div>
                  <button
                    onClick={() => handleBooking(show.id)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={show.availableSeats === 0}
                  >
                    {show.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
