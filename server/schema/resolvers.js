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
    
}