const express = require('express');
const path = require('path');
const db = require('./config/connection');

//Don't need express routes, we will be replacing with React Router
// const routes = require('./routes');

const { ApolloServer } = require('apollo-server-express'); 
const { typeDefs, resolvers } = require('./schemas');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
}); 

const PORT = process.env.PORT || 3001;

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
