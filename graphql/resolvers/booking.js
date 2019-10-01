const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
                    booking: async () => {
                        try{
                            const bookings = await Booking.find();
                            return bookings.map(booking => {
                                return transformBooking(booking);
                            })
                        }
                        catch(err){
                            throw err;
                        }
                    },
                    bookEvent: async args => {
                        try{
                            const fetchedEvent = await Event.findOne({_id: args.eventId});
                            const booking = new  Booking({
                                user: '5d91b52e3ff2172bc8b9f501',
                                event: fetchedEvent
                            });
                            const result = await booking.save();
                            return transformBooking(result);
                        }
                        catch(err){
                            throw err
                        }
                    },
                    cancelBooking: async args => {
                        try {
                            const booking = await Booking.findById(args.bookingId).populate('event');
                            if (!booking) {
                                throw new Error('Booking not exists');
                            }
                            const event = transformEvent(booking.event);
                            await Booking.deleteOne({_id: args.bookingId});
                            return event;
                        }
                        catch(err){
                            throw err;
                        }
                    }
                }