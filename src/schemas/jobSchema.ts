export const jobTypeDef = `
  type Job {
    _id: ID!
    title: String!
    shortDescription: String
    description: String!
    company: String!
    location: String
    salaryRange: String
    stack: [String]
    createdAt: String
    updatedAt: String
  }
  
  type Query {
    jobs: [Job]
    job(_id: ID!): Job
  }

  type Mutation {
    addJob(title: String!, shortDescription: String, description: String!, company: String!, location: String, salaryRange: String, stack: [String]): Job
    updateJob(_id: ID!, title: String, shortDescription: String, description: String, company: String, location: String, salaryRange: String, stack: [String]): Job
    deleteJob(id: ID!): Job
  }
`;
