import { Router } from "express";
import { getQuote } from "../controllers/token.controller.js";

const tokenRouter = Router();

tokenRouter.route("/quote").get(getQuote);



export { tokenRouter };