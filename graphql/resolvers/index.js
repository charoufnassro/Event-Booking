const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');


module.exports = {
                    events: ()=>{
                        return Event.find()
                            .populate('creator')
                                .then(events => {
                                    return events.map(event =>{
                                        return { 
                                            ...event._doc,
                                            _id: event.id,
                                            date: new Date(event.date).toISOString()
                                        };
                                    });
                                })
                                    .catch(err => {
                                        throw err;
                                    });
                    },
                    createEvent: args => {
                        const event = new Event({
                            title: args.eventInput.title,
                            description: args.eventInput.description,
                            price: +args.eventInput.price,
                            date: new Date(args.eventInput.date),
                            creator: '5d8f249d50d3561eac9ed8d6'
                        });
                        let createdEvent;
                        return event.save()
                                .then( resultEevent => {
                                    console.log(resultEevent)
                                    createdEvent = { ...resultEevent._doc, _id: resultEevent.id.toString()}
                                    return User.findById('5d8f249d50d3561eac9ed8d6');
                                })
                                    .then( user => {
                                        if(!user) {
                                            throw new Error('User not found.')
                                        }
                                        user.createEvents.push(event);
                                        return user.save();
                                    })
                                    .then( resultUser => {
                                            console.log(resultUser);
                                            return createdEvent;
                                    })
                                    .catch( err => {
                                        console.log(err);
                                        throw err;
                                    });
                    },
                    createUser: args => {
                        return  User.findOne({email: args.userInput.email})
                                    .then( user => {
                                        if (user){
                                            throw new Error('User exists already.');
                                        }
                                            return  bcrypt.hash(args.userInput.password, 12)
                                    }).then( hashedPassword =>{
                                            const user = new User({
                                                email: args.userInput.email,
                                                password: hashedPassword
                                            });
                                            return user.save();
                                        }).then( result => {
                                                console.log(result);
                                                return {...result._doc,password: null, _id: result.id };
                                            })
                                    .catch( err => {
                                        throw err
                                    })
                    }
                }