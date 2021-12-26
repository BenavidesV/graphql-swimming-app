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
    var t_date= new Date(args.date);
    t_date.setHours(0);
    t_date.setMinutes(0);
    t_date.setSeconds(0);
    var final_date=new Date(args.date);
    final_date.setHours(23);
    final_date.setMinutes(59);
    final_date.setSeconds(59);
    try {
      const events = await Event.find((e) => (e.date > t_date && e.date <= final_date));
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
};
