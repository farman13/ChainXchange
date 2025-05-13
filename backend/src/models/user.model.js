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
    InrWalletId: { type: mongoose.Schema.Types.ObjectId, ref: 'InrWallet' }
});

const EthWalletSchema = new Schema({
    publicKey: String,
    privateKey: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    iv: { type: String, required: true }
});

const inrWalletSchema = new Schema({
    balance: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
});

export const User = mongoose.model("User", userSchema);
export const EthWallet = mongoose.model('EthWallet', EthWalletSchema);
export const InrWallet = mongoose.model('InrWallet', inrWalletSchema);