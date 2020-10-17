const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@booking.5o5i0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    //const host = '0.0.0.0';
    const port = process.env.PORT || 3000;
    app.listen(port, function() {
      console.log("Server started.......");
    });
    /*app.listen(port, host, function() {
      console.log("Server started.......");
    });*/
    //app.listen(8000);
  })
  .catch(err => {
    console.log("Error nuevo: "+err);
    console.log(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@booking.5o5i0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`);
  });
