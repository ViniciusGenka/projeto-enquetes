const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokensList = [];

const user_login_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.json({ message: "Incorrect email" });
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      //JWT Authentication
      const userPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = generateAccessToken(userPayload);
      const refreshToken = jwt.sign(
        userPayload,
        process.env.REFRESH_TOKEN_SECRET
      );
      refreshTokensList.push(refreshToken);

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const user_logout_get = (req, res) => {
  refreshTokensList = refreshTokensList.filter(
    (refreshtoken) => refreshtoken !== req.cookies.refreshToken
  );
  res.clearCookie("accessToken", { httpOnly: true });
  res.clearCookie("refreshToken", { httpOnly: true });
  res.json({ message: "You are logged out" });
};

const refresh_access_token = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken == null)
    return res.json({ message: "Refresh token is required" });
  if (!refreshTokensList.includes(refreshToken))
    return res.json({ message: "Invalid refresh token" });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.json({ message: "Invalid refresh token" });
    const newAccessToken = generateAccessToken({
      id: payload.id,
      name: payload.name,
      email: payload.email,
    });
    console.log("modifiquei para" + newAccessToken);
    //adicionei isso aqui
    res.header("Authorization", "Bearer " + newAccessToken);
    res.json({ accessToken: newAccessToken });
  });
};

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5s",
  });
}

module.exports = {
  user_login_post,
  user_logout_get,
  refresh_access_token,
};
