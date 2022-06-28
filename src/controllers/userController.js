const User = require("../models/user");
const bcrypt = require("bcrypt");

const user_create_post = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    const newUser = await user.save();
    res.json(newUser);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const user_list = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const user_detail = async (req, res) => {
  res.json(res.locals.user);
};

const user_update_patch = async (req, res) => {
  if (req.body.name != null) {
    res.locals.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.locals.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.locals.user.password = req.body;
  }

  try {
    const updatedUser = await res.locals.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const user_delete_get = async (req, res) => {
  try {
    await res.locals.user.remove();
    res.json({
      message: `${res.locals.user.name} has been deleted successfully.`,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getUserById = async (req, res, next) => {
  let user;

  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.json({ message: "User not found" });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }

  res.locals.user = user;

  next();
};

module.exports = {
  user_create_post,
  user_list,
  user_detail,
  user_update_patch,
  user_delete_get,
  getUserById,
};
