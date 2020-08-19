const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
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
  runway: Int!
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
  runway: Int!
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
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
