import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate JWT token

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  function isJSONParsable(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { sessio_id } = req?.signedCookies;
    const userId = user?._id;

    if (isJSONParsable(sessio_id)) {
      return res.status(200).json({ message: "login success" });
    }

    if (sessio_id) {
      const allCartItem = await Session.findById({ _id: sessio_id });

      const cart = new Cart({
        userId,
        cart: allCartItem?.cart || [],
      });
      await cart.save();

      const newSession = { userId, cartId: cart?._id, login: true };

      res.cookie("sessio_id", JSON.stringify(newSession), {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 30,
      });
    } else {
      const cart = await Cart.create();
      const newSession = { userId, cartId: cart?._id, login: true };
      res.cookie("sessio_id", JSON.stringify(newSession), {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 30,
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error?.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
