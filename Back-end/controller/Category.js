import Categorys from "../model/category.js";

//create category
export const createcatgory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Categorys.findOne({ name });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new Categorys({
      name,
      description,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//get data 
export const getalldata=async(req,res)=>{
    try {
        const category =await Categorys.find()
        res.status(200).json({
            sucess:true,
            message:"get data of category",
            category
            
        })
        
    } catch (error) {
        console.log(error)
        
    }
}

//get single data by id

export const getdatabyid= async (req,res)=>{
    try {
        const{id} = req.params;
        console.log(id);
        const category= await Categorys.findById(id);
        res.status(200).json({
            success:true,
            category
            
        })
        
    } catch (error) {

    console.log(error)
        
    }

}

export const updatecategory =async (req,res)=>{
    try {
        const {id} =req.params
        const category =await Categorys.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json({
            success:true,
            message:"data is updated",
            category
,
        })
        
    } catch (error) {
        console.log(error)
        
    }
}
export const deletecategory=async (req,res)=>{
    try {
        const {id} =req.params;
        const category =await Categorys.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:"data is deleted",
            category
        })
        
    } catch (error) {
        console.log(error)
        
    }
}