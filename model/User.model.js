import mongoose  from "mongoose";

const userSchema = mongoose.Schema( {
    username: {
        type : String,
        require: true,
    },
    email: {
        type : String,
        require: true,
        unique: true,
    },
    password: {
        type : String,
        require: true,
    },
    role: {
        type: String,
        enum : ['user','admin'],
        default: 'user',
    },
});

const User = mongoose.model('User', userSchema);

export default User;