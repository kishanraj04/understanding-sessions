import express from "express";
import Session from "../models/Session.js";
import Cart from "../models/Cart.js";

const router = express.Router();

function isJSONParsable(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
// GET cart
router.get("/", async (req, res) => {
  try {
    const { sessio_id } = req?.signedCookies;

    if (isJSONParsable(sessio_id)) {
      const {userId,cartId,login} = JSON.parse(sessio_id);
      const cd = await Cart.findById({_id:cartId}).populate("cart");
      //data to send
      console.log(cd);
      const cartData = [
        {
          _id:cd?._id,
          userId:cd?.userId,
          cart:cd?.cart
        }
      ]
     return res.status(200).json({ success: true, cartData });
    } else {
      const cartData = await Session.find({ _id: sessio_id }).populate("cart");
      return res.status(200).json({ success: true, cartData });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

// Add to cart
router.post("/", async (req, res) => {
  try {
    const { sessio_id } = req.signedCookies;
    const { courseId } = req.body;
    // console.log(sessio_id);
    // ✅ Case 1: Logged-in user (cookie stores JSON data)
    if (sessio_id && isJSONParsable(sessio_id)) {
      const { userId, cartId, login } = JSON.parse(sessio_id);

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Avoid duplicate entries
      const exists = cart.cart.some(
        (id) => id.toString() === courseId.toString()
      );

      if (!exists) {
        cart.cart.push(courseId);
        await cart.save(); // ✅ use save(), not push()
      }

      console.log("✅ Logged-in cart updated");
      return res.status(200).json({ message: "Cart updated successfully" });
    }

    // ✅ Case 2: Guest user (cookie stores session ID)
    else {
      console.log("🟡 Guest user session flow");

      // Try to find an existing Session
      const sessionId = sessio_id;
      const cartSession = sessionId ? await Session.findById(sessionId) : null;

      if (!cartSession) {
        // Create new session if none exists
        const session = await Session.create({ cart: [courseId] });

        res.cookie("sessio_id", session._id.toString(), {
          httpOnly: true,
          signed: true,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
        });

        console.log("🆕 New guest session created");
        return res.status(201).json({
          message: "New session created",
          session,
        });
      }

      // If session exists, update it
      const alreadyExists = cartSession.cart.some(
        (id) => id.toString() === courseId.toString()
      );

      if (!alreadyExists) {
        cartSession.cart.push(courseId);
        await cartSession.save();
      }

      console.log("✅ Guest cart updated");
      return res.status(200).json({
        message: "Cart updated successfully",
        session: cartSession,
      });
    }
  } catch (error) {
    console.error("❌ Error updating cart:", error.message);
    return res.status(500).json({ message: error.message });
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
    if (resp?.deletedCount >= 1) {
      return res.status(200).json({ success: true, message: "deleted" });
    }
    return res.status(200).json({ success: true, message: "deletion failes" });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
