import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { connectDB } from './db/connection';
const cors = require('cors');
import { typeDefs, resolvers } from './schemas'; 

async function startServer() {
  await connectDB(); // Ensure DB connection before starting server
  const app = express();
  app.use(cors());
  console.log("TypeDefs:", typeDefs);
  console.log("Resolvers:", resolvers);
   // Build schema from merged typeDefs
   const schema = makeExecutableSchema({ typeDefs, resolvers });
  app.use('/', graphqlHTTP({ schema, rootValue: resolvers, graphiql: true }));
  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`🚀 Express GraphQL server running at http://localhost:${PORT}`);
  });
}

startServer();