export const userTypeDef = `
  type User {
    _id: ID!
    email: String!
    password: String!
    token: String
    companyName: String!
  }

  type AuthPayload {
    email: String!
    companyName: String!
    jwt_token: String!
  }

  type Query {
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    createUser(email: String!, password: String!, companyName: String!): AuthPayload
    googleLogin(token: String!): AuthPayload
    googleRegister(email: String!, companyName: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;