import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID "],
    },
    name: {
        type: String,
        required: [true, "Please enter Name "],
    },
    email: {
        type: String,
        unique: [true, "Email already Exists"],
        required: [true, "Please enter Email"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"],
    },
    role: {
        type: String,
        enumn: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enumn: ["male", "female", "others"],
        required: [true, "Please enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of birth"],
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDay() < dob.getDay())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
