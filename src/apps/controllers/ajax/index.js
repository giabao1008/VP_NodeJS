const mongoose = require("mongoose");
const CommentModel = mongoose.model("Comment");
const ejs = require("ejs");
const path = require("path");

exports.getComemntForProduct = async (req, res) => {
  const { id } = req.body;

  const page = parseInt(req.body.page || 1);
  const limit = 1;

  const skip = (page - 1) * limit;

  const totalDocuments = await CommentModel.find({
    prd_id: id,
  }).countDocuments();

  const totalPages = Math.ceil(totalDocuments / limit);
  const range = [];
  const rangerForDot = [];
  const detal = 1;

  const left = page - detal;
  const right = page + detal;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  let temp;
  range.map((i) => {
    if (temp) {
      if (i - temp === 2) {
        rangerForDot.push(i - 1);
      } else if (i - temp !== 1) {
        rangerForDot.push("...");
      }
    }
    temp = i;
    rangerForDot.push(i);
  });

  const comments = await CommentModel.find({ prd_id: id })
    .limit(limit)
    .skip(skip);

  const viewPath = req.app.get("views");

  const html = await ejs.renderFile(
    path.join(viewPath, "site/components/comment-product.ejs"),
    { comments, total: totalDocuments, range: rangerForDot, page, totalPages }
  );

  res.json({
    status: "success",
    data: {
      html: html,
    },
  });
};


exports.adminGetComments = async (req, res) => {
  const page = parseInt(req.body.page || 1);
  const limit = 2;

  const skip = (page - 1) * limit;

  const totalDocuments = await CommentModel.find().countDocuments();

  const totalPages = Math.ceil(totalDocuments / limit);
  const range = [];
  const rangerForDot = [];
  const detal = 1;

  const left = page - detal;
  const right = page + detal;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  let temp;
  range.map((i) => {
    if (temp) {
      if (i - temp === 2) {
        rangerForDot.push(i - 1);
      } else if (i - temp !== 1) {
        rangerForDot.push("...");
      }
    }
    temp = i;
    rangerForDot.push(i);
  });

  const comments = await CommentModel.find()
    .limit(limit)
    .skip(skip);

  const viewPath = req.app.get("views");

  const html = await ejs.renderFile(
    path.join(viewPath, "admin/components/comment-mng.ejs"),
    { comments, total: totalDocuments, range: rangerForDot, page, totalPages }
  );

  res.json({
    status: "success",
    data: {
      html: html,
    },
  });
};
