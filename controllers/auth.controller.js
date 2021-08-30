const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { generateJWT } = require("../helpers/jwt");

//res = response to get the intellisense
const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //Check if the email exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "The email already exists" });
    }
    user = new User(req.body);

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Save the user
    await user.save();

    //Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({ uid: user.id, name: user.name, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "An error ocurred when registering the user." });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    //Confirm passwords
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    //Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.json({ uid: user.id, name: user.name, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error ocurred when login",
    });
  }
};

const renewToken = async (req, res) => {
  const { uid, name } = req;

  const token = await generateJWT(uid, name);

  res.json({ ok: "true", msg: "renew", token });
};

module.exports = {
  createUser,
  userLogin,
  renewToken,
};
