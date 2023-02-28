import { Router } from "express";
import { blogModal } from "../db/models/blogsModal.js";
import { auth } from "../middleware/auth.js";
import { multerUpload } from "../middleware/multer.js";
import { setFiles } from "../middleware/cloudnary.js";

export const blogRouter = Router();

blogRouter
  .route("/blogs")
  .post(
    auth,
    multerUpload.single("imgUrl"),
    setFiles,
    async (req, res) => {
      const { title, description, link } = req.body;
      const imgUrl = req.imgURI;
      try {
        const data = { imgUrl, title, description, link };
        const blog = new blogModal(data);

        await blog.save();

        res.status(201).send({ blog });
      } catch (err) {
        res.status(400).send(err);
      }
    },
    (error, req, res, next) => {
      res.status(400).send({ error: error.message });
    }
  )
  .get(auth, async (req, res) => {
    const { limit } = req.query;

    try {
      const blogs = await blogModal.find({}).limit(limit).exec();

      if (!blogs) {
        return res.status(404).send({ error: "no blogs found" });
      }

      res.send({ blogs });
    } catch (err) {
      res.status(500).send(err);
    }
  });

blogRouter
  .route("/blogs/:id")
  .get(auth, async (req, res) => {
    const { id } = req.params;

    try {
      const blog = await blogModal.findById(id);

      if (!blog) {
        return res.status(404).send({ error: "no blog found" });
      }

      res.send({ blog });
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(auth, async (req, res) => {
    const _id = req.params.id;
    const data = req.body;

    const updates = Object.keys(data);
    const allowedUpdates = ["title", "description", "link"];

    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({ error: "not a valid update opreration" });
    }

    try {
      const blogtoUpdate = await blogModal.findOne({ _id });

      if (!blogtoUpdate) {
        return res.sendStatus(404);
      }

      updates.forEach((update) => {
        blogtoUpdate[update] = data[update];
      });

      await blogtoUpdate.save();

      res.status(200).send(blogtoUpdate);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(auth, async (req, res) => {
    const _id = req.params.id;

    try {
      const delBlog = await blogModal.findByIdAndDelete(_id, {
        new: true,
      });

      if (!delBlog) {
        return res.status(400).send({ error: "no blog found to delete" });
      }

      res.send(delBlog);
    } catch (err) {
      res.status(500).send(err);
    }
  });

blogRouter.patch(
  "/blogs/img/:id",
  auth,
  multerUpload.single("imgUrl"),
  setFiles,
  async (req, res) => {
    const _id = req.params.id;
    const imgUrl = req.imgURI;

    try {
      const blogImgUpdate = await blogModal.findOneAndUpdate(
        { _id },
        { imgUrl },
        {
          runValidators: true,
          new: true,
        }
      );

      if (!blogImgUpdate) {
        return res.status(404).send({ error: "No image found to delete" });
      }

      res.send(blogImgUpdate);
    } catch (err) {
      res.status(400).send(err);
    }
  },(error,req,res,next)=>{
    res.status(400).send({error:error.message})
  }
);
