import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String
    totalCopies: Int!
    availableCopies: Int!
  }

  type Borrow {
    id: ID!
    userId: ID!
    bookId: ID!
    borrowDate: String!
    returnDate: String
    status: String!
    book: Book!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    myBorrows: [Borrow!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, isbn: String, totalCopies: Int!): Book!
    borrowBook(bookId: ID!): Borrow!
    returnBook(borrowId: ID!): Borrow!
  }
`;

export default typeDefs;