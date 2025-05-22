import { Router } from "express";
import { signupUser, getUserWallet, getUserBalance, swapTokens, withdrawAsset, sendAsset } from "../controllers/user.controller.js";
import { jwtCheck } from "../middlewares/auth.middlware.js";

const userRouter = Router();

userRouter.route("/signup").post(jwtCheck, signupUser);
userRouter.route("/getwallet").post(jwtCheck, getUserWallet);
userRouter.route("/balance").get(jwtCheck, getUserBalance);
userRouter.route("/swap").post(jwtCheck, swapTokens);
userRouter.route("/withdraw").post(jwtCheck, withdrawAsset);
userRouter.route("/send").post(jwtCheck, sendAsset);



export { userRouter };