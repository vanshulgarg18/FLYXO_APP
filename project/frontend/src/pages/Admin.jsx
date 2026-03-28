import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { graphqlRequest } from '../utils/graphql';
import { toast } from 'react-toastify';
import { Film, Calendar, Users, Ticket, Plus, X, CreditCard as Edit, Trash2 } from 'lucide-react';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');

  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showShowForm, setShowShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    language: '',
    rating: 'U',
    minimumAge: '0',
    thumbnail: '',
    releaseDate: ''
  });

  const [showForm, setShowForm] = useState({
    movieId: '',
    showDate: '',
    showTime: '',
    screen: '',
    totalSeats: '100',
    price: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Admin access required');
      return;
    }
    fetchData();
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    if (activeTab === 'movies') {
      await fetchMovies();
    } else if (activeTab === 'users') {
      await fetchUsers();
    } else if (activeTab === 'bookings') {
      await fetchBookings();
    }
  };

  const fetchMovies = async () => {
    try {
      const query = `
        query {
          movies {
            id
            title
            genre
            language
            rating
            duration
            releaseDate
            isActive
            thumbnail
          }
        }
      `;
      const data = await graphqlRequest(query);
      setMovies(data.movies);
    } catch (error) {
      toast.error('Failed to fetch movies');
    }
  };

  const fetchUsers = async () => {
    try {
      const query = `
        query {
          users {
            id
            name
            email
            phone
            role
            age
            isActive
            createdAt
          }
        }
      `;
      const data = await graphqlRequest(query);
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchBookings = async () => {
    try {
      const query = `
        query {
          allBookings {
            id
            bookingReference
            totalAmount
            status
            createdAt
            seats
            user {
              name
              email
            }
            show {
              showDate
              showTime
              movie {
                title
              }
            }
          }
        }
      `;
      const data = await graphqlRequest(query);
      setBookings(data.allBookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();

    try {
      const mutation = editingMovie
        ? `mutation {
            updateMovie(id: ${editingMovie.id}, input: {
              title: "${movieForm.title}"
              description: "${movieForm.description}"
              genre: "${movieForm.genre}"
              duration: ${movieForm.duration}
              language: "${movieForm.language}"
              rating: "${movieForm.rating}"
              minimumAge: ${movieForm.minimumAge}
              thumbnail: "${movieForm.thumbnail}"
              releaseDate: "${movieForm.releaseDate}"
            }) {
              id
            }
          }`
        : `mutation {
            createMovie(input: {
              title: "${movieForm.title}"
              description: "${movieForm.description}"
              genre: "${movieForm.genre}"
              duration: ${movieForm.duration}
              language: "${movieForm.language}"
              rating: "${movieForm.rating}"
              minimumAge: ${movieForm.minimumAge}
              thumbnail: "${movieForm.thumbnail}"
              releaseDate: "${movieForm.releaseDate}"
            }) {
              id
            }
          }`;

      await graphqlRequest(mutation);
      toast.success(editingMovie ? 'Movie updated successfully' : 'Movie created successfully');
      setShowMovieForm(false);
      setEditingMovie(null);
      resetMovieForm();
      fetchMovies();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShowSubmit = async (e) => {
    e.preventDefault();

    try {
      const mutation = `
        mutation {
          createShow(input: {
            movieId: ${showForm.movieId}
            showDate: "${showForm.showDate}"
            showTime: "${showForm.showTime}"
            screen: "${showForm.screen}"
            totalSeats: ${showForm.totalSeats}
            price: ${showForm.price}
          }) {
            id
          }
        }
      `;

      await graphqlRequest(mutation);
      toast.success('Show created successfully');
      setShowShowForm(false);
      resetShowForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      const mutation = `
        mutation {
          deleteMovie(id: ${id})
        }
      `;
      await graphqlRequest(mutation);
      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const mutation = `
        mutation {
          deleteUser(id: ${id})
        }
      `;
      await graphqlRequest(mutation);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleUserStatus = async (id, currentStatus) => {
    try {
      const mutation = `
        mutation {
          updateUserStatus(id: ${id}, isActive: ${!currentStatus}) {
            id
          }
        }
      `;
      await graphqlRequest(mutation);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetMovieForm = () => {
    setMovieForm({
      title: '',
      description: '',
      genre: '',
      duration: '',
      language: '',
      rating: 'U',
      minimumAge: '0',
      thumbnail: '',
      releaseDate: ''
    });
  };

  const resetShowForm = () => {
    setShowForm({
      movieId: '',
      showDate: '',
      showTime: '',
      screen: '',
      totalSeats: '100',
      price: ''
    });
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description || '',
      genre: movie.genre,
      duration: movie.duration.toString(),
      language: movie.language,
      rating: movie.rating,
      minimumAge: movie.minimumAge.toString(),
      thumbnail: movie.thumbnail,
      releaseDate: movie.releaseDate.split('T')[0]
    });
    setShowMovieForm(true);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ marginBottom: '32px' }}>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('movies')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            borderBottom: activeTab === 'movies' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'movies' ? 'var(--primary)' : 'var(--gray)'
          }}
        >
          <Film size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Movies
        </button>
        <button
          onClick={() => setActiveTab('shows')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            borderBottom: activeTab === 'shows' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'shows' ? 'var(--primary)' : 'var(--gray)'
          }}
        >
          <Calendar size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Shows
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'users' ? 'var(--primary)' : 'var(--gray)'
          }}
        >
          <Users size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Users
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            borderBottom: activeTab === 'bookings' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--gray)'
          }}
        >
          <Ticket size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Bookings
        </button>
      </div>

      {activeTab === 'movies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2>Manage Movies</h2>
            <button onClick={() => setShowMovieForm(true)} className="btn btn-primary">
              <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Add Movie
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Rating</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <img src={movie.thumbnail} alt={movie.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.language}</td>
                  <td><span className="badge badge-primary">{movie.rating}</span></td>
                  <td>{movie.duration} min</td>
                  <td>
                    <span className={`badge ${movie.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {movie.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEditMovie(movie)} className="btn btn-outline" style={{ padding: '4px 8px', marginRight: '8px' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteMovie(movie.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'shows' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2>Manage Shows</h2>
            <button onClick={() => setShowShowForm(true)} className="btn btn-primary">
              <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Create Show
            </button>
          </div>
          <p style={{ color: 'var(--gray)', padding: '40px', textAlign: 'center' }}>
            Shows are created using the form above. View shows by selecting a movie from the Movies page.
          </p>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 style={{ marginBottom: '24px' }}>Manage Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Age</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td><span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>{user.role}</span></td>
                  <td>{user.age}</td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', marginRight: '8px' }}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h2 style={{ marginBottom: '24px' }}>All Bookings</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>User</th>
                <th>Movie</th>
                <th>Show Date</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const seats = JSON.parse(booking.seats);
                return (
                  <tr key={booking.id}>
                    <td>{booking.bookingReference}</td>
                    <td>{booking.user.name}</td>
                    <td>{booking.show.movie.title}</td>
                    <td>{new Date(booking.show.showDate).toLocaleDateString()}</td>
                    <td>{seats.length} seats</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>
                      <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showMovieForm && (
        <div className="modal-overlay" onClick={() => { setShowMovieForm(false); setEditingMovie(null); resetMovieForm(); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowMovieForm(false); setEditingMovie(null); resetMovieForm(); }}>
              <X />
            </button>
            <h2 style={{ marginBottom: '24px' }}>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
            <form onSubmit={handleMovieSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Genre</label>
                  <input
                    type="text"
                    className="form-input"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input
                    type="text"
                    className="form-input"
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Duration (min)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-select"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                  >
                    <option value="U">U</option>
                    <option value="UA">UA</option>
                    <option value="A">A</option>
                    <option value="R">R</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Min Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={movieForm.minimumAge}
                    onChange={(e) => setMovieForm({ ...movieForm, minimumAge: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={movieForm.thumbnail}
                  onChange={(e) => setMovieForm({ ...movieForm, thumbnail: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Release Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={movieForm.releaseDate}
                  onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {editingMovie ? 'Update Movie' : 'Create Movie'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showShowForm && (
        <div className="modal-overlay" onClick={() => { setShowShowForm(false); resetShowForm(); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowShowForm(false); resetShowForm(); }}>
              <X />
            </button>
            <h2 style={{ marginBottom: '24px' }}>Create New Show</h2>
            <form onSubmit={handleShowSubmit}>
              <div className="form-group">
                <label className="form-label">Movie</label>
                <select
                  className="form-select"
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  required
                >
                  <option value="">Select Movie</option>
                  {movies.filter(m => m.isActive).map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Show Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Show Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={showForm.showTime}
                    onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Screen</label>
                  <input
                    type="text"
                    className="form-input"
                    value={showForm.screen}
                    onChange={(e) => setShowForm({ ...showForm, screen: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Seats</label>
                  <input
                    type="number"
                    className="form-input"
                    value={showForm.totalSeats}
                    onChange={(e) => setShowForm({ ...showForm, totalSeats: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={showForm.price}
                    onChange={(e) => setShowForm({ ...showForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Create Show
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
