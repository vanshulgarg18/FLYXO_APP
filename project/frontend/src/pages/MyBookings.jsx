import { useState, useEffect } from 'react';
import { graphqlRequest } from '../utils/graphql';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const query = `
        query {
          myBookings {
            id
            bookingReference
            totalAmount
            idProofType
            status
            createdAt
            seats
            show {
              id
              showDate
              showTime
              screen
              price
              movie {
                id
                title
                thumbnail
                rating
              }
            }
          }
        }
      `;

      const data = await graphqlRequest(query);
      setBookings(data.myBookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const mutation = `
        mutation {
          cancelBooking(id: ${bookingId}) {
            id
            status
          }
        }
      `;

      await graphqlRequest(mutation);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ marginBottom: '32px' }}>My Bookings</h1>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
          <Ticket size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p style={{ fontSize: '18px' }}>No bookings found</p>
          <p>Book your first movie ticket now!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {bookings.map((booking) => {
            const seats = JSON.parse(booking.seats);
            return (
              <div key={booking.id} className="card">
                <div className="card-body" style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'start' }}>
                    <img
                      src={booking.show.movie.thumbnail}
                      alt={booking.show.movie.title}
                      style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                    />

                    <div>
                      <h3 style={{ marginBottom: '12px', fontSize: '24px' }}>{booking.show.movie.title}</h3>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)' }}>
                          <Calendar size={16} />
                          <span>{new Date(booking.show.showDate).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)' }}>
                          <Clock size={16} />
                          <span>{booking.show.showTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)' }}>
                          <MapPin size={16} />
                          <span>Screen {booking.show.screen}</span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <strong>Booking Reference:</strong> {booking.bookingReference}
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <strong>Seats:</strong> {seats.map((s) => s.seatNumber).join(', ')}
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <strong>Total Amount:</strong> ₹{booking.totalAmount}
                      </div>

                      <div>
                        <strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`badge ${
                          booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'
                        }`}
                        style={{ marginBottom: '16px', display: 'inline-block' }}
                      >
                        {booking.status}
                      </span>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn btn-danger"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
