const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    runway: Int
    attendance: Boolean!
    createdAt: String!
    updatedAt: String!
}

type Event {
  _id: ID!
  title: String!
  description: String!
  date: String!
  creator: User!
  suscribers: [User!]!
  capacity: Int!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
  fullname: String!
}

type AuthData {
  userId: ID!
  userRole: String!
  token: String!
  tokenExpiration: Int!
}

input EventInput {
  title: String!
  description: String!
  date: String!
  capacity: Int!
}

input UserInput {
  role: String!
  email: String!
  password: String!
  identification: String!
  phone: String
  fullname: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    eventBookings(eventId: ID!): [Booking!]!
    cancelBooking(bookingId: ID!): Event!
    checkList(bookingId: ID!, runwaySelected: Int): Booking!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
