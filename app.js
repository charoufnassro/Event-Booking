const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(isAuth);

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }

    next();
})

app.use('/graphql', graphQlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}))
// mongodb+srv://${process.env.MONGO_USER}:STBuIT6yLMM03C6v@usermanager-cg1jd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority
console.log(process.env.MONGO_USER)
console.log(process.env.MONGO_PASSWORD)
console.log(process.env.MONGO_DB)
mongoose.connect(`mongodb://localhost:27017/eventbooking`, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    ()=> {
        app.listen(8000, ()=> {
            console.log('server start at http://localhost:8000 ')
        });
    }
).catch(
    err => console.log(err)
)

