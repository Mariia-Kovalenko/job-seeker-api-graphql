import { jobTypeDef } from './jobSchema';
import { jobResolver } from '../resolvers/jobResolver';
import { userTypeDef } from './userSchema';
import { userResolver } from '../resolvers/userResolver';

export const typeDefs = [jobTypeDef, userTypeDef].join('\n');
export const resolvers = [jobResolver, userResolver].reduce((acc, r) => {
  // Combine resolvers for scaling up
  return { 
    Query: { ...acc.Query, ...r.Query },
    Mutation: { ...acc.Mutation, ...r.Mutation }
  };
}, { Query: {}, Mutation: {} });