import mongoose from "mongoose";

const blogpost =new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String

    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category"
    },
    image:{
        type:String
    }

},{timestamps:true})

const Blog =mongoose.model("Blog",blogpost)
export default Blog