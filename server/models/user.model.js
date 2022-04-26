import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, 
{versionKey: false}
);

export default mongoose.model("user", userSchema)