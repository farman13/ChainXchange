import { Router } from "express";
import { signupUser, getUserWallet, getUserBalance } from "../controllers/user.controller.js";
import { jwtCheck } from "../middlewares/auth.middlware.js";

const userRouter = Router();

userRouter.route("/signup").post(jwtCheck, signupUser);
userRouter.route("/getwallet").post(jwtCheck, getUserWallet);
userRouter.route("/balance").get(jwtCheck, getUserBalance);


export { userRouter };