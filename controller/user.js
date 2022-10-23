import { creatError } from "../error.js";
import User from "../models/Users.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(creatError(403, "You can update only your account!"));
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (error) {
      next(error);
    }
  } else {
    return next(creatError(403, "You can delete only your account!"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subsciptoin success");
  } catch (error) {
    next(error);
  }
};
// export const subscribe = async (req, res, next) => {
//   try {
//     await User.findByIdAndUpdate(req.user.id, {
//       $push: { subscribedUsers: req.params.id },
//     });
//     await User.findByIdAndUpdate(req.params.id, {
//       $inc: { subscribers: 1 },
//     });
//     res.status(200).json("Subscription successfull.")
//   } catch (err) {
//     next(err);
//   }
// };
export const unSubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.pramas.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unsubsciptoin success");
  } catch (error) {
    next(error);
  }
};
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislike: id },
    });
    res.status(200).json("The video has been liked");
  } catch (error) {
    next(error);
  }
};
export const disLike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislike: id },
      $pull: { like: id },
    });
    res.status(200).json("The video has been disliked");
  } catch (error) {
    next(error);
  }
};
