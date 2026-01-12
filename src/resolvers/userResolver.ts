import UserModel from "../models/User";
import { validateRegisterInput } from "../config/userValidation";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { OAuth2Client } from 'google-auth-library';

const WEB_CLIENT_ID = '374361063488-2rfluc9s9upppldosaa1130j8qjcbigq.apps.googleusercontent.com';

const client = new OAuth2Client(WEB_CLIENT_ID);

console.log('WEB_CLIENT_ID in userResolver', client);

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
        createUser: async (_: any, { email, password, companyName }: { email: string, password: string, companyName: string }) => {
            const { valid, errors } = validateRegisterInput(email, password);

            const userExists = await UserModel.findOne({ email });
            if (userExists) {
                throw new Error('User with such email already exists!');
            }

            if (!valid) {
                throw new Error(errors.join(", "));
            }

            const hashedPass = password ? await bcrypt.hash(password, 10) : null;

            const newUser = await UserModel.create({ email, password: hashedPass, companyName });

            // Create and assign token
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(newUser._id, {token: token});
                if (!updatedUser) {
                    throw new Error('User not found!');
                }
            } catch (error) {
                throw new Error((error as Error).message);
            }
            return { jwt_token: token, email: newUser.email, companyName: newUser.companyName };
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
            return { jwt_token: token, email: user.email, companyName: user.companyName };
        },

        googleLogin: async (_: any, {token }: {token: string }) => {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: WEB_CLIENT_ID,  // Use your web client ID
            });

            const payload = ticket.getPayload();
            const userEmail = payload?.email;
            if (!userEmail) {
                throw new Error('Invalid token!');
            }

            // find user in db
            const user = await UserModel.findOne({email: payload?.email});
            if (!user) {
                throw new Error('User not found!');
            }

            const jwt_token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            try {
                const updatedUser = await UserModel.findByIdAndUpdate(user._id, {token: jwt_token});
                if (!updatedUser) {
                    throw new Error('User not found!');
                }
            } catch (error) {
                throw new Error((error as Error).message);
            }
            return { email: userEmail, jwt_token, companyName: user.companyName };
        },
        googleRegister: async (_: any, {email, companyName }: {email: string, companyName: string }) => {
            // find user in db
            const user = await UserModel.findOne({email: email});
            if (user) {
                throw new Error('User already exists!');
            }
            const newUser = await UserModel.create({email: email, companyName, password: ''});
            const jwt_token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            try {
                return { email: newUser.email, jwt_token, companyName: newUser.companyName };
            } catch (error) {
                throw new Error((error as Error).message);
            }
        }
    },
};
