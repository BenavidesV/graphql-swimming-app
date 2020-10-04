const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

const bookingLoader = new DataLoader(bookingIds => {
  return Booking.find({ _id: { $in: bookingIds } });
});
const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const suscriberLoader = new DataLoader(userIds => {
  return suscribers(userIds);
});


const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};
const suscribers = async userIds => {
  try {
    const suscribers = await User.find({ _id: { $in: userIds } });
    suscribers.sort((a, b) => {
      return (
        userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
      );
    });
    return suscribers.map(user => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
    suscribers: suscribers.bind(this, event._doc.suscribers)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking.user),
    event: singleEvent.bind(this, booking.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformUser = transformUser;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
