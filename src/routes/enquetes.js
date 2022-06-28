const express = require("express");
const enquete_controller = require("../controllers/enqueteController");
const router = express.Router();

//Create One Enquete
router.post(
  "/create",
  enquete_controller.authenticateToken,
  enquete_controller.enquete_create_post
);

//Update One Enquete
router.put(
  "/:id",
  enquete_controller.getEnqueteById,
  enquete_controller.enquete_update
);

//Delete One Enquete
router.delete(
  "/:id",
  enquete_controller.authenticateToken,
  enquete_controller.getEnqueteById,
  enquete_controller.enquete_delete_get
);

//View All Enquetes
router.get("/", enquete_controller.enquete_list);

//View One Enquete
router.get(
  "/:id",
  enquete_controller.getEnqueteById,
  enquete_controller.enquete_detail
);

module.exports = router;
