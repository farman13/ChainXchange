import { Router } from "express";
import { getQuote, requestToken } from "../controllers/token.controller.js";
import { jwtCheck } from "../middlewares/auth.middlware.js";

const tokenRouter = Router();

tokenRouter.route("/quote").get(getQuote);
tokenRouter.route("/requestToken").post(jwtCheck, requestToken);



export { tokenRouter };