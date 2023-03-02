import { Router } from "express";
import { portfolioModel } from "../db/models/portfolioModal.js";
import { auth } from "../middleware/auth.js";
import { setFiles } from "../middleware/cloudnary.js";
import { multerUpload } from "../middleware/multer.js";

export const portfolioRouter = Router();

portfolioRouter
  .route("/projects")
  .post(
    auth,
    multerUpload.single("prjSrc"),
    setFiles,
    async (req, res) => {
      const { title, tech, link, description } = req.body;
      const src = req.imgURI;

      try {
        const data = { src, title, tech, link, description };

        const project = new portfolioModel(data);
        await project.save();

        res.send({ project });
      } catch (err) {
        res.status(400).send(err);
      }
    },
    (error, req, res, next) => {
      res.status(400).send(error.message);
    }
  )
  .get(auth, async (req, res) => {
    const { limit } = req.query;

    try {
      const projects = await portfolioModel.find({}).limit(limit);

      if (!projects) {
        return res.status(404).send({ error: "no porjects found" });
      }

      res.send({ projects });
    } catch (err) {
      res.status(500).send(err);
    }
  });

portfolioRouter
  .route("/projects/:id")
  .get(auth, async (req, res) => {
    const id = req.params.id;
    try {
      const blog = await portfolioModel.findById(id);

      if (!blog) {
        return res.status(404).send({ error: "blog not found" });
      }

      res.send(blog);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(auth, async (req, res) => {
    const _id = req.params.id;
    const data = req.body;

    const updates = Object.keys(data);
    const allowedUpdates = ["title", "tech", "link", "description"];

    const isValidupdates = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidupdates) {
      res.status(400).send({ error: "not A valid opraton" });
    }

    try {
      const project = await portfolioModel.findOne({ _id });

      updates.forEach((update) => {
        project[update] = data[update];
      });

      await project.save();

      res.send(project);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(auth, async (req, res) => {
    const id = req.params.id;

    try {
      const project = await portfolioModel.findByIdAndDelete(id, {
        new: true,
      });

      if (!project) {
        return res.status(404).send({ error: "no project found to delete" });
      }

      res.send(project);
    } catch (err) {
      res.status(500).send(err);
    }
  });

portfolioRouter.patch(
  "/projects/img/:id",
  auth,
  multerUpload.single("prjSrc"),
  setFiles,
  async (req, res) => {
    const _id = req.params.id;
    const src = req.imgURI;

    try {
      const project = await portfolioModel.findOneAndUpdate(
        { _id },
        { src },
        {
          runValidators: true,
          new: true,
        }
      );

      if (!project) {
        res.sendStatus(404);
      }

      res.send(project);
    } catch (err) {
      res.status(500).send();
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
