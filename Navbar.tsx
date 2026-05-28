import React, { useState } from "react";
import { Search, Menu, X, Bookmark, User, LogOut, ShieldAlert, Sparkles, TrendingUp, Layers } from "lucide-react";
import { User as UserType } from "../types";

interface NavbarProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  currentUser,
  onLogout,
  onOpenAuth,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "categories", label: "Categories" },
    { id: "customise", label: "Customise" },
    { id: "trending", label: "Trending" },
    { id: "premium", label: "Premium" },
    { id: "about", label: "About" },
    ...(currentUser ? [{ id: "saved", label: "Saved" }] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-zinc-900/50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className="group flex items-center space-x-2 text-2xl font-black tracking-widest text-red-500 font-sans hover:text-white transition duration-300 pointer-events-auto"
            >
              <span>DRIP</span>
              <span className="text-white group-hover:text-red-500 transition duration-300">VERSE</span>
            </button>
            
            {currentUser?.premium_plan !== "none" && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold tracking-widest uppercase bg-gradient-to-r from-yellow-500 to-amber-600 text-black gap-1 shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-pulse">
                <Sparkles size={10} /> Premium
              </span>
            )}
            
            {currentUser?.role === "admin" && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold tracking-widest uppercase bg-red-600 text-white gap-1">
                <ShieldAlert size={10} /> Core Admin
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium transition duration-350 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-red-600 font-bold text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                {item.id === "premium" ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <Sparkles size={12} className="text-amber-400 animate-bounce" />
                    {item.label}
                  </span>
                ) : item.id === "trending" ? (
                  <span className="flex items-center gap-1.2">
                    <TrendingUp size={11} className="text-red-500" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </button>
            ))}

            {currentUser?.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`ml-1 px-4 py-2 rounded-full text-xs tracking-wider uppercase font-semibold text-red-400 border border-red-900/30 hover:bg-red-950/20 transition duration-300 cursor-pointer ${
                  activeTab === "admin" ? "bg-red-900/50 border-red-500 text-white" : ""
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Search, Auth status */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Search Input Box */}
            <div className="relative flex items-center bg-zinc-950 border border-zinc-850 px-3 py-1.5 rounded-full w-48 focus-within:w-64 focus-within:border-zinc-750 transition-all duration-300">
              <Search size={14} className="text-zinc-500 mr-2" />
              <input
                type="text"
                placeholder="Search streetwear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 w-full placeholder-zinc-550"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-white">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Profile Options */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div 
                  onClick={() => setActiveTab("saved")} 
                  className="relative group p-2 hover:bg-zinc-90 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer hover:border hover:border-zinc-800"
                  title="My Saved Collections"
                >
                  <Bookmark size={15} className="text-zinc-300 group-hover:text-red-500 transition-colors" />
                </div>

                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-800"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold leading-tight text-zinc-100">{currentUser.name}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-zinc-400 hover:text-red-500 rounded-full hover:bg-zinc-950 border border-zinc-900 duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:scale-[1.02] cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Action Icon */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full duration-200 cursor-pointer"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full duration-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden border-t border-zinc-900 p-4 bg-zinc-950">
          <div className="relative bg-zinc-900 px-3 py-2 rounded-lg flex items-center">
            <Search size={15} className="text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search streetwear, style, baggy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-zinc-900/80 px-4 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-red-650 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}

            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  setActiveTab("admin");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold border border-red-900/30 text-red-400 hover:bg-red-950/20 cursor-pointer ${
                  activeTab === "admin" ? "bg-red-950/30" : ""
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="border-t border-zinc-900 pt-4 flex flex-col space-y-3">
            {currentUser ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <img
                    src={currentUser.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-red-650"
                  />
                  <div>
                    <p className="text-xs font-bold text-white leading-normal">{currentUser.name}</p>
                    <p className="text-[10px] text-zinc-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg text-red-400 border border-zinc-800 cursor-pointer"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg font-sans shadow-lg duration-250 cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
