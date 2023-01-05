const { AuthErr } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({})
            .select('-__v -password')
            .populate('books');
            return userData;
        }
        throw new AuthErr('You are not logged in');
    },
},



module.exports = resolvers;