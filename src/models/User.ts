import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    companyName: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;