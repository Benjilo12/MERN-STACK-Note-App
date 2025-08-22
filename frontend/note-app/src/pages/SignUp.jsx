import { useState, useRef, useEffect } from "react";
import PasswordInput from "../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosinstance";
import { gsap } from "gsap";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Refs for animation elements
  const formRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const inputRefs = useRef([]);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("please enter your name");

      // Shake animation for error
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
      );
      return;
    }

    if (!validateEmail(email)) {
      setError("please enter a valid email address");

      // Shake animation for error
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
      );
      return;
    }

    if (!password) {
      setError("please enter your password");

      // Shake animation for error
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
      );
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);

        // Shake animation for error
        gsap.fromTo(
          formRef.current,
          { x: 0 },
          { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
        );
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);

        // Animate success before navigation
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => navigate("/dashboard"),
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);

        // Shake animation for error
        gsap.fromTo(
          formRef.current,
          { x: 0 },
          { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
        );
      } else {
        setError("An unexpected error occurred. Please try again.");

        // Shake animation for error
        gsap.fromTo(
          formRef.current,
          { x: 0 },
          { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
        );
      }
    }
  };

  // Set up animations on component mount
  useEffect(() => {
    const tl = gsap.timeline();

    // Logo animation
    tl.fromTo(
      logoRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
    );

    // Title animation
    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Form container animation
    tl.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
    );

    // Input fields animation (staggered)
    tl.fromTo(
      inputRefs.current,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // Button animation
    tl.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.2"
    );

    // Footer animation
    tl.fromTo(
      footerRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    // Background elements animation
    gsap.to(".floating-circle", {
      y: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    });
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-circle absolute rounded-full bg-white/5"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-md">
          {/* Decorative elements */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

          <div
            ref={formRef}
            className="relative bg-gray-800/70 dark:bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden px-8 py-10"
          >
            {/* Header with logo area */}
            <div className="text-center mb-8">
              <div
                ref={logoRef}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h4
                ref={titleRef}
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Create Account
              </h4>
              <p className="text-gray-400 mt-2">Join us to get started</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              <div
                ref={(el) => (inputRefs.current[0] = el)}
                className="space-y-2"
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => {
                    gsap.to(e.target, {
                      scale: 1.02,
                      duration: 0.2,
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                    });
                  }}
                  onBlur={(e) => {
                    gsap.to(e.target, {
                      scale: 1,
                      duration: 0.2,
                      boxShadow: "none",
                    });
                  }}
                />
              </div>

              <div
                ref={(el) => (inputRefs.current[1] = el)}
                className="space-y-2"
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => {
                    gsap.to(e.target, {
                      scale: 1.02,
                      duration: 0.2,
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                    });
                  }}
                  onBlur={(e) => {
                    gsap.to(e.target, {
                      scale: 1,
                      duration: 0.2,
                      boxShadow: "none",
                    });
                  }}
                />
              </div>

              <div
                ref={(el) => (inputRefs.current[2] = el)}
                className="space-y-2"
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  onFocus={(e) => {
                    gsap.to(e.target, {
                      scale: 1.02,
                      duration: 0.2,
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                    });
                  }}
                  onBlur={(e) => {
                    gsap.to(e.target, {
                      scale: 1,
                      duration: 0.2,
                      boxShadow: "none",
                    });
                  }}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                ref={buttonRef}
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onMouseEnter={(e) => {
                  gsap.to(e.target, {
                    scale: 1.05,
                    duration: 0.2,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.target, {
                    scale: 1,
                    duration: 0.2,
                  });
                }}
              >
                Create Account
              </button>

              <div ref={footerRef} className="text-center pt-4">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>

            {/* Decorative footer */}
            <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-xs text-gray-500">
                Secure registration with modern encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
