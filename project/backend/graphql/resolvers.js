const { User, Movie, Show, Seat, Booking } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { generateToken } = require('../utils/jwt');
const { validateIdProof, generateBookingReference } = require('../utils/validators');
const { Op } = require('sequelize');

const resolvers = {
  me: async (args, context) => {
    const user = requireAuth(context.user);
    return user;
  },

  users: async (args, context) => {
    requireAdmin(context.user);
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  },

  user: async ({ id }, context) => {
    requireAdmin(context.user);
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new Error('User not found');
    return user;
  },

  movies: async ({ isActive }) => {
    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return await Movie.findAll({
      where,
      order: [['releaseDate', 'DESC']]
    });
  },

  movie: async ({ id }) => {
    const movie = await Movie.findByPk(id, {
      include: [{
        model: Show,
        as: 'shows',
        where: { isActive: true },
        required: false
      }]
    });
    if (!movie) throw new Error('Movie not found');
    return movie;
  },

  shows: async ({ movieId, showDate }) => {
    const where = { isActive: true };
    if (movieId) where.movieId = movieId;
    if (showDate) where.showDate = showDate;

    return await Show.findAll({
      where,
      include: [
        { model: Movie, as: 'movie' },
        { model: Seat, as: 'seats' }
      ],
      order: [['showDate', 'ASC'], ['showTime', 'ASC']]
    });
  },

  show: async ({ id }) => {
    const show = await Show.findByPk(id, {
      include: [
        { model: Movie, as: 'movie' },
        { model: Seat, as: 'seats' }
      ]
    });
    if (!show) throw new Error('Show not found');
    return show;
  },

  seats: async ({ showId }) => {
    return await Seat.findAll({
      where: { showId },
      order: [['row', 'ASC'], ['seatNumber', 'ASC']]
    });
  },

  myBookings: async (args, context) => {
    const user = requireAuth(context.user);
    return await Booking.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Show,
          as: 'show',
          include: [{ model: Movie, as: 'movie' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  },

  booking: async ({ id }, context) => {
    const user = requireAuth(context.user);
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: Show,
          as: 'show',
          include: [{ model: Movie, as: 'movie' }]
        }
      ]
    });

    if (!booking) throw new Error('Booking not found');

    if (user.role !== 'admin' && booking.userId !== user.id) {
      throw new Error('Unauthorized access to booking');
    }

    return booking;
  },

  allBookings: async (args, context) => {
    requireAdmin(context.user);
    return await Booking.findAll({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: Show,
          as: 'show',
          include: [{ model: Movie, as: 'movie' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  },

  register: async ({ input }) => {
    const existingUser = await User.findOne({ where: { email: input.email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    if (input.age < 13) {
      throw new Error('You must be at least 13 years old to register');
    }

    const user = await User.create(input);
    const token = generateToken(user.id);

    const userObj = user.toJSON();
    delete userObj.password;

    return { token, user: userObj };
  },

  login: async ({ input }) => {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated');
    }

    const isValidPassword = await user.comparePassword(input.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);

    const userObj = user.toJSON();
    delete userObj.password;

    return { token, user: userObj };
  },

  createMovie: async ({ input }, context) => {
    requireAdmin(context.user);
    return await Movie.create(input);
  },

  updateMovie: async ({ id, input }, context) => {
    requireAdmin(context.user);
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error('Movie not found');

    await movie.update(input);
    return movie;
  },

  deleteMovie: async ({ id }, context) => {
    requireAdmin(context.user);
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error('Movie not found');

    await movie.destroy();
    return true;
  },

  createShow: async ({ input }, context) => {
    requireAdmin(context.user);

    const movie = await Movie.findByPk(input.movieId);
    if (!movie) throw new Error('Movie not found');

    const show = await Show.create({
      ...input,
      availableSeats: input.totalSeats
    });

    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = Math.ceil(input.totalSeats / rows.length);

    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        if (seats.length >= input.totalSeats) break;

        seats.push({
          showId: show.id,
          seatNumber: `${rows[i]}${j}`,
          row: rows[i],
          status: 'available'
        });
      }
      if (seats.length >= input.totalSeats) break;
    }

    await Seat.bulkCreate(seats);

    return show;
  },

  updateShow: async ({ id, input }, context) => {
    requireAdmin(context.user);
    const show = await Show.findByPk(id);
    if (!show) throw new Error('Show not found');

    await show.update(input);
    return show;
  },

  deleteShow: async ({ id }, context) => {
    requireAdmin(context.user);
    const show = await Show.findByPk(id);
    if (!show) throw new Error('Show not found');

    await Seat.destroy({ where: { showId: id } });
    await show.destroy();
    return true;
  },

  lockSeats: async ({ showId, seatIds }, context) => {
    const user = requireAuth(context.user);

    const now = new Date();
    await Seat.update(
      { status: 'available', lockedBy: null, lockedAt: null },
      {
        where: {
          status: 'locked',
          lockedAt: {
            [Op.lt]: new Date(now - 5 * 60 * 1000)
          }
        }
      }
    );

    const seats = await Seat.findAll({
      where: {
        id: seatIds,
        showId: showId
      }
    });

    if (seats.length !== seatIds.length) {
      throw new Error('Some seats not found');
    }

    for (const seat of seats) {
      if (seat.status !== 'available') {
        throw new Error(`Seat ${seat.seatNumber} is not available`);
      }
    }

    await Seat.update(
      {
        status: 'locked',
        lockedBy: user.id,
        lockedAt: new Date()
      },
      {
        where: { id: seatIds }
      }
    );

    return await Seat.findAll({ where: { id: seatIds } });
  },

  unlockSeats: async ({ showId, seatIds }, context) => {
    const user = requireAuth(context.user);

    await Seat.update(
      {
        status: 'available',
        lockedBy: null,
        lockedAt: null
      },
      {
        where: {
          id: seatIds,
          showId: showId,
          lockedBy: user.id,
          status: 'locked'
        }
      }
    );

    return await Seat.findAll({ where: { id: seatIds } });
  },

  createBooking: async ({ input }, context) => {
    const user = requireAuth(context.user);

    if (!validateIdProof(input.idProofType, input.idProofNumber)) {
      throw new Error('Invalid ID proof number format');
    }

    const show = await Show.findByPk(input.showId, {
      include: [{ model: Movie, as: 'movie' }]
    });

    if (!show) throw new Error('Show not found');

    if (user.age < show.movie.minimumAge) {
      throw new Error(`You must be at least ${show.movie.minimumAge} years old to watch this movie`);
    }

    const seats = await Seat.findAll({
      where: {
        id: input.seatIds,
        showId: input.showId,
        lockedBy: user.id,
        status: 'locked'
      }
    });

    if (seats.length !== input.seatIds.length) {
      throw new Error('Some seats are not locked by you or have expired');
    }

    await Seat.update(
      { status: 'booked' },
      { where: { id: input.seatIds } }
    );

    await show.update({
      availableSeats: show.availableSeats - seats.length
    });

    const totalAmount = show.price * seats.length;

    const booking = await Booking.create({
      userId: user.id,
      showId: input.showId,
      seats: JSON.stringify(seats.map(s => ({ id: s.id, seatNumber: s.seatNumber }))),
      totalAmount,
      bookingReference: generateBookingReference(),
      idProofType: input.idProofType,
      idProofNumber: input.idProofNumber
    });

    return await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: Show,
          as: 'show',
          include: [{ model: Movie, as: 'movie' }]
        }
      ]
    });
  },

  cancelBooking: async ({ id }, context) => {
    const user = requireAuth(context.user);

    const booking = await Booking.findByPk(id, {
      include: [{ model: Show, as: 'show' }]
    });

    if (!booking) throw new Error('Booking not found');

    if (user.role !== 'admin' && booking.userId !== user.id) {
      throw new Error('Unauthorized to cancel this booking');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    const seatData = JSON.parse(booking.seats);
    const seatIds = seatData.map(s => s.id);

    await Seat.update(
      { status: 'available', lockedBy: null, lockedAt: null },
      { where: { id: seatIds } }
    );

    await booking.show.update({
      availableSeats: booking.show.availableSeats + seatIds.length
    });

    await booking.update({ status: 'cancelled' });

    return booking;
  },

  deleteUser: async ({ id }, context) => {
    requireAdmin(context.user);

    if (id === context.user.id) {
      throw new Error('Cannot delete your own account');
    }

    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    await user.destroy();
    return true;
  },

  updateUserStatus: async ({ id, isActive }, context) => {
    requireAdmin(context.user);

    if (id === context.user.id) {
      throw new Error('Cannot modify your own status');
    }

    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    await user.update({ isActive });

    const userObj = user.toJSON();
    delete userObj.password;
    return userObj;
  }
};

module.exports = resolvers;
