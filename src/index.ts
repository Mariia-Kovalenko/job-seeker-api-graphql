import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { connectDB } from './db/connection';
const cors = require('cors');
import { typeDefs, resolvers } from './schemas'; 
import authenticate from './middlewares/authenticate';


async function startServer() {
  await connectDB(); // Ensure DB connection before starting server
  const app = express();
  app.use(cors());
  app.use(authenticate);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  app.use('/', graphqlHTTP((req: any) => {
    console.log('User in context:', req.user);
    return { 
      schema, 
      rootValue: resolvers, 
      graphiql: true ,
      context: {
        user: req?.user
      }
    }
  }));
  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    console.log(`🚀 Express GraphQL server running at http://localhost:${PORT}`);
  });
}

startServer();