import moment from 'moment';
const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      date: new Date(args.eventInput.date),
      creator: req.userId,
      subscribers: [],
      capacity:args.eventInput.capacity
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }

  },
  dateEvents: async (args) => {
    var t_date=moment(args.date);
    var start_date=t.set({
      hour:   '0',
      minute: '0',
      second: '0'
      });
    var final_date=t_date.set({
          hour:   '23',
          minute: '59',
          second: '59'
      });
    try {
      const events = await Event.find((e) => (e.date > start_date && e.date <= final_date));
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
};
