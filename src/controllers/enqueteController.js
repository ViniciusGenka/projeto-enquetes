const Enquete = require("../models/enquete");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const enquete_create_post = async (req, res) => {
  const enquete = new Enquete({
    creator: res.locals.user.id,
    title: req.body.title,
    options: req.body.options,
  });

  try {
    const newEnquete = await enquete.save();
    return res.status(201).send(newEnquete);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const enquete_list = async (req, res) => {
  try {
    const enquetes = await Enquete.find();
    res.status(200).json(enquetes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enquete_detail = (req, res) => {
  res.json(res.locals.enquete);
};

const enquete_delete_get = async (req, res) => {
  if (res.locals.user.id !== res.locals.enquete.creator) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    await res.locals.enquete.remove();
    res.json({
      message: `${res.locals.enquete.title} has been deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const enquete_update = async (req, res) => {
  if (req.body.title != null) {
    res.locals.enquete.title = req.body.title;
  }
  if (req.body.options != null) {
    res.locals.enquete.options = req.body.options;
  }
  try {
    const updatedEnquete = await res.locals.enquete.save();
    res.status(201).send(updatedEnquete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function getEnqueteById(req, res, next) {
  let enquete;
  try {
    enquete = await Enquete.findById(req.params.id);
    if (enquete == null) {
      return res.status(404).json({ message: "Cannot find this enquete." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.locals.enquete = enquete;
  next();
}

async function authenticateToken(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.json({ message: "User is not logged in" });
  }
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, userPayload) => {
      if (error) {
        const response = await fetch("http://localhost:4000/auth/token", {
          method: "POST",
          headers: {
            cookie: `refreshToken=${req.cookies.refreshToken}`,
          },
        });
        const accessToken = response.headers.get("authorization").split(" ")[1];
        jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
          (error, userPayload) => {
            if (error) return res.json({ message: error.message });
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
            });
            res.locals.user = userPayload;
            next();
          }
        );
        return;
      }
      res.locals.user = userPayload;
      next();
    }
  );
}

module.exports = {
  enquete_create_post,
  enquete_list,
  enquete_detail,
  enquete_delete_get,
  enquete_update,
  getEnqueteById,
  authenticateToken,
};
