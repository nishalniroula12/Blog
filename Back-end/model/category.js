import mongoose from "mongoose";

const categorys = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category name is required"],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
const Categorys = mongoose.model("Category", categorys);
export default Categorys;
