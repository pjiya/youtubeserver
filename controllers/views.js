import mongoose from "mongoose";
import videoFiles from "../models/videoFiles.js";
import User from "../models/auth.js"; // Import the User model

export const viewController = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Video Unavailable.");
  }

  try {
    const file = await videoFiles.findById(_id);
    if (!file) {
      return res.status(404).send("Video not found.");
    }

    const views = file.Views || 0; // Ensure views is a number

    const updatedFile = await videoFiles.findByIdAndUpdate(
      _id,
      { $set: { Views: views + 1 } },
      { new: true }
    );

    const userId = req.userId; // Use req.userId from the auth middleware
    const user = await User.findById(userId);

    if (user) {
      user.points += 5; // Increment points
      await user.save();
    }

    res.status(200).json(updatedFile);
  } catch (error) {
    res.status(400).json({ message: "Error updating views or points.", error });
  }
};



// import videoFiles from "../models/videoFiles.js";
// import mongoose from "mongoose";

// export const viewController = async (req, res) => {
//   const { id: _id } = req.params;
//   // console.log(_id)

//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).send("Video Unavailable..");
//   }

//   try {
//     const file = await videoFiles.findById(_id);
//     const views = file.Views;

//     const updateview = await videoFiles.findByIdAndUpdate(_id, {
//       $set: { Views: views + 1 },
//     });

//     const userId = req.user.id; // Assuming you have user ID in req.user.id
    
//     res.status(200).json(updateview);
//   } catch (error) {
//     res.status(400).json({ message: "Error updating views or points.", error });
//   }
// };

// // it was "res.status(400).json("error : ", error);" in 32 line