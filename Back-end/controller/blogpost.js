import Blog from "../model/blogpost.js";
import Likemodel from "../model/LikeModel.js";

export const blogcreate = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    console.log("CATEGORY:", category);
    console.log(req.body)
    const blog = await Blog.create({
      title,
      description,
      category,
      image: req.file.filename,
      
    });
    const populatedBlog = await Blog.findById(blog._id).populate("category");
    res.status(201).json({
      success: true,
      message: "blog is create",
      blog: populatedBlog,
      

    });
  } catch (error) {
    console.log(error);
  }
};

// getdata
export const bloggetdata = async (req, res) => {
  try {
    
 
        const blogs = await Blog.find().populate("category");
    
        const blogwithlikecount = await Promise.all(
          blogs.map(async (blog) => {
            const likecount = await Likemodel.countDocuments({
              Blog: blog._id,
            });
    
            return {
              ...blog.toObject(),
              likecount,
            };
          })
        );
        console.log(blogwithlikecount)
    
        res.status(200).json({
          success: true,
          message: "data is get",
          blog: blogwithlikecount,
        });
      } catch (error) {
        console.log(error);
      }
    };



//blog get by id

export const getblogbyid = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const blog = await Blog.findById(id).populate("category");
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
  }
};
//blogupdate
export const blogupdate = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const { id } = req.params;
    console.log(id);
    const blog = await Blog.findByIdAndUpdate(req.params.id, { new: true });
    if (!blog)
      return res.status(200).json({
        success: true,
        message: "blog data is updated",
      });
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    if (req.file) blog.image = req.file.filename;
    const blogupdate = await blog.save();
    res.json(blogupdate);
  } catch (error) {
    console.log(error);
  }
};

//delete

export const deleted =async(req,res)=>{
    try {
        const{id} =req.params;
        const blog=await Blog.findByIdAndDelete(id)
        res.status(200).json({
            message:"blog data delete successfully",
            blog
        })
        
    } catch (error) {
        console.log(error)
        
    }

}

export const like =async(req,res)=>
{
  const {id} =req.params
  console.log(id)
    const userid =req.user._id

  try {
    const blog =await Blog.findById(id)
    if(!blog){
      return res.status(404).json({
        message:"blog not found"
      })
    }
    const existinglike =await Likemodel.findOne({User:userid, Blog:id})
    if(existinglike){
      await Likemodel.deleteOne({User:userid,Blog:id})
      const newlikecount =await Likemodel.countDocuments({Blog:id})
      console.log(newlikecount)

      return res.status(200).json({
        message:"Blog unliked",
        liked:false,
        likecount:newlikecount
      })
    }
    const newlike =new Likemodel({
      User:userid,
      Blog:id
    })
    await newlike.save()

    const newlikecount =await Likemodel.countDocuments({Blog:id})
    // console.log(newlikecount)
    return res.status(200).json({
      message:"blog like successfully",
      like:true,
      likecount:newlikecount

    })

    

    
  } catch (error) {
    console.log(error)
    
  }

}

export const getlikeblog =async(req,res)=>
{
  try {
    
    const userid=req.user.id
    console.log("REQ USER:", req.user);
    const likeblogs =await Likemodel.find({User:userid}).populate({
      path:"Blog",
      populate:[
        {path:"category" ,select:"name"},
      ]
    })
    if(!likeblogs.length){

      return res.status(200).json({
        likeblogs:[]
      })

      
    }
    const blogwithlikecount =await Promise.all(likeblogs.map(async(like)=>{
      if(!like.Blog)return null;

      const countlike =await Likemodel.countDocuments({Blog:like.Blog._id})
      return{
        ...like.Blog.toObject(),
        countlike,
        
        islikedByUser:true,
    }

    }))
    const validblogs =blogwithlikecount.filter((blog)=> blog !==null)
    res.status(200).json({likeblogs:validblogs})

  } catch (error) {
    console.log(error)
    
  }
}

export const unlike =async(req,res)=>{
  try {
    const {id}=req.params
    const userid =req.user._id
    const blog =await Blog.findById(id)

    if(!blog){
      return res.status(404).json({
        message:"blog not found"
      })
    }
    
    const existinglike =await Likemodel.findOne({User:userid, Blog:id})
    if(!existinglike){
      return res.status(400).json({
        message:"you have not like blog yet"
      })
    }
    await Likemodel.deleteOne({User:userid ,Blog:id})

    const newlikecount =await Likemodel.countDocuments({Blog:id})
    res.status(200).json({
      message:"blog like successfull",
      liked:false,
      likecount:newlikecount
    
    }
    )
  } catch (error) {
    console.log(error)
    
  }
}