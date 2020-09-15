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
      const bookings = await Booking.find({user: req.userId});
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
    
    if (fetchedEvent.suscribers.includes(suscriber)) {
      throw new Error('Already registered!');
    }
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
      attendance:false
    });
    const result = await booking.save();
    fetchedEvent.suscribers.push(suscriber);
    await fetchedEvent.save();
    
    return transformBooking(result);
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
      
      const booking = await Booking.findOne({event: args.eventId, user:req.userId });
      booking.attendance=true;
      booking.runway=args.runwaySelected
      booking.save();
      
      return booking;
    } catch (err) {
      throw err;
    }
  }
};
