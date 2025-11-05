import mongoose from 'mongoose'
const sessionSchema = new mongoose.Schema({
     cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }}
  ],
})

const Session = mongoose.model("Session",sessionSchema);
export default Session
