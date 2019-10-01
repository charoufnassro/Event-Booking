const Event = require('../../models/event');
const { transformEvent } = require('./merge');

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
                    createEvent: async args => {
                        const event = await new Event({
                            title: args.eventInput.title,
                            description: args.eventInput.description,
                            price: +args.eventInput.price,
                            date: dateToString(args.eventInput.date),
                            creator: '5d91b52e3ff2172bc8b9f501'
                        });

                        let createdEvent;

                        try{
                            const eventResult = await event.save();
                            createdEvent = transformEvent(eventResult);
                            const userExists = await User.findById('5d91b52e3ff2172bc8b9f501');

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