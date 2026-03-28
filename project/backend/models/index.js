const User = require('./User');
const Movie = require('./Movie');
const Show = require('./Show');
const Seat = require('./Seat');
const Booking = require('./Booking');

Movie.hasMany(Show, { foreignKey: 'movieId', as: 'shows' });
Show.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

Show.hasMany(Seat, { foreignKey: 'showId', as: 'seats' });
Seat.belongsTo(Show, { foreignKey: 'showId', as: 'show' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Show.hasMany(Booking, { foreignKey: 'showId', as: 'bookings' });
Booking.belongsTo(Show, { foreignKey: 'showId', as: 'show' });

Seat.belongsTo(User, { foreignKey: 'lockedBy', as: 'lockedUser' });

module.exports = {
  User,
  Movie,
  Show,
  Seat,
  Booking
};
