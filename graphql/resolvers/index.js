const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');


const events = async eventIds => {
    try{
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(
                    event => {
                        return{ 
                            ...event._doc,
                            _id: event.id,
                            creator: user.bind(this, event.creator)
                        }
                    }
                )
    }catch(err){
        throw err
    }
    
}

const user = async userId => {
    try{
        const user = await User.findById(userId)
        return { 
            ...user._doc,
            _id: user.id,
            password: null,
            createdEvents: events.bind(this, user._doc.createEvents)
        };
    }catch(err){
        throw err
    }
}

module.exports = {
                    events: async () => {
                        try{
                            const events = await Event.find();
                            return events.map(event =>{
                                return { 
                                    ...event._doc,
                                    _id: event.id,
                                    date: new Date(event.date).toISOString(),
                                    creator: user.bind(this, event._doc.creator)
                                };
                            });
                        }catch(err){
                            throw err
                        }
                    },
                    createEvent: args => {
                        const event = new Event({
                            title: args.eventInput.title,
                            description: args.eventInput.description,
                            price: +args.eventInput.price,
                            date: new Date(args.eventInput.date).toISOString(),
                            creator: '5d9076066847e1265ced7a70'
                        });
                        let createdEvent;
                        return event.save()
                                .then( resultEevent => {
                                    console.log(resultEevent)
                                    createdEvent = { 
                                        ...resultEevent._doc,
                                        _id: resultEevent.id.toString(),
                                        date: new Date(args.eventInput.date).toISOString(),
                                        creator: user.bind(this, resultEevent.creator) 
                                    }
                                    return User.findById('5d9076066847e1265ced7a70');
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