import { jobTypeDef } from './jobSchema';
import { jobResolver } from '../resolvers/jobResolver';

export const typeDefs = [jobTypeDef].join('\n');
export const resolvers = [jobResolver].reduce((acc, r) => {
  // Combine resolvers for scaling up
  return { 
    Query: { ...acc.Query, ...r.Query },
    Mutation: { ...acc.Mutation, ...r.Mutation }
  };
}, { Query: {}, Mutation: {} });