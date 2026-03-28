const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: Int!
    name: String!
    email: String!
    phone: String!
    role: String!
    age: Int!
    isActive: Boolean!
    createdAt: String!
  }

  type Movie {
    id: Int!
    title: String!
    description: String!
    genre: String!
    duration: Int!
    language: String!
    rating: String!
    minimumAge: Int!
    thumbnail: String!
    releaseDate: String!
    isActive: Boolean!
    shows: [Show]
  }

  type Show {
    id: Int!
    movieId: Int!
    showDate: String!
    showTime: String!
    screen: String!
    totalSeats: Int!
    availableSeats: Int!
    price: Float!
    isActive: Boolean!
    movie: Movie
    seats: [Seat]
  }

  type Seat {
    id: Int!
    showId: Int!
    seatNumber: String!
    row: String!
    status: String!
    lockedBy: Int
    lockedAt: String
  }

  type Booking {
    id: Int!
    userId: Int!
    showId: Int!
    seats: String!
    totalAmount: Float!
    bookingReference: String!
    idProofType: String!
    idProofNumber: String!
    status: String!
    paymentStatus: String!
    createdAt: String!
    user: User
    show: Show
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
    user(id: Int!): User

    movies(isActive: Boolean): [Movie]
    movie(id: Int!): Movie

    shows(movieId: Int, showDate: String): [Show]
    show(id: Int!): Show

    seats(showId: Int!): [Seat]

    myBookings: [Booking]
    booking(id: Int!): Booking
    allBookings: [Booking]
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    age: Int!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input MovieInput {
    title: String!
    description: String!
    genre: String!
    duration: Int!
    language: String!
    rating: String!
    minimumAge: Int!
    thumbnail: String!
    releaseDate: String!
  }

  input ShowInput {
    movieId: Int!
    showDate: String!
    showTime: String!
    screen: String!
    totalSeats: Int!
    price: Float!
  }

  input BookingInput {
    showId: Int!
    seatIds: [Int!]!
    idProofType: String!
    idProofNumber: String!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload
    login(input: LoginInput!): AuthPayload

    createMovie(input: MovieInput!): Movie
    updateMovie(id: Int!, input: MovieInput!): Movie
    deleteMovie(id: Int!): Boolean

    createShow(input: ShowInput!): Show
    updateShow(id: Int!, input: ShowInput!): Show
    deleteShow(id: Int!): Boolean

    lockSeats(showId: Int!, seatIds: [Int!]!): [Seat]
    unlockSeats(showId: Int!, seatIds: [Int!]!): [Seat]

    createBooking(input: BookingInput!): Booking
    cancelBooking(id: Int!): Booking

    deleteUser(id: Int!): Boolean
    updateUserStatus(id: Int!, isActive: Boolean!): User
  }
`);

module.exports = schema;
