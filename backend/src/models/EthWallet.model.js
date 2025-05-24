import mongoose from "mongoose";
import { Schema } from "mongoose";

const EthWalletSchema = new Schema({
    publicKey: String,
    privateKey: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    iv: { type: String, required: true }
});

export const EthWallet = mongoose.model('EthWallet', EthWalletSchema);