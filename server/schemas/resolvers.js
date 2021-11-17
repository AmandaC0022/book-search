const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express'); 
const { signToken } = require('../utils/auth'); 

const resolvers = {
  Query: {
    //find 1 user by ID
    me: async (parent, args, context) => {
      if(context.user) {
      const data = await User.findOne({ _id: context.user._id });
      return data; 
    }
    throw new AuthenticationError('Not logged in'); 
    }
  },

  Mutation: {
    //create a new User
    addUser: async (parent, args) => {
      const token = signToken(user);  
      const user = User.create(args);

      return { token, user }; 
    },

    login: async (parent, { email, password }) => {
      //find user by email 
      const user = await User.findOne({ email });
      //if no user, throw error 
      if (!user) {
        throw new AuthenticationError('No user was found!');
      }
      //check for password
      const correctPw = await user.isCorrectPassword(password);
      //if no match, throw error 
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }
      //create token for logged in user 
      const token = signToken(user);
      return { token, user };
    },

    //Save a new book under User 
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          {_id: context.user._id}, 
          { $push: {savedBooks: bookData} }, 
          { new: true }
        ); 
        return updatedUser; 
      }
      throw new AuthenticationError('You are not logged in.')
    },

    //Delete a book by Book Id
    removeBook: async (parent, { bookId }, context) => {
      if(context.user) {
        const updatedUser = await User.findOneAndUpdate(
          {_id: context.user._id}, 
          { $push: {savedBooks: {bookId} } }, 
          { new: true }
        ); 
        return updatedUser; 
      }
      throw new AuthenticationError('You are not logged in.')
    }
  }
};

module.exports = resolvers;
