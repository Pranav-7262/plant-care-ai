import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
//here we implement the register and login functionality
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email }); //here we check if the user already exists

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
      //this is for sending response to the client
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
  //it is for login user
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  //this is for getting user profile means user data
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
