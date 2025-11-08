import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      if (!email) return alert("Please enter your email first!");
      setLoading(true);
      const resp = await axiosInstance.post("/otp/send-otp", { email });
      if (resp?.data?.success) {
        alert("OTP sent to your email!");
        setOtpSent(true);
      } else {
        alert(resp?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      if (!otp) return alert("Please enter OTP");
      setLoading(true);
      otp.toString();
      const resp = await axiosInstance.post("/otp/verify-otp", { email, otp });
      if (resp?.data?.success) {
        alert("OTP verified successfully!");
        setOtpVerified(true);
      } else {
        alert(resp?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register after OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify your email first!");
    try {
      const resp = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      if (resp?.data?.success) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(resp?.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during registration");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base"
            />
          </div>

          {/* Email Field + Send OTP Button */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || otpSent}
                className={`mt-1 px-3 py-2 rounded-md text-white font-medium ${
                  otpSent
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP Verification Box */}
          {otpSent && !otpVerified && (
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Enter OTP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="mt-1 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Password + Register Button */}
          {otpVerified && (
            <>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center px-3 py-2 border border-transparent rounded-md shadow-sm 
                text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
