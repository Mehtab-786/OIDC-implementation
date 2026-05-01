import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required:true,
        // unique:true
    },
    password: {
        type: String,
        required:true,
    },
}, {
    timestamps: true
});


const authModel = mongoose.model("Auth", authSchema);
export default authModel;
