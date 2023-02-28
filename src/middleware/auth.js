import jwt from "jsonwebtoken";
import { userModal } from "../db/models/userModal.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer", "").trim();
    const decodeToken = jwt.verify(token, process.env.JWTSECRET);
    const user = await userModal.findOne({
      _id: decodeToken._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    res.status(400).send({ error: "your not authenticated" });
  }
};
