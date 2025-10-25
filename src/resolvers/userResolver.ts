import UserModel from "../models/User";
import { validateRegisterInput } from "../config/userValidation";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

type User = {
    _id: string;
    email: string;
    password: string;
};

export const userResolver = {
    Query: {
        users: async () => UserModel.find(),
        user: async (_: any, { _id }: { _id: string }) =>
            UserModel.findById(_id),
    },
    Mutation: {
        createUser: async (_: any, { email, password }: User) => {
            const { valid, errors } = validateRegisterInput(email, password);

            const userExists = await UserModel.findOne({email: email});
            if (userExists) {
                throw new Error('User with such email already exists!');
            }

            if (!valid) {
                throw new Error(errors.join(", "));
            }

            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({ email, password: hashedPass });
            return newUser;
        },
        login: async (_: any, { email, password }: User) => {
            const user = await UserModel.findOne({email: email});
            if (!user) {
                throw new Error('User not found!');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid password!');
            }

            // create and assign token
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(user._id, {token: token});
                if (!updatedUser) {
                    throw new Error('User not found!');
                }
            } catch (error) {
                throw new Error((error as Error).message);
            }
            return { jwt_token: token, email: user.email };
        }
    },
};
