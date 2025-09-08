"use client";

import React from "react";
import LoginModal from "./LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function handlelogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("uuid");
    window.location.href = "/";
}

export default function NavBar() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/" },
  ];

  const ref = React.useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [isLogin, setProfile] = React.useState(false);

  React.useEffect(() => {
    const handleLogin = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        console.log(token);
        if (token) {
          setProfile(true);
        } else {
          setProfile(false);
        }
      }
    };

    handleLogin();
    console.log(isLogin);

    const handleScroll = () => {
      if (ref.current) {
        setIsScrolled(ref.current.scrollTop > 10);
      }
    };

    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div ref={ref} className="h-32 overflow-y-scroll">
      <p className="w-10 h-[500px]"></p>
      <nav
        className={`fixed top-0 left-0 bg-[#023E8A] w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}
      >
        <a href="https://prebuiltui.com" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className={`h-20 ${isScrolled ? "invert opacity-80" : ""}`}
          />
        </a>

        <div className="hidden font-[Montserrat] md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.path}
              className={`group flex flex-col font gap-0.5 text-xl ${isScrolled ? "text-[#ADE8F4]" : "text-[#ADE8F4]"}`}
            >
              {link.name}
              <div
                className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <svg
            className={`h-6 w-6 text-[#000000] transition-all duration-500 ${isScrolled ? "invert" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {!isLogin ? (
            <LoginModal text="Sign in" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">👤</span>
                </div>
              </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onSelect={() => window.location.href = "/profile"}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => window.location.href = "/dashboard"}>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handlelogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-6 w-6 text-[#000000] cursor-pointer ${isScrolled ? "invert" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks.map((link, i) => (
            <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </a>
          ))}
          {!isLogin ? (
            <LoginModal text="Sign in" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">👤</span>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
