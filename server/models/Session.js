import mongoose from 'mongoose'
const sessionSchema = new mongoose.Schema({
     cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
     ]
})

const Session = mongoose.model("Session",sessionSchema);
export default Session
