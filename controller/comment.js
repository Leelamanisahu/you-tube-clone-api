import { creatError } from "../error.js";
import Comments from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comments({ ...req.body, userId: req.user.id });

  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (error) {
    next(error);
  }
};
export const deletComment = async (req, res, next) => {
  try {
    const comment = await Comments.findById(res.params.id);
    const video = await Video.findById(res.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comments.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted");
    } else {
      return next(creatError(403, "You can't delete this comment"));
    }
  } catch (error) {}
};
export const getComment = async (req, res, next) => {
  try {
    const comments = await Comments.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (error) {}
};
