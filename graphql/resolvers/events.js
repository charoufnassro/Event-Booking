const Event = require('../../models/event');
const User = require('../../models/user')
const { transformEvent } = require('./merge');
const { dateToString } = require('../../helpers/date');

module.exports = {
                    events: async () => {
                        try{
                            const events = await Event.find();
                            return events.map(event =>{
                                return transformEvent(event);
                            });
                        }catch(err){
                            throw err
                        }
                    },
                    createEvent: async (args, req) => {
                        if(!req.isAuth){
                            throw new Error('Unauthenticated!');
                        }
                        const event = await new Event({
                            title: args.eventInput.title,
                            description: args.eventInput.description,
                            price: +args.eventInput.price,
                            date: dateToString(args.eventInput.date),
                            creator: req.userId
                        });

                        let createdEvent;

                        try{
                            const eventResult = await event.save();
                            createdEvent = transformEvent(eventResult);
                            const userExists = await User.findById(req.userId);

                            if(!userExists) {
                                throw new Error('User not found.')
                            }

                            userExists.createEvents.push(event);
                            const userResult = await userExists.save(); 
                                return createdEvent;
                        }
                        catch( err) {
                            throw err;
                        };
                    }
                }