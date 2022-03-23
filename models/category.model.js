const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    no: {
      type: Number,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Category = mongoose.model("category", CategorySchema);
