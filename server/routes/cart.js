import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  try {
    const { sessio_id } = req?.signedCookies;
    const cartData = await Session.find({ _id: sessio_id }).populate("cart");
    return res.status(200).json({ success: true, cartData });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

// Add to cart
router.post("/", async (req, res) => {
  try {
    const { sessio_id } = req?.signedCookies;
    const { courseId } = req?.body;
    const cartSession = await Session.findById(sessio_id);
    // console.log(cartSession);
    if (!cartSession) {
      const session = await Session.create({ cart: [courseId] });

      res.cookie("sessio_id", session?._id, {
        httpOnly: true,
        signed: true,
        maxAge: 60 * 60 * 1000 * 60,
      });

      return res
        .status(201)
        .json({ message: "New session created", session: cartSession });
    }

    if (!cartSession?.cart?.includes(courseId)) {
      cartSession?.cart?.push(courseId);
      await cartSession.save();
    }
    return res
      .status(200)
      .json({ message: "Cart updated", session: cartSession });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  //Add your code here
  const { courseId } = req?.params;
  const { sessio_id } = req?.signedCookies;
  console.log(courseId);
  try {
    const resp = await Session.updateOne(
      { _id: sessio_id },
      {
        $pull: { cart: courseId },
      }
    );
    if(resp?.deletedCount>=1){
      return res.status(200).json({success:true,message:"deleted"})
    }
    return res.status(200).json({success:true,message:"deletion failes"})
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
