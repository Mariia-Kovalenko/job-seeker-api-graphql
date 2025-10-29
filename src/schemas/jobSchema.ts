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
    postedBy: User!
  }
  
  type JobConnection {
    edges: [JobEdge]!
    pageInfo: PageInfo!
  }

  type JobEdge {
    cursor: String!
    node: Job!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type Query {
    jobs(first: Int, after: String): JobConnection
    job(_id: ID!): Job
  }

  type Mutation {
    addJob(title: String!, shortDescription: String, description: String!, company: String!, location: String, salaryRange: String, stack: [String]): Job
    updateJob(_id: ID!, title: String, shortDescription: String, description: String, company: String, location: String, salaryRange: String, stack: [String]): Job
    deleteJob(id: ID!): Job
  }
`;
