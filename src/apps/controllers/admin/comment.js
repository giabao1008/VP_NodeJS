const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const joi = require("@hapi/joi");

const Product = mongoose.model("Product");
const Comment = mongoose.model("Comment");

module.exports.index = async function (req, res) {
    const { id } = req.body;

    const page = parseInt(req.body.page || 1);
    const limit = 2;
  
    const skip = (page - 1) * limit;
  
    const totalDocuments = await Comment.find().countDocuments();
  
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
  
    const comments = await Comment.find()
      .populate("prd_id")
      .limit(limit)
      .skip(skip);
      res.render("admin/pages/comments/index", {
        comments,
        range: rangerForDot,
        page,
        totalPages,
      });
};
module.exports.destroy = async function (req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect("/admin/comments");
  }
  const comment = await Comment.findByIdAndDelete(id);

  return res.redirect("/admin/comments");
};