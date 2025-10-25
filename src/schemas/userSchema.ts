export const userTypeDef = `
  type User {
    _id: ID!
    email: String!
    password: String!
    token: String
  }

  type AuthPayload {
    email: String!
    jwt_token: String!
}

  type Query {
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    createUser(email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
  }
`;