import mongoose from 'mongoose'

const connectdatabases =async()=>{
    try {
        await mongoose.connect(process.env["BACKEND_URL"]);
        console.log("database connects successfully")
        
    } catch (error) {
        console.log(error

        )

    }
}
export default connectdatabases