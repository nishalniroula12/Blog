import mongoose from 'mongoose'

const likemodels  = new mongoose.Schema({
    User:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    Blog:{
        type:mongoose.Schema.ObjectId,
        ref:"Blog"

    }

},{timestamps:true})

likemodels.index({User:1,Blog:1},{unique:true})

const Likemodel = mongoose.model("likemodel",likemodels)
export default Likemodel