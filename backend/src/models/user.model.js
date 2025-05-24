import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true
    },
    picture: String,
    provider: String,
    sub: {
        type: String,
        unique: true
    },
    EthWalletId: { type: mongoose.Schema.Types.ObjectId, ref: 'EthWallet' },
});


export const User = mongoose.model("User", userSchema);

