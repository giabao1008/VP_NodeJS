const { Router } = require("express");
const multer = require("multer");
const checkLogin = require("../apps/middlewares/check-login");
const checkLogout = require("../apps/middlewares/check-logout");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/tmp");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  }),
});

const {
  AdminController,
  ProductController,
  ClientController,
  AjaxController,
  CommentController
} = require("../apps/controllers");
const router = Router();

router
  .route("/login")
  .get(checkLogin, AdminController.login)
  .post(checkLogin, AdminController.postLogin);

router.get("/logout", AdminController.logout);

router.use("/admin", checkLogout);
router.get("/admin/dashboard", AdminController.dashboard);
router
  .route("/admin/products/edit/:id")
  .get(ProductController.edit)
  .post(upload.single("prd_image"), ProductController.update);

router.get("/admin/products", ProductController.index);
router.get("/admin/products/delete/:id", ProductController.destroy);
router
  .route("/admin/products/add")
  .get(ProductController.add)
  .post(upload.single("prd_image"), ProductController.store);

router.get("/admin/comments", CommentController.index); 
router.get("/admin/comments/delete/:id", CommentController.destroy);

router.get("/", ClientController.home);
router.get("/product-detail-:id", ClientController.productDetail);
router.post("/product-detail-:id/comments", ClientController.addComment);
router.get("/category-:id", ClientController.category);

router.post("/ajax/get-comment-product", AjaxController.getComemntForProduct);
router.post("/ajax/admin-get-comments", AjaxController.adminGetComments);
module.exports = router;
