const Event = require('../../models/event');
const Booking = require('../../models/booking');
const User = require('../../models/user');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  approvalBookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ approved: false });
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    const suscriber = await User.findById(req.userId);

    if (!fetchedEvent.suscribers.filter(function (e) { return JSON.stringify(e._id) === JSON.stringify(suscriber._id); }).length > 0) {//fetchedEvent.suscribers.includes(req.userId)
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent._id,
        attendance: false,
        approved: false,
        runway:0
      });
      const result = await booking.save();
      fetchedEvent.suscribers.push(suscriber);
      await fetchedEvent.save();

      return transformBooking(result);
    }
    throw new Error('User already registered!');

  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
  confirmBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const booking = await Booking.findById(args.bookingId);
      booking.approved = true;
      booking.save();
      return transformBooking(booking)
    } catch (err) {
      throw err;
    }
  },
  checkList: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const booking = await Booking.findOne({ _id: args.bookingId });
      //throw new Error('EL booking es: '+booking+" con Id: "+args.bookingId+"y ID: "+booking._id);
      booking.attendance = true;
      booking.runway = args.runwaySelected
      booking.save();

      return transformBooking(booking);
    } catch (err) {
      throw err;
    }
  },
  eventBookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({ event: args.eventId });
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
};
