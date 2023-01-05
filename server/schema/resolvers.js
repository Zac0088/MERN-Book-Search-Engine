const { AuthErr } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return await User.find().populate('ssavedBooks');
        },
        me: async (parent, args, context) => {
            const foundUser = await User.findOne({ _id: context.user._id }).populate('savedBooks');
            if (!foundUser) {
                throw new AuthErr('No user with this ID');
            }
            return foundUser;
        },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                throw new AuthErr('Whoops!! somthing went wrong!');
            }
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthErr('No user with this email found');
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthErr('Incorrect Credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: {
                            savedBooks: { ...book },
                        },
                    },
                    {
                        new: true,
                    },
                );
            }
            throw new AuthErr('You must be logged in to do that');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $pull: {
                            savedBooks: {
                                bookId,
                            },
                        },
                    },
                    {
                        new: true,
                    },
                );
            }
            throw new AuthErr('You must be Logged in to do that');

        },
    },

};
module.exports = resolvers;