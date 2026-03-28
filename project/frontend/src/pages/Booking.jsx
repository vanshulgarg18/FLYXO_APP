import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { graphqlRequest } from '../utils/graphql';
import { getSocket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const Booking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [idProofType, setIdProofType] = useState('aadhar');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const socket = getSocket();

  useEffect(() => {
    fetchShowDetails();
    socket.emit('joinShow', showId);

    socket.on('seatsUpdated', (updatedSeats) => {
      setSeats((prevSeats) => {
        const newSeats = [...prevSeats];
        updatedSeats.forEach((updatedSeat) => {
          const index = newSeats.findIndex((s) => s.id === updatedSeat.id);
          if (index !== -1) {
            newSeats[index] = updatedSeat;
          }
        });
        return newSeats;
      });
    });

    return () => {
      if (selectedSeats.length > 0) {
        unlockSeats();
      }
      socket.emit('leaveShow', showId);
      socket.off('seatsUpdated');
    };
  }, []);

  const fetchShowDetails = async () => {
    try {
      const query = `
        query {
          show(id: ${showId}) {
            id
            showDate
            showTime
            screen
            totalSeats
            availableSeats
            price
            movie {
              id
              title
              thumbnail
              rating
              minimumAge
            }
            seats {
              id
              seatNumber
              row
              status
              lockedBy
            }
          }
        }
      `;

      const data = await graphqlRequest(query);
      setShow(data.show);
      setSeats(data.show.seats);
    } catch (error) {
      toast.error('Failed to fetch show details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = async (seat) => {
    if (seat.status === 'booked' || (seat.status === 'locked' && seat.lockedBy !== user.id)) {
      return;
    }

    if (selectedSeats.find((s) => s.id === seat.id)) {
      try {
        await unlockSpecificSeats([seat.id]);
        setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      if (selectedSeats.length >= 10) {
        toast.warning('You can select maximum 10 seats at a time');
        return;
      }

      try {
        await lockSeats([seat.id]);
        setSelectedSeats([...selectedSeats, seat]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const lockSeats = async (seatIds) => {
    const mutation = `
      mutation {
        lockSeats(showId: ${showId}, seatIds: [${seatIds.join(',')}]) {
          id
          seatNumber
          status
        }
      }
    `;

    await graphqlRequest(mutation);
    socket.emit('seatLocked', { showId, seatIds });
  };

  const unlockSeats = async () => {
    if (selectedSeats.length === 0) return;

    const seatIds = selectedSeats.map((s) => s.id);
    await unlockSpecificSeats(seatIds);
  };

  const unlockSpecificSeats = async (seatIds) => {
    const mutation = `
      mutation {
        unlockSeats(showId: ${showId}, seatIds: [${seatIds.join(',')}]) {
          id
          seatNumber
          status
        }
      }
    `;

    await graphqlRequest(mutation);
    socket.emit('seatUnlocked', { showId, seatIds });
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat');
      return;
    }

    if (user.age < show.movie.minimumAge) {
      toast.error(`You must be at least ${show.movie.minimumAge} years old to watch this movie`);
      return;
    }

    setShowBookingForm(true);
  };

  const validateIdProof = () => {
    const patterns = {
      aadhar: /^\d{12}$/,
      pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      driving_license: /^[A-Z]{2}[0-9]{13}$/,
      passport: /^[A-Z]{1}[0-9]{7}$/
    };

    return patterns[idProofType]?.test(idProofNumber);
  };

  const handleConfirmBooking = async () => {
    if (!validateIdProof()) {
      toast.error('Invalid ID proof number format');
      return;
    }

    setBookingLoading(true);

    try {
      const seatIds = selectedSeats.map((s) => s.id);
      const mutation = `
        mutation {
          createBooking(input: {
            showId: ${showId}
            seatIds: [${seatIds.join(',')}]
            idProofType: "${idProofType}"
            idProofNumber: "${idProofNumber}"
          }) {
            id
            bookingReference
            totalAmount
          }
        }
      `;

      const data = await graphqlRequest(mutation);
      socket.emit('seatBooked', { showId, seatIds });

      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!show) {
    return <div className="loading">Show not found</div>;
  }

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(groupedSeats).sort();

  const getSeatClass = (seat) => {
    if (selectedSeats.find((s) => s.id === seat.id)) {
      return 'selected';
    }
    return seat.status;
  };

  const totalAmount = selectedSeats.length * show.price;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <div>
          <h1 style={{ marginBottom: '24px' }}>{show.movie.title}</h1>
          <div style={{ marginBottom: '32px', color: 'var(--gray)' }}>
            <p>Screen {show.screen} | {show.showDate} | {show.showTime}</p>
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{
              backgroundColor: 'var(--light-gray)',
              padding: '12px',
              borderRadius: '8px 8px 0 0',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              SCREEN
            </div>
          </div>

          <div className="seat-layout">
            {rows.map((row) => (
              <div key={row} className="seat-row">
                <div style={{ width: '30px', fontWeight: '600', color: 'var(--gray)' }}>{row}</div>
                {groupedSeats[row].map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${getSeatClass(seat)}`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.seatNumber.replace(row, '')}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '32px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="seat available" style={{ width: '24px', height: '24px' }}></div>
              <span>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="seat selected" style={{ width: '24px', height: '24px' }}></div>
              <span>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="seat locked" style={{ width: '24px', height: '24px' }}></div>
              <span>Locked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="seat booked" style={{ width: '24px', height: '24px' }}></div>
              <span>Booked</span>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <div className="card-body">
              <h3 style={{ marginBottom: '20px' }}>Booking Summary</h3>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: 'var(--gray)', marginBottom: '8px' }}>Selected Seats</p>
                <p style={{ fontSize: '18px', fontWeight: '600' }}>
                  {selectedSeats.length > 0
                    ? selectedSeats.map((s) => s.seatNumber).join(', ')
                    : 'No seats selected'}
                </p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: 'var(--gray)', marginBottom: '8px' }}>Price per ticket</p>
                <p style={{ fontSize: '18px', fontWeight: '600' }}>₹{show.price}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
                <p style={{ color: 'var(--gray)', marginBottom: '8px' }}>Total Amount</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  ₹{totalAmount}
                </p>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingForm(false)}>
              <X />
            </button>
            <h2 style={{ marginBottom: '24px' }}>Complete Your Booking</h2>

            <div className="form-group">
              <label className="form-label">ID Proof Type</label>
              <select
                className="form-select"
                value={idProofType}
                onChange={(e) => setIdProofType(e.target.value)}
              >
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ID Proof Number</label>
              <input
                type="text"
                className="form-input"
                value={idProofNumber}
                onChange={(e) => setIdProofNumber(e.target.value.toUpperCase())}
                placeholder={
                  idProofType === 'aadhar'
                    ? '123456789012'
                    : idProofType === 'pan'
                    ? 'ABCDE1234F'
                    : idProofType === 'driving_license'
                    ? 'DL1234567890123'
                    : 'A1234567'
                }
              />
              <p style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                {idProofType === 'aadhar' && '12 digits'}
                {idProofType === 'pan' && 'Format: ABCDE1234F'}
                {idProofType === 'driving_license' && 'Format: DL followed by 13 digits'}
                {idProofType === 'passport' && 'Format: 1 letter followed by 7 digits'}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--light-gray)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px' }}>Booking Details</h4>
              <p>Movie: {show.movie.title}</p>
              <p>Seats: {selectedSeats.map((s) => s.seatNumber).join(', ')}</p>
              <p>Total: ₹{totalAmount}</p>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
