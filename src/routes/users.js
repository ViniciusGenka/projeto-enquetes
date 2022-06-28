const express = require("express");
const user_controller = require("../controllers/userController");
const router = express.Router();

//Create One User
router.post("/signup", user_controller.user_create_post);

//Update One User
router.put(
  "/:id",
  user_controller.getUserById,
  user_controller.user_update_patch
);

//Delete One User
router.delete(
  "/:id",
  user_controller.getUserById,
  user_controller.user_delete_get
);

//View All Users
router.get("/", user_controller.user_list);

//View One User
router.get("/:id", user_controller.getUserById, user_controller.user_detail);

module.exports = router;
