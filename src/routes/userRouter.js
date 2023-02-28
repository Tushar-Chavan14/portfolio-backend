import { Router } from "express";
import { userModal } from "../db/models/userModal.js";
import { auth } from "../middleware/auth.js";
export const userRouter = Router();

userRouter.post("/user/register", async (req, res) => {
  const user = new userModal(req.body);
  try {
    await user.save();
    const token = await user.genrateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModal.findByCredential(email, password);
    const token = await user.genrateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

userRouter.post("/user/logout", auth, async (req, res) => {
  const user = req.user;

  try {
    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();

    res.send({ sucess: "logged out sucessfull" });
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.post("/user/logoutall", auth, async (req, res) => {
  const user = req.user;

  try {
    user.tokens = [];
    await user.save();

    res.send({ sucess: "logged out of all sessions sucessfull" });
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter
  .route("/user/me")
  .get(auth, (req, res) => {
    res.send(req.user);
  })
  .delete(auth, async (req, res) => {
    const user = req.user;

    try {
      const delUser = await user.remove();
      res.send(delUser);
    } catch (err) {
      res.status(500).send(err);
    }
  });
