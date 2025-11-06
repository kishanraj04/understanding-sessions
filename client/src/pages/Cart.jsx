import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import CartItem from "../components/CartItem";

export default function Cart() {
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/cart");
        console.log(res.data);

        // Extract the nested cart array
        const items = res.data?.cartData?.[0]?.cart || [];
        setCart(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    })();
  }, []);

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Your Cart
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden divide-y divide-gray-200 rounded-xl dark:divide-gray-700">
        {cart.length > 0 ? (
          cart.map((item) => <CartItem key={item._id} item={item} />)
        ) : (
          <p className="p-6 text-gray-500 text-center">Your cart is empty</p>
        )}
      </div>

      <div className="py-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Total:
          </span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ₹{total}
          </span>
        </div>
        <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
