const User = require("../models/userModel");

const getUserById = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
}

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.status(200).json(user);
    }
    catch (error) {
      res.status(400).json("Error: " + error);
    }
}

const createUser = async (req, res) => {
  try {
    const { name, email, firebaseId } = req.body;
    const newUser = new User({ name, email, firebaseId, account: [] });
    await newUser.save();
    res.status(200).json("User created");
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
}

const getUsersByGroupId = async (req, res) => {
  try {
    const { id } = req.body;
    const group = await Group.findById(id);
    const users = await User.find({ _id: { $in: group.members } });
    res.status(200).json(users);
  }
    catch (error) {
        res.status(400).json("Error: " + error);
    }
}

// const userSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true
//     },
//     firebaseId: {
//       type: String,
//       required: [true, "Firebase ID is required"],
//       unique: true
//     },
//     groups: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "Group",
//     },
//     account:{
//       type: [{
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         amount: {
//           type: Number,
//         }
//       }]
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

const getUsers = async (req, res) => {
  try {
    const { firebaseId } = req.body;

    // Find the current user by firebaseId
    const currentUser = await User.findOne({ firebaseId });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve users in the account of the current user
    const users = await User.find({ 
      _id: { $in: currentUser.account.map((a) => a.userId) } 
    });

    // Map the users to only include the required fields
    const userList = users.map((user) => ({
      name: user.name,
      email: user.email,
      amount: currentUser.account.find((a) => a.userId.toString() === user._id.toString()).amount || 0,
    }));

    return res.status(200).json(userList);
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
};

module.exports = { getUserById, getUserByEmail, createUser, getUsersByGroupId, getUsers };