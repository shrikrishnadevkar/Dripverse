import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Heart, Bookmark, Eye, Calendar, User, Share2, MessageSquare, 
  ChevronRight, ArrowRight, ShieldCheck, AlertCircle, TrendingUp, Filter, 
  X, Check, Lock, DollarSign, Upload, Trash2, Edit, Plus, BarChart3, Users, 
  ArrowUpRight, Info, Copy, ShoppingBag, EyeOff, LayoutGrid, ArrowDownToLine,
  Briefcase, MapPin, CheckCircle2, Instagram, Mail
} from "lucide-react";
import { Design, User as UserType, Comment } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Standard UI Categories
const CATEGORIES = [
  "All",
  "T-Shirts",
  "Oversized T-Shirts",
  "Check Shirts",
  "Cargo Pants",
  "Baggy Jeans",
  "Sneakers",
  "Hoodies",
  "Watches",
  "Streetwear",
  "Jackets"
];

// Celebrity Worn presets showing designs being worn
const CELEBRITIES = [
  { name: "Kanye West", tag: "worn-by-kanye", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=250&auto=format&fit=crop&q=80" },
  { name: "Travis Scott", tag: "worn-by-travis", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=250&auto=format&fit=crop&q=80" },
  { name: "Billie Eilish", tag: "worn-by-billie", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=250&auto=format&fit=crop&q=80" },
  { name: "A$AP Rocky", tag: "worn-by-rocky", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=250&auto=format&fit=crop&q=80" },
  { name: "Zendaya", tag: "worn-by-zendaya", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=250&auto=format&fit=crop&q=80" },
  { name: "Hailey Bieber", tag: "worn-by-hailey", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=250&auto=format&fit=crop&q=80" },
  { name: "Justin Bieber", tag: "worn-by-justin", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=250&auto=format&fit=crop&q=80" },
  { name: "Pharrell Williams", tag: "worn-by-pharrell", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=250&auto=format&fit=crop&q=80" }
];

// Quick tags presets
const PRESET_TAGS = ["streetwear", "baggy", "vintage", "retro", "heavyweight", "minimal", "oversized", "premium", "trending"];

interface Toast {
  message: string;
  type: "success" | "error" | "info";
  id: string;
}

export default function App() {
  // Navigation & Categorization state
  const [activeTab, setActiveTab] = useState<string>("home"); // "home" | "categories" | "trending" | "premium" | "saved" | "admin"
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFilter, setSelectedFilter] = useState<string>("Latest"); // "Latest" | "Most Viewed" | "Trending" | "Most Liked"
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCelebrity, setSelectedCelebrity] = useState<string | null>(null);

  // Authentication & Session state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [isAuthSignUp, setIsAuthSignUp] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [usePhoneAuth, setUsePhoneAuth] = useState<boolean>(false);
  const [authPhone, setAuthPhone] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");

  // App core data arrays from server
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState<boolean>(true);
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userCommentText, setUserCommentText] = useState<string>("");
  const [savedStatus, setSavedStatus] = useState<{ isSaved: boolean; isLiked: boolean }>({ isSaved: false, isLiked: false });

  // Subscription state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: 'weekly' | 'monthly' | 'yearly'; price: number; name: string } | null>(null);
  const [simulatedCardNumber, setSimulatedCardNumber] = useState<string>("4111 2222 3333 4444");
  const [simulatedCardExpiry, setSimulatedCardExpiry] = useState<string>("12/28");
  const [simulatedCardCVV, setSimulatedCardCVV] = useState<string>("991");
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false);
  const [checkoutMethod, setCheckoutMethod] = useState<"card" | "upi">("upi");
  const [upiUtr, setUpiUtr] = useState<string>("");

  // Admin section details
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [isNewDesignPremium, setIsNewDesignPremium] = useState<boolean>(false);
  const [isNewDesignTrending, setIsNewDesignTrending] = useState<boolean>(false);
  const [isNewDesignWeekly, setIsNewDesignWeekly] = useState<boolean>(false);
  const [isNewDesignMonthly, setIsNewDesignMonthly] = useState<boolean>(false);
  const [newDesignTitle, setNewDesignTitle] = useState<string>("");
  const [newDesignCategory, setNewDesignCategory] = useState<string>("Oversized T-Shirts");
  const [newDesignCover, setNewDesignCover] = useState<string>("");
  const [newDesignDescription, setNewDesignDescription] = useState<string>("");
  const [newDesignTags, setNewDesignTags] = useState<string>("");
  const [newDesignerName, setNewDesignerName] = useState<string>("DRIPVERSE Atelier");
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);

  // CUSTOM DESIGNS / DRIP LAB STUDIO STATES
  const [customApparel, setCustomApparel] = useState<string>("Oversized T-Shirts");
  const [customColor, setCustomColor] = useState<string>("#121212"); 
  const [customText, setCustomText] = useState<string>("DRIP LAB REBEL");
  const [customTextColor, setCustomTextColor] = useState<string>("#e11d48"); 
  const [customTextStyle, setCustomTextStyle] = useState<string>("Gothic Spike"); 
  const [customStickers, setCustomStickers] = useState<{ id: string; name: string; url: string; x: number; y: number; scale: number; rotation: number }[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [customUploadedImg, setCustomUploadedImg] = useState<string | null>(null);
  const [customImgX, setCustomImgX] = useState<number>(0);
  const [customImgY, setCustomImgY] = useState<number>(20);
  const [customImgScale, setCustomImgScale] = useState<number>(100);
  const [customImgRotation, setCustomImgRotation] = useState<number>(0);

  // Quick helper image urls for Admin uploads
  const PRESET_IMAGE_SUGGESTIONS = [
    { name: "Graphic Hoodie", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&auto=format&fit=crop&q=80" },
    { name: "Sleek Sneakers", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80" },
    { name: "Retro Denim", url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=80" },
    { name: "Sport Trainer", url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80" },
    { name: "Streetwear Model", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80" }
  ];

  // Feedback notifications list state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Push immediate feedback toast
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Initialize active user state from local credentials
  useEffect(() => {
    const storedEmail = localStorage.getItem("dripverse_user_email");
    if (storedEmail) {
      fetchMySession(storedEmail);
    } else {
      // Auto-set dummy guest user for seamless preview
      fetchMySession("guest_user@dripverse.com");
    }
  }, []);

  // Fetch designs list whenever category, filter, search, or activeTab changes
  useEffect(() => {
    let filterString = selectedFilter;
    let categoryValue = selectedCategory;

    if (activeTab === "trending") {
      filterString = "Trending";
    } else if (activeTab === "premium") {
      // Show premium models
      categoryValue = "All";
    }

    setLoadingDesigns(true);
    let url = `/api/designs?filter=${filterString}`;
    if (categoryValue && categoryValue !== "All") {
      url += `&category=${encodeURIComponent(categoryValue)}`;
    }
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    if (selectedCelebrity) {
      url += `&tag=${encodeURIComponent(selectedCelebrity)}`;
    }
    
    // Clear other tags or handles when switching tab of non-relevant catalog
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (activeTab === "premium") {
          // Client side filter premium
          setDesigns(data.filter((d: Design) => d.is_premium));
        } else if (activeTab === "saved") {
          // We will fetch from /api/saved-collections explicitly
          fetchSavedCollectionOnly();
        } else {
          setDesigns(data);
        }
      })
      .catch((err) => {
        console.error("Error loading designs: ", err);
        triggerToast("Failed to fetch clothing catalogue", "error");
      })
      .finally(() => {
        setLoadingDesigns(false);
      });
  }, [selectedCategory, selectedFilter, searchQuery, activeTab, selectedCelebrity]);

  // Fetch current design saved relationship details
  useEffect(() => {
    if (currentDesign) {
      const email = currentUser?.email || "";
      fetch(`/api/designs/${currentDesign.id}/saved-state`, {
        headers: {
          "Authorization": `Bearer ${email}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setSavedStatus(data);
        });

      // Also reload comments
      fetch(`/api/designs/${currentDesign.id}/comments`)
        .then(res => res.json())
        .then(data => {
          setComments(data);
        });
    }
  }, [currentDesign, currentUser]);

  // Fetch admin dashboard parameters
  useEffect(() => {
    if (currentUser?.role === "admin" && activeTab === "admin") {
      fetchAdminMetrics();
    }
  }, [currentUser, activeTab]);

  const fetchSavedCollectionOnly = () => {
    const email = currentUser?.email || "";
    fetch(`/api/saved-collections`, {
      headers: {
        "Authorization": `Bearer ${email}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setDesigns(data);
      });
  };

  const fetchMySession = (email: string) => {
    fetch("/api/auth/me", {
      headers: {
        "Authorization": `Bearer ${email}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem("dripverse_user_email", data.user.email);
        } else {
          // Auto create a smooth guest
          handleAutoRegisterAndLogin(email);
        }
      });
  };

  const handleAutoRegisterAndLogin = (email: string) => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem("dripverse_user_email", data.user.email);
        }
      });
  };

  const fetchAdminMetrics = () => {
    const email = currentUser?.email || "";
    fetch("/api/admin/metrics", {
      headers: {
        "Authorization": `Bearer ${email}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setAdminMetrics(data);
      });
  };

  // Perform Log Out state deletion
  const handleLogout = () => {
    localStorage.removeItem("dripverse_user_email");
    setCurrentUser(null);
    triggerToast("Signed out from DRIPVERSE. Guest Mode active.", "info");
    setActiveTab("home");
  };

  // Form handling: Custom Login/Register Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usePhoneAuth) {
      if (!authPhone) {
        triggerToast("Please input a valid phone number key", "error");
        return;
      }
      if (!authCode) {
        triggerToast("Invalid verification SMS code. Input simulated code 303030 or 123456", "error");
        return;
      }
    } else {
      if (!authEmail) {
        triggerToast("Please provide reference email key", "error");
        return;
      }
      // Check admin credentials constraint
      if (authEmail.trim().toLowerCase() === "shrikrishnadevkar60@gmail.com" && authPassword !== "303030") {
        triggerToast("Incorrect Administrator credentials password. Input 303030.", "error");
        return;
      }
    }

    const endpoint = isAuthSignUp ? "/api/auth/signup" : "/api/auth/login";
    
    // Construct request inputs matching both registration pipelines
    const finalEmail = usePhoneAuth ? `${authPhone.trim()}@dripverse.com` : authEmail;
    const finalName = usePhoneAuth ? `Phone Client ${authPhone.slice(-4)}` : (authName || authEmail.split("@")[0].toUpperCase());

    const bodyContent = isAuthSignUp 
      ? { email: finalEmail, name: finalName, phone: usePhoneAuth ? authPhone : undefined }
      : { email: finalEmail, password: authPassword, phone: usePhoneAuth ? authPhone : undefined };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyContent)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Authentication failed") });
        }
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data.user);
        localStorage.setItem("dripverse_user_email", data.user.email);
        setShowAuthModal(false);
        triggerToast(`Welcome back, ${data.user.name}! Access Authorized.`, "success");
        // Clear status forms
        setAuthEmail("");
        setAuthName("");
        setAuthPassword("");
        setAuthPhone("");
        setAuthCode("");
      })
      .catch((err) => {
        triggerToast(err.message, "error");
      });
  };

  // Helper trigger for Auto Admin log-in
  const triggerQuickAdminLogin = () => {
    setAuthEmail("admin@dripverse.com");
    setAuthName("Dripverse Administrator");
    setIsAuthSignUp(false);
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@dripverse.com" })
    })
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data.user);
        localStorage.setItem("dripverse_user_email", "admin@dripverse.com");
        setShowAuthModal(false);
        triggerToast("Admin Terminal Authorization Verified!", "success");
        setActiveTab("admin");
      });
  };

  // Trigger like callback details
  const handleLikeDesign = (designId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (!currentUser) {
      setShowAuthModal(true);
      triggerToast("Authentication requested to participate in likes", "info");
      return;
    }

    fetch(`/api/designs/${designId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUser.email })
    })
      .then((res) => res.json())
      .then((data) => {
        // Update grid designs instantly
        setDesigns(prev =>
          prev.map(d => d.id === designId ? { ...d, likes: data.likes } : d)
        );

        // Update single modal details if relevant
        if (currentDesign && currentDesign.id === designId) {
          setCurrentDesign(prev => prev ? { ...prev, likes: data.likes } : null);
          setSavedStatus(prev => ({ ...prev, isLiked: data.isLiked }));
        }

        if (data.isLiked) {
          triggerToast("Design added to trending algorithm", "success");
        } else {
          triggerToast("Design like retracted", "info");
        }
      });
  };

  // Save/Bookmark design toggle callback
  const handleSaveDesign = (designId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (!currentUser) {
      setShowAuthModal(true);
      triggerToast("Please Log-In to structure your Saved Collections list", "info");
      return;
    }

    fetch(`/api/designs/${designId}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUser.email })
    })
      .then(res => res.json())
      .then(data => {
        if (currentDesign && currentDesign.id === designId) {
          setSavedStatus(prev => ({ ...prev, isSaved: data.isSaved }));
        }
        if (data.isSaved) {
          triggerToast("Added to premium saved lookbooks!", "success");
        } else {
          triggerToast("Removed from saved lookbooks", "info");
          // If we are strictly in the saved tab display, filter item out dynamically
          if (activeTab === "saved") {
            setDesigns(prev => prev.filter(d => d.id !== designId));
          }
        }
      });
  };

  // Submit new comment to api
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      triggerToast("Authentication is required to drop comment tags", "info");
      return;
    }
    if (!userCommentText.trim()) return;

    fetch(`/api/designs/${currentDesign?.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser.email,
        commentText: userCommentText
      })
    })
      .then(res => res.json())
      .then(newComment => {
        setComments(prev => [newComment, ...prev]);
        setUserCommentText("");
        triggerToast("Couture advice submitted!", "success");
      });
  };

  // Select Premium subscription plan card
  const handleSubscribeClick = (plan: 'weekly' | 'monthly' | 'yearly', price: number, name: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      triggerToast("Join Dripverse to register premium plans", "info");
      return;
    }
    setSelectedPlan({ id: plan, price, name });
    setShowSubscriptionModal(true);
  };

  // Simulated Razorpay verification
  const handleRazorpayPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !currentUser) return;

    if (checkoutMethod === "upi" && (!upiUtr || upiUtr.trim().length < 6)) {
      triggerToast("Please input a valid UPI UTR/Transaction ID first!", "error");
      return;
    }

    setSubmittingPayment(true);
    setTimeout(() => {
      const razorpay_payment_id = checkoutMethod === "upi" 
        ? "upi_utr_" + upiUtr.trim() 
        : "rzp_live_" + Math.random().toString(36).substring(2, 12) + "sec";
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          plan_type: selectedPlan.id,
          payment_id: razorpay_payment_id,
          amount: selectedPlan.price
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCurrentUser(data.user);
            setShowSubscriptionModal(false);
            setSelectedPlan(null);
            setUpiUtr("");
            triggerToast(`Secure Payment Verified! Authorized Plan: ${selectedPlan.name}`, "success");
          } else {
            triggerToast("Simulated subscription error, please verify your credentials.", "error");
          }
        })
        .catch(err => {
          triggerToast("Secure payment processing error occurred", "error");
        })
        .finally(() => {
          setSubmittingPayment(false);
        });
    }, 1800);
  };

  // Admin section: Create / Edit streetwear designs
  const handleSaveDesignByAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignTitle || !newDesignCategory || !newDesignCover) {
      triggerToast("Missing required apparel parameters", "error");
      return;
    }

    const tagsArray = newDesignTags
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const requestBody = {
      email: currentUser?.email,
      title: newDesignTitle,
      category: newDesignCategory,
      image_url: newDesignCover,
      tags: tagsArray,
      description: newDesignDescription,
      is_premium: isNewDesignPremium,
      is_trending: isNewDesignTrending,
      is_weekly_top: isNewDesignWeekly,
      is_monthly_top: isNewDesignMonthly,
      designer_name: newDesignerName
    };

    const url = editingDesignId ? `/api/designs/${editingDesignId}` : "/api/designs";
    const method = editingDesignId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to deploy configuration");
        }
        return res.json();
      })
      .then(() => {
        triggerToast(
          editingDesignId 
            ? "Streetwear design updated successfully!" 
            : "Brand New apparel design deployed live natively!", 
          "success"
        );
        // Clear Form variables
        setNewDesignTitle("");
        setNewDesignCover("");
        setNewDesignDescription("");
        setNewDesignTags("");
        setNewDesignerName("DRIPVERSE Atelier");
        setIsNewDesignPremium(false);
        setIsNewDesignTrending(false);
        setIsNewDesignWeekly(false);
        setIsNewDesignMonthly(false);
        setEditingDesignId(null);
        
        // Refresh Lists
        setSelectedCategory("All");
        setActiveTab("home");
      })
      .catch((err) => {
        triggerToast(err.message, "error");
      });
  };

  // Admin delete trigger sequence
  const handleDeleteDesignByAdmin = (designId: string) => {
    if (!window.confirm("Are you certain you want to remove this clothing piece from DRIPVERSE?")) {
      return;
    }

    const email = currentUser?.email || "";
    fetch(`/api/designs/${designId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${email}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast("Design deleted", "info");
          setDesigns(prev => prev.filter(d => d.id !== designId));
          fetchAdminMetrics();
        }
      });
  };

  // Admin local image / file reader upload handler
  const handleAdminImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      triggerToast("Invalid format. Please select an image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setNewDesignCover(ev.target.result as string);
        triggerToast("Local high-quality file parsed successfully!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Admin edit prefill sequence
  const handleEditDesignSelect = (design: Design) => {
    setEditingDesignId(design.id);
    setNewDesignTitle(design.title);
    setNewDesignCategory(design.category);
    setNewDesignCover(design.image_url);
    setNewDesignDescription(design.description);
    setNewDesignTags(design.tags.join(", "));
    setNewDesignerName(design.designer_name);
    setIsNewDesignPremium(design.is_premium);
    setIsNewDesignTrending(design.is_trending);
    setIsNewDesignWeekly(design.is_weekly_top);
    setIsNewDesignMonthly(design.is_monthly_top);
    
    // Auto scroll up to form action state details
    window.scrollTo({ top: 350, behavior: 'smooth' });
    triggerToast("Loaded design configurations into editor", "info");
  };

  // Social link mockup share feedback
  const handleShareDesign = (design: Design) => {
    const shareUrl = `${window.location.host}/design/${design.id}`;
    navigator.clipboard.writeText(`Check out this trending ${design.title} design on DRIPVERSE! ${shareUrl}`);
    triggerToast("Custom fashion clip copied to workspace clipboard!", "success");
  };

  // HIGH RESOLUTION DIRECT DOWNLOADS UTILITY (CORS Secure fallback)
  const handleDownloadHD = async (design: Design) => {
    try {
      triggerToast("Preparing Ultra high-resolution luxury asset...", "info");
      // Adjust Unsplash sizing parameters for massive pixel-dense master export
      const hdUrl = design.image_url.split('?')[0] + "?w=2400&q=100&auto=format&fit=crop";
      
      const response = await fetch(hdUrl, { mode: 'cors' }).catch(() => null);
      if (!response) {
        // Fallback for CORS sandbox constraints
        const link = document.createElement("a");
        link.href = hdUrl;
        link.target = "_blank";
        link.download = `${design.title.toLowerCase().replace(/\s+/g, "-")}-hd.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast("Asset opened in direct download workspace tab!", "success");
        return;
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${design.title.toLowerCase().replace(/\s+/g, "-")}-hd.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      triggerToast("High-definition fashion garment graphic downloaded!", "success");
    } catch (err) {
      triggerToast("Opening assets workspace directly...", "info");
      window.open(design.image_url, "_blank");
    }
  };

  // DRIP LAB HIGH-FIDELITY TEXTURE COMPILER EXPORTER
  const handleDownloadCustomHD = async () => {
    try {
      triggerToast("Drawing garment templates and composites...", "info");
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Solid luxury studio backdrop
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple design of simulated garments vector representation
      ctx.fillStyle = customColor;
      
      if (customApparel === "Cargo Pants" || customApparel === "Baggy Jeans") {
        ctx.beginPath();
        ctx.moveTo(400, 300);
        ctx.lineTo(800, 300);
        ctx.lineTo(820, 1300);
        ctx.lineTo(650, 1300);
        ctx.lineTo(600, 650); // crotch
        ctx.lineTo(550, 1300);
        ctx.lineTo(380, 1300);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (customApparel === "Watches" || customApparel === "Sneakers") {
        ctx.beginPath();
        ctx.arc(600, 750, 220, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.stroke();
      } else {
        // T-Shirt / Hoodie custom outline drawing representation
        ctx.beginPath();
        ctx.moveTo(400, 250);
        ctx.lineTo(800, 250);
        ctx.lineTo(880, 420);
        ctx.lineTo(760, 480);
        ctx.lineTo(740, 1250);
        ctx.lineTo(460, 1250);
        ctx.lineTo(440, 480);
        ctx.lineTo(320, 420);
        ctx.closePath();
        ctx.fill();
        
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.stroke();
      }

      // Draw custom uploaded image first if it exists
      if (customUploadedImg) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = customUploadedImg;
          img.onload = () => {
            ctx.save();
            const scaleFactor = 2.5; 
            ctx.translate(600 + customImgX * scaleFactor, 750 + customImgY * scaleFactor);
            ctx.rotate((customImgRotation * Math.PI) / 180);
            const w = customImgScale * scaleFactor;
            const h = customImgScale * scaleFactor;
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            ctx.restore();
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
        });
      }

      // Compile styled text overlay
      ctx.fillStyle = customTextColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let fontFace = "Impact, Arial Black, sans-serif";
      if (customTextStyle === "Gothic Spike") {
        fontFace = "'Playfair Display', Georgia, serif";
      } else if (customTextStyle === "Tech Monospace") {
        fontFace = "'JetBrains Mono', Courier, monospace";
      } else if (customTextStyle === "Retro Liquid") {
        fontFace = "'Comic Sans MS', cursive, sans-serif";
      }

      ctx.font = `italic 72px ${fontFace}`;
      ctx.fillText(customText, 600, 680);

      // Render overlay sticker matrices
      customStickers.forEach((sticker) => {
        ctx.save();
        ctx.translate(600 + sticker.x * 2.5, 750 + sticker.y * 2.5);
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        
        // Draw elegant mockup shapes for stickers
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.arc(0, 0, sticker.scale * 3.5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = customTextColor;
        ctx.font = "bold 26px sans-serif";
        ctx.fillText(sticker.name.toUpperCase(), 0, 0);
        ctx.restore();
      });

      // Watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "bold 24px monospace";
      ctx.fillText("DRIP LAB CUSTOM LAB Drop 2026", 600, 1420);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `my-drip-${customApparel.toLowerCase().replace(/\s+/g, "-")}-hd.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Custom garment design downloaded in perfect high resolution!", "success");
    } catch (err) {
      triggerToast("Error downloading layout parameters", "error");
    }
  };

  // SYNC CUSTOM OUTLINES TO BACKEND SEED FOLDER
  const handleDeployCustomToCatalog = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      triggerToast("Authentictation dossiers required to register designs", "info");
      return;
    }

    triggerToast("Compiling wardrobe profile elements...", "info");
    
    // Generate simplified catalog preview
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0c0c0e";
    ctx.fillRect(0, 0, 600, 750);
    ctx.fillStyle = customColor;
    ctx.fillRect(150, 150, 300, 480);
    ctx.fillStyle = customTextColor;
    ctx.font = "bold 32px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(customText, 300, 380);

    const mockupBase64 = canvas.toDataURL("image/jpeg");

    const requestBody = {
      email: currentUser.email,
      title: `${customText} ${customApparel.slice(0, -1)}`,
      category: customApparel,
      image_url: mockupBase64,
      tags: ["customisable", "streetwear", "raw", "anime", "exclusive"],
      description: `A highly personalized luxury ${customApparel} designed manually inside DRIP LAB. Highlights custom text overlay "${customText}" in themed ${customTextStyle} fonts.`,
      is_premium: false,
      is_trending: true,
      is_weekly_top: false,
      is_monthly_top: false,
      designer_name: `${currentUser.name.toUpperCase()}`
    };

    fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not register design");
        return res.json();
      })
      .then((newDesign) => {
        setDesigns(prev => [newDesign, ...prev]);
        triggerToast("Garment configuration successfully synced to main timeline!", "success");
        setActiveTab("categories");
        // Reset states
        setCustomText("DRIP LAB REBEL");
        setCustomStickers([]);
      })
      .catch(err => {
        triggerToast("Synchronization error, please review server metrics", "error");
      });
  };

  // Check if a design represents a premium locks block for this client session
  const isPremiumLocked = (design: Design) => {
    if (!design.is_premium) return false;
    if (currentUser?.role === "admin") return false;
    if (currentUser?.premium_plan && currentUser?.premium_plan !== "none") return false;
    return true;
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-red-650 selection:text-white relative overflow-hidden flex flex-col justify-between">
      
      {/* Absolute Aesthetic Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-650/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-[80vh] right-10 w-80 h-80 bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Standard Header Navigation widget */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => { setIsAuthSignUp(false); setShowAuthModal(true); }}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto clear queries on tab transition
          setSearchQuery("");
          setSelectedCategory("All");
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Interactive content switcher */}
      {activeTab === "home" && (
        <Hero
          onExploreClick={() => {
            setActiveTab("categories");
            setSelectedCategory("All");
          }}
          onCategorySelect={(cat) => {
            setActiveTab("categories");
            setSelectedCategory(cat);
          }}
          categories={CATEGORIES.filter(c => c !== "All")}
        />
      )}

      {/* Main Browse and Grid Section */}
      {activeTab !== "admin" && activeTab !== "customise" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
          
          {/* Headline descriptors based on current section context */}
          {activeTab === "categories" && selectedCategory !== "All" ? (
            <div className="mb-8 text-left bg-zinc-950/40 p-6 md:p-8 rounded-3xl border border-zinc-900/80 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-650/5 rounded-full blur-3xl pointer-events-none" />
              <button
                onClick={() => setSelectedCategory("All")}
                className="inline-flex items-center gap-2 text-red-500 hover:text-white text-xxs font-black uppercase tracking-widest mb-4 transition duration-200 cursor-pointer"
              >
                &larr; Back to Main Collections
              </button>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-zinc-550 font-bold text-[9px] tracking-[0.3em] uppercase block mb-1">
                    Verified Curations Suite
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none text-white font-sans">
                    {selectedCategory}
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-2 max-w-xl leading-relaxed">
                    Browse premium streetwear garments systematically registered under the <strong className="text-red-500 font-extrabold">{selectedCategory}</strong> lineage. Designed with high-intensity modern fabrics.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-black text-xxs tracking-widest uppercase rounded-full transition duration-200 cursor-pointer self-start md:self-auto"
                >
                  View All Categories
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-10 text-left">
              <span className="text-red-600 font-bold text-xs tracking-[0.3em] uppercase block mb-2">
                {activeTab === "home" ? "GLOBAL ARCHIVE" : activeTab.toUpperCase()}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none">
                {activeTab === "home" && "Summer Streetwear Grid"}
                {activeTab === "categories" && `CURATIONS // ${selectedCategory}`}
                {activeTab === "trending" && "Weekly High-Intensity Drops"}
                {activeTab === "premium" && "VIP Exclusive Collections"}
                {activeTab === "saved" && "My Curated Lookbooks"}
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-2 max-w-2xl leading-relaxed">
                {activeTab === "home" && "Scroll downwards for an instantaneous glimpse into the upcoming clothing pieces. Premium pieces can be unlocked on-demand via plan upgrade."}
                {activeTab === "categories" && `Browse verified garments categorized systematically under ${selectedCategory}. Filters customize search matching immediately.`}
                {activeTab === "trending" && "Derived algorithmically by likes and global pageviews. These designs define the contemporary meta of streetwear fashion."}
                {activeTab === "premium" && "Access elite designer assets available only for Weekly, Monthly or Yearly subscribers. Become a premium member."}
                {activeTab === "saved" && "Quickly organize and evaluate your bookmarked apparel. Your saved state resides dynamically on your session."}
              </p>
            </div>
          )}

          {/* CELEBRITY LOOKBOOKS EXCLUSIVE FILTER ROW */}
          {(activeTab === "home" || (activeTab === "categories" && selectedCategory === "All")) && (
            <div className="mb-10 text-left bg-zinc-950/40 p-6 rounded-3xl border border-zinc-900/60 backdrop-blur-md">
              <span className="text-xxs tracking-[0.2em] font-black text-red-500 uppercase block mb-3">
                ⭐ Celebrity Star-Worn Lookbooks
              </span>
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCelebrity(null)}
                  className={`flex flex-col items-center space-y-1.5 shrink-0 px-4 py-2 bg-zinc-900/50 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    selectedCelebrity === null
                      ? "border-red-500/80 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-white"
                      : "border-zinc-805 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center font-black text-[9px] tracking-tighter uppercase shrink-0 border border-zinc-700">
                    ALL
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">ALL DROP ITEMS</span>
                </button>

                {CELEBRITIES.map((celeb) => {
                  const isActive = selectedCelebrity === celeb.tag;
                  return (
                    <button
                      key={celeb.tag}
                      onClick={() => setSelectedCelebrity(isActive ? null : celeb.tag)}
                      className={`flex items-center space-x-3 shrink-0 px-4 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-red-500/80 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-white"
                          : "border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      <img
                        src={celeb.img}
                        alt={celeb.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-700 pointer-events-none"
                      />
                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-wider block leading-none">
                          {celeb.name}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500 block mt-0.5 uppercase tracking-tight">
                          #{celeb.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grid filter toolset bar */}
          {activeTab === "categories" && selectedCategory === "All" && (
            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950/90 border border-zinc-900 px-6 py-4 rounded-3xl mb-10">
              
              {/* Category selector capsules */}
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xxs tracking-wider uppercase font-bold transition duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-red-650 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Advanced Filter selector dropdown */}
              <div className="flex items-center space-x-2 border-l border-zinc-900 pl-4">
                <Filter size={12} className="text-zinc-500" />
                <span className="text-zinc-550 text-xxs tracking-wider uppercase font-semibold">Sort By</span>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-zinc-900 text-zinc-300 font-bold text-xxs tracking-wider uppercase border border-zinc-800 rounded-lg px-2.5 py-1.5 focus:border-red-600 focus:outline-none"
                >
                  <option value="Latest">Latest Additions</option>
                  <option value="Most Viewed">Most Viewed (Traffic)</option>
                  <option value="Trending">Trending Tag Only</option>
                  <option value="Most Liked">Most Liked (Public Interest)</option>
                </select>
              </div>

            </div>
          )}

          {/* Quick Search indicators query banner */}
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl">
              <span className="text-xs text-zinc-400">
                ACTIVE SEARCH QUERY: <strong className="text-white">"{searchQuery}"</strong> ({designs.length} matchings)
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xxs font-bold text-red-500 uppercase tracking-widest hover:text-white"
              >
                Clear Search &times;
              </button>
            </div>
          )}

          {/* SIMULATED PINTEREST MASONRY GRID LAYOUT */}
          {loadingDesigns ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-4 space-y-4 animate-pulse">
                  <div className="bg-zinc-900 h-64 rounded-2xl w-full" />
                  <div className="h-4 bg-zinc-900 rounded w-2/3" />
                  <div className="h-3 bg-zinc-900 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-16 text-center max-w-xl mx-auto space-y-6">
              <EyeOff size={32} className="text-zinc-650 mx-auto" />
              <div className="space-y-2">
                <h4 className="text-lg font-bold tracking-tight uppercase">No Fashion Trends Found</h4>
                <p className="text-zinc-500 text-xs">
                  We currently have no apparel trends registered for either the selected query, premium restrictions, or your favorited saves. Check back later or make manual additions in the Admin panel!
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setActiveTab("categories");
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xxs tracking-widest uppercase px-6 py-3 rounded-xl cursor-not-allowed cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 [column-fill:_balance] box-border">
              {designs.map((design) => {
                const isLocked = isPremiumLocked(design);
                
                return (
                  <div
                    key={design.id}
                    onClick={() => setCurrentDesign(design)}
                    className="break-inside-avoid relative group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-700/80 transition-all duration-350 cursor-pointer flex flex-col shadow-lg"
                  >
                    
                    {/* Clothing design image view port */}
                    <div className="relative overflow-hidden w-full bg-zinc-900">
                      <img
                        src={design.image_url}
                        alt={design.title}
                        referrerPolicy="no-referrer"
                        className={`w-full h-auto object-cover transition-all duration-1000 ease-in-out ${
                          isLocked ? "scale-105 blur-[12px] brightness-75 select-none" : "group-hover:scale-105"
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-85 pointer-events-none" />

                      {/* Floating status metadata badges */}
                      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-1.5 items-center justify-between">
                        <div className="flex gap-1">
                          {design.is_premium && (
                            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                              <Sparkles size={10} /> VIP
                            </span>
                          )}
                          {design.is_trending && (
                            <span className="bg-red-650 text-white px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                              <TrendingUp size={10} /> HOT
                            </span>
                          )}
                          {design.tags.includes("celebrity-worn") && (
                            <span className="bg-zinc-950/90 text-red-500 border border-red-500/30 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                              ⭐ CELEB
                            </span>
                          )}
                        </div>

                        {/* Interactive Like action pill wrapper directly inside the Grid for speedy interface */}
                        <button
                          onClick={(e) => handleLikeDesign(design.id, e)}
                          className="w-8 h-8 rounded-full bg-black/70 hover:bg-red-650 backdrop-blur-md flex items-center justify-center border border-white/10 text-white transition-all duration-200"
                        >
                          <Heart
                            size={12}
                            className={
                              currentUser && design.likes.includes(currentUser.id)
                                ? "fill-white text-white scale-110"
                                : "text-zinc-300"
                            }
                          />
                        </button>
                      </div>

                      {/* Display of premium blur state overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
                          <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/25 rounded-full flex items-center justify-center mb-4 text-yellow-500">
                            <Lock size={18} />
                          </div>
                          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1.5">Premium Lock</span>
                          <p className="text-white text-md font-bold uppercase tracking-tight leading-tight px-4">
                            Unlock {design.category}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1 mb-4 leading-normal">
                            Access top weekly exclusive streetwear drops from ₹99/week.
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab("premium");
                              triggerToast("Unlock access below!", "info");
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black text-[9px] font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl transition duration-200"
                          >
                            Unlock
                          </button>
                        </div>
                      )}

                      {/* Standard Grid Description Bottom panel overlay for non-locked models */}
                      {!isLocked && (
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                          <div className="text-left">
                            <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest block">
                              {design.category}
                            </span>
                            <h3 className="text-xs sm:text-sm font-black text-white hover:text-red-500 tracking-tight transition-colors line-clamp-1">
                              {design.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center space-x-1 bg-black/55 backdrop-blur-md border border-white/5 py-1 px-2.5 rounded-full">
                            <Eye size={10} className="text-zinc-400" />
                            <span className="text-[9px] font-mono text-zinc-300">{design.views}</span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Simple Bottom interactive ribbon to like or trigger detail view */}
                    {!isLocked && (
                      <div className="border-t border-zinc-900 p-4 flex items-center justify-between text-left bg-zinc-950/40">
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(design.tags)).slice(0, 2).map((tag, tagIdx) => (
                            <span key={`${tag}-${tagIdx}`} className="text-[8px] font-mono text-zinc-500 uppercase">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => handleSaveDesign(design.id, e)}
                            className="text-zinc-500 hover:text-yellow-500 transition-colors"
                          >
                            <Bookmark 
                              size={12} 
                              className={
                                currentUser && designs.some(d => d.id === design.id && activeTab === "saved") 
                                  ? "fill-yellow-500 text-yellow-500" 
                                  : ""
                              }
                            />
                          </button>
                          <button 
                            className="text-xs text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition duration-200"
                          >
                            View &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* INTERACTIVE CUSTOM DESIGNS STUDIO: DRIP LAB WORKSPACE */}
      {activeTab === "customise" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10 text-left">
          
          {/* Header area */}
          <div className="border-b border-zinc-900 pb-8 mb-10">
            <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase block mb-1">DRIPVERSE COUTURE WORKSHOP</span>
            <h1 className="text-4xl font-black uppercase tracking-tight">Drip Lab Customizer</h1>
            <p className="text-zinc-500 text-xs mt-1">Concoct custom apparel, deploy advanced graphics typography, evaluate layouts, and trigger immediate high-definition downloads.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT: Live Mockup Canvas Presentation Card */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
              
              {/* Product Background Ambient Light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] pointer-events-none" />
              
              <div className="w-full flex justify-between items-center mb-6 z-10">
                <span className="text-xxs font-mono text-zinc-500 tracking-wider">LIVE CUSTOM MOCKUP PREVIEW [2D ACTIVE CANVAS]</span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-zinc-900/80 text-white/90 border border-white/5 font-mono">
                  {customApparel}
                </span>
              </div>

              {/* The Live Composite Interactive Stage */}
              <div 
                className="relative w-72 h-96 rounded-2xl flex flex-col items-center justify-center transition-colors duration-300 shadow-2xl overflow-hidden"
                style={{ backgroundColor: customColor }}
              >
                {/* Garment Shape Overlay Backdrop Graphic */}
                <span className="absolute text-white/5 text-[150px] font-black pointer-events-none select-none select-none tracking-tighter uppercase font-sans">
                  {customApparel === "Oversized T-Shirts" || customApparel === "T-Shirts" ? "TEE" : 
                   customApparel === "Hoodies" ? "HOOD" : 
                   customApparel === "Cargo Pants" || customApparel === "Baggy Jeans" ? "PANT" : "GEAR"}
                </span>

                {/* User-Uploaded Custom Image Overlay Layer */}
                {customUploadedImg && (
                  <div
                    className="absolute z-15 border border-dashed border-red-500/40 select-none group flex items-center justify-center"
                    style={{
                      transform: `translate(${customImgX}px, ${customImgY}px) rotate(${customImgRotation}deg)`,
                      width: `${customImgScale}px`,
                      height: `${customImgScale}px`,
                    }}
                  >
                    <img 
                      src={customUploadedImg} 
                      alt="Custom texture layer" 
                      className="w-full h-full object-contain pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomUploadedImg(null);
                        triggerToast("Uploaded graphic layer removed", "info");
                      }}
                      className="absolute top-1 right-1 bg-black/80 hover:bg-red-500 text-white font-bold rounded-full p-1 text-[8px] leading-none transition duration-150 flex items-center justify-center cursor-pointer w-4 h-4 shadow"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Styled Text Component Overlay */}
                <div 
                  className="z-10 text-center select-none font-black max-w-[200px] break-words uppercase px-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] py-2"
                  style={{ 
                    color: customTextColor,
                    fontFamily: customTextStyle === "Gothic Spike" ? "'Playfair Display', Georgia, serif" :
                               customTextStyle === "Tech Monospace" ? "'JetBrains Mono', Courier, monospace" :
                               customTextStyle === "Retro Liquid" ? "'Comic Sans MS', cursive, sans-serif" :
                               "Impact, Arial Black, sans-serif",
                    fontSize: customText.length > 20 ? "14px" : customText.length > 12 ? "18px" : "24px",
                    letterSpacing: customTextStyle === "Tech Monospace" ? "0.25em" : "normal"
                  }}
                >
                  {customText || "DRIP REBEL"}
                </div>

                {/* Loaded Stickers Matrix */}
                {customStickers.map((sticker) => {
                  const isSelected = selectedStickerId === sticker.id;
                  return (
                    <div
                      key={sticker.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStickerId(sticker.id);
                      }}
                      className={`absolute z-20 cursor-move py-2.5 px-3 mb-10 text-xs font-bold rounded-lg leading-none transition-all duration-150 ${
                        isSelected 
                          ? "border-2 border-dashed border-red-500 bg-black/80 scale-105 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                          : "border border-zinc-800 bg-zinc-950/75 text-zinc-300 hover:border-zinc-700 hover:bg-black/40"
                      }`}
                      style={{
                        transform: `translate(${sticker.x}px, ${sticker.y}px) rotate(${sticker.rotation}deg)`,
                        fontSize: `${sticker.scale / 2.5}px`
                      }}
                    >
                      <div className="flex items-center gap-1.5 whitespace-nowrap select-none font-mono">
                        <span>{sticker.name}</span>
                        {isSelected && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomStickers(prev => prev.filter(s => s.id !== sticker.id));
                              setSelectedStickerId(null);
                              triggerToast("Sticker removed", "info");
                            }}
                            className="bg-red-500 text-white rounded p-0.5 ml-1 text-[8px] hover:bg-red-400"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Tiny watermark */}
                <span className="absolute bottom-4 text-[7px] font-mono text-white/20 tracking-[0.4em] uppercase">
                  DRIP LAB // CUSTOM DEPLOYMENT 1.0X
                </span>
              </div>

              {/* Instructions helper block */}
              <div className="w-full mt-6 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-900 text-center text-[10px] text-zinc-500 font-semibold space-y-1">
                <p>💡 Tip: Type custom text input, add stickers, click a sticker to select it, then adjust X / Y sliders to reposition it live on garments.</p>
              </div>

            </div>

            {/* RIGHT: Sophisticated Interactive Customizer Controls Configuration Panel */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* 1. Base Garment selection */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-black text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 1. SELECT BASE GARMENT CATEGORY
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {["T-Shirts", "Oversized T-Shirts", "Hoodies", "Cargo Pants", "Baggy Jeans", "Sneakers", "Watches", "Streetwear"].map((apparel) => (
                      <button
                        key={apparel}
                        onClick={() => {
                          setCustomApparel(apparel);
                          triggerToast(`Switched canvas to ${apparel}`, "info");
                        }}
                        className={`py-3 px-4 rounded-xl text-xxs font-black uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                          customApparel === apparel
                            ? "bg-red-650 border-red-650 text-white shadow-[0_4px_15px_rgba(220,38,38,0.2)]"
                            : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:border-zinc-750 hover:text-white"
                        }`}
                      >
                        {apparel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fabric Color Selection */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-black text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 2. CHOOSE BASE GARMENT FABRIC COLOR
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                    {[
                      { hex: "#121212", name: "Matte Charcoal" },
                      { hex: "#e2e2e7", name: "Vintage White" },
                      { hex: "#5d1515", name: "Crimson Acid" },
                      { hex: "#2b3b2a", name: "Army Drab" },
                      { hex: "#1e3a8a", name: "Cyber Royal Blue" },
                      { hex: "#6366f1", name: "Neon Violet" }
                    ].map((colorObj) => (
                      <button
                        key={colorObj.hex}
                        onClick={() => {
                          setCustomColor(colorObj.hex);
                          triggerToast(`Fabric dyed: ${colorObj.name}`, "info");
                        }}
                        className={`w-10 h-10 rounded-full cursor-pointer relative group border-2 ${
                          customColor === colorObj.hex ? "border-red-650 scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: colorObj.hex }}
                        title={colorObj.name}
                      >
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[8px] tracking-wide font-black uppercase py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 duration-150 pointer-events-none mb-1 shadow-lg whitespace-nowrap z-15">
                          {colorObj.name}
                        </span>
                      </button>
                    ))}
                    
                    {/* Raw Input hex */}
                    <div className="flex items-center gap-2 pl-2 border-l border-zinc-850">
                      <span className="text-[10px] uppercase font-bold text-zinc-550 font-mono">Custom color:</span>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-0 p-0"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Custom Text Lettering & Fonts */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-black text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 3. INJECT CUSTOM STREETWEAR TEXT LETTERING
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-550">Type custom text *</label>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="e.g. TOKYO REBEL"
                        maxLength={40}
                        className="w-full bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-red-650"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-550">Typography Font Theme</label>
                      <select
                        value={customTextStyle}
                        onChange={(e) => setCustomTextStyle(e.target.value)}
                        className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-xl px-3 py-3 text-xs focus:outline-none"
                      >
                        <option value="Gothic Spike">Gothic Spike (Classic Serif)</option>
                        <option value="Tech Monospace">Tech Monospace (Cyberpunk)</option>
                        <option value="Retro Liquid">Retro Liquid (Groovy)</option>
                        <option value="Brutalist Impact">Brutalist Impact (Monolithic)</option>
                      </select>
                    </div>

                  </div>

                  {/* Text color options preset row */}
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase font-black text-zinc-550">Text Color Variant Selection</p>
                    <div className="flex gap-2">
                      {["#ffffff", "#000000", "#e11d48", "#10b981", "#fbbf24", "#06b6d4", "#be185d"].map((colorHex) => (
                        <button
                          key={colorHex}
                          onClick={() => setCustomTextColor(colorHex)}
                          className={`w-6 h-6 rounded border cursor-pointer ${
                            customTextColor === colorHex ? "ring-2 ring-red-500" : ""
                          }`}
                          style={{ backgroundColor: colorHex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Stickers Overlay Compartment */}
                <div className="space-y-4 pt-2 border-t border-zinc-900">
                  <h3 className="text-xs uppercase tracking-wider font-black text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 4. EMBED GRAPHICS / STICKERS / METADATA
                  </h3>

                  {/* Stickers drawer */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-650 uppercase">TAP TO ADD OVERLAYS ON THE SHIRT:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { name: "REBEL DRAGON", icon: "🐉" },
                        { name: "TOKYO GOTHIC", icon: "👹" },
                        { name: "CYBER EYE", icon: "👁️" },
                        { name: "ACID SMILEY", icon: "☠️" },
                        { name: "ROSE THORN", icon: "🌹" },
                        { name: "TIGER SOUL", icon: "🐯" },
                        { name: "FIRE FLAME", icon: "🔥" },
                        { name: "ANIME MECH", icon: "🤖" }
                      ].map((st) => (
                        <button
                          key={st.name}
                          type="button"
                          onClick={() => {
                            const newSticker = {
                              id: "sticker-" + Date.now() + Math.random(),
                              name: `${st.icon} ${st.name}`,
                              url: `${st.icon}`,
                              x: 0,
                              y: 20,
                              scale: 18,
                              rotation: 0
                            };
                            setCustomStickers(prev => [...prev, newSticker]);
                            setSelectedStickerId(newSticker.id);
                            triggerToast(`Added ${st.name} graphic!`, "success");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-850 p-2 border border-zinc-850 rounded-xl text-left flex items-center gap-2 hover:scale-[1.02] duration-150 group cursor-pointer"
                        >
                          <span className="text-base">{st.icon}</span>
                          <span className="text-[9px] font-bold text-zinc-400 group-hover:text-white line-clamp-1">{st.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active sticker adjust parameters */}
                  {selectedStickerId && (
                    <div className="bg-zinc-900 p-4 rounded-xl space-y-4 border border-zinc-850 text-xxs">
                      
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                          🔧 Active Layer: {customStickers.find(s => s.id === selectedStickerId)?.name}
                        </span>
                        <button
                          onClick={() => setSelectedStickerId(null)}
                          className="text-[9px] text-zinc-500 hover:text-white uppercase font-bold"
                        >
                          Deselect Layer
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Translate X */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium text-zinc-500 font-mono">
                            <span>REPOSITION X SHIFT:</span>
                            <span className="text-white">{customStickers.find(s => s.id === selectedStickerId)?.x}px</span>
                          </div>
                          <input
                            type="range"
                            min="-120"
                            max="120"
                            value={customStickers.find(s => s.id === selectedStickerId)?.x || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCustomStickers(prev => prev.map(s => s.id === selectedStickerId ? { ...s, x: val } : s));
                            }}
                            className="w-full accent-red-650"
                          />
                        </div>

                        {/* Translate Y */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium text-zinc-500 font-mono">
                            <span>REPOSITION Y SHIFT:</span>
                            <span className="text-white">{customStickers.find(s => s.id === selectedStickerId)?.y}px</span>
                          </div>
                          <input
                            type="range"
                            min="-160"
                            max="160"
                            value={customStickers.find(s => s.id === selectedStickerId)?.y || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCustomStickers(prev => prev.map(s => s.id === selectedStickerId ? { ...s, y: val } : s));
                            }}
                            className="w-full accent-red-650"
                          />
                        </div>

                        {/* Size SCALE */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium text-zinc-500 font-mono">
                            <span>GRAPHIC TEXTURE SCALE:</span>
                            <span className="text-white">{customStickers.find(s => s.id === selectedStickerId)?.scale}px</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="60"
                            value={customStickers.find(s => s.id === selectedStickerId)?.scale || 18}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCustomStickers(prev => prev.map(s => s.id === selectedStickerId ? { ...s, scale: val } : s));
                            }}
                            className="w-full accent-red-650"
                          />
                        </div>

                        {/* Rotation slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium text-zinc-500 font-mono">
                            <span>LAYER ROTATION:</span>
                            <span className="text-white">{customStickers.find(s => s.id === selectedStickerId)?.rotation}°deg</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={customStickers.find(s => s.id === selectedStickerId)?.rotation || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCustomStickers(prev => prev.map(s => s.id === selectedStickerId ? { ...s, rotation: val } : s));
                            }}
                            className="w-full accent-red-650"
                          />
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* 5. Custom Uploaded Image / Texture Layer */}
                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <h3 className="text-xs uppercase tracking-wider font-black text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> 5. UPLOAD CUSTOM LOGO, EMBLEM, OR ARTWORK IMAGE
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Drop / Trigger Button */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-550 block">Select image from device</label>
                      <div className="relative border-2 border-dashed border-zinc-800 hover:border-red-500/50 rounded-2xl p-4 bg-zinc-900/30 hover:bg-zinc-900 transition duration-150 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (!file.type.startsWith("image/")) {
                              triggerToast("Invalid format, please choose an image file.", "error");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setCustomUploadedImg(event.target.result as string);
                                setCustomImgX(0);
                                setCustomImgY(0);
                                setCustomImgScale(110);
                                setCustomImgRotation(0);
                                triggerToast("Custom fashion layer uploaded successfully!", "success");
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload size={18} className="text-zinc-500 mb-1.5" />
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Drag & Drop Image</span>
                        <span className="text-[8px] text-zinc-550 font-semibold uppercase mt-0.5">PNG, JPG, SVG are supported</span>
                      </div>
                    </div>

                    {/* Pre-made premium preset textures helper */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-zinc-550 block">Quick Texture Presets</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Cosmic Nebula", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop" },
                          { name: "Retro Acid Graffiti", url: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?w=500&auto=format&fit=crop" },
                          { name: "Acid Fire", url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop" },
                          { name: "Street Tiger", url: "https://images.unsplash.com/photo-1508186227448-7a541f2cd35d?w=500&auto=format&fit=crop" }
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setCustomUploadedImg(preset.url);
                              setCustomImgX(0);
                              setCustomImgY(0);
                              setCustomImgScale(110);
                              setCustomImgRotation(0);
                              triggerToast(`Loaded preset ${preset.name}!`, "info");
                            }}
                            className="bg-zinc-90 w-full bg-zinc-900 hover:bg-zinc-850 p-2 border border-zinc-850 rounded-xl text-[9px] font-bold text-zinc-400 hover:text-white flex items-center justify-center text-center truncate cursor-pointer h-[50px] uppercase"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Positioning controls for Custom Uploaded Image */}
                  {customUploadedImg && (
                    <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="font-bold text-zinc-300 uppercase tracking-widest text-[9px]">
                          🎨 ACTIVE CUSTOM IMAGE POSITION CONTROLS
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustomUploadedImg(null)}
                          className="text-[8px] font-black tracking-widest text-red-500 hover:text-red-400 uppercase"
                        >
                          Clear Image
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xxs">
                        {/* Translate X */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                            <span>HORIZONTAL POSITION:</span>
                            <span className="text-white font-bold">{customImgX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-120"
                            max="120"
                            value={customImgX}
                            onChange={(e) => setCustomImgX(parseInt(e.target.value))}
                            className="w-full accent-red-650"
                          />
                        </div>

                        {/* Translate Y */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                            <span>VERTICAL POSITION:</span>
                            <span className="text-white font-bold">{customImgY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-160"
                            max="160"
                            value={customImgY}
                            onChange={(e) => setCustomImgY(parseInt(e.target.value))}
                            className="w-full accent-red-650"
                          />
                        </div>

                        {/* Scale */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                            <span>TEXTURE LAYER SCALE:</span>
                            <span className="text-white font-bold">{customImgScale}px</span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="220"
                            value={customImgScale}
                            onChange={(e) => setCustomImgScale(parseInt(e.target.value))}
                            className="w-full accent-red-650"
                          />
                        </div>

                        {/* Rotation */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                            <span>ROTATION DEGREES:</span>
                            <span className="text-white font-bold">{customImgRotation}°</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={customImgRotation}
                            onChange={(e) => setCustomImgRotation(parseInt(e.target.value))}
                            className="w-full accent-red-650"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action output execution section */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadCustomHD}
                  className="flex-1 bg-zinc-90 w-full bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <ArrowDownToLine size={15} /> Save As HD PNG
                </button>
                <button
                  onClick={handleDeployCustomToCatalog}
                  className="flex-1 bg-red-650 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <Sparkles size={14} /> Synchronize to Dripverse catalog
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PREMIUM SUBSCRIPTION PLANS PAGE CONTENT */}
      {activeTab === "premium" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10 w-full mb-16">
          
          {/* Banner Hero block */}
          <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#100101] border border-zinc-900 p-8 sm:p-14 rounded-3xl text-left mb-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xxs font-black tracking-widest uppercase rounded-full">
                THE DRIPVERSE COUTURE CIRCLE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none">
                VIP LUXURY ACCESS
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Dripverse Premium operates a specialized lookbook drop service. Regular users browse base styles. VIP tier unlocks deep acid-washes, military specs, tactical items, sneakers, and chronological watches instantly with direct designer vector reports.
              </p>
              <div className="flex flex-wrap gap-6 text-[11px] text-zinc-400 font-semibold pt-2">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-yellow-500" /> Unlock Top 10 Weekly drops
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-yellow-500" /> High-Resolution Looks
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-yellow-500" /> Razorpay Secured Payments
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-2xl max-w-sm text-center">
              <Sparkles size={32} className="text-yellow-500 mx-auto mb-3 animate-spin duration-1000" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Active Level</p>
              <p className="text-2xl font-black font-mono text-zinc-100 uppercase mt-1">
                {currentUser?.premium_plan !== "none" ? `${currentUser?.premium_plan} MEMBER` : "FREE VISITOR"}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase mt-2">
                {currentUser?.premium_expiry ? `EXPIRYDATE: ${new Date(currentUser.premium_expiry).toLocaleDateString()}` : "SUBSCRIBE TO VIEW FULL PORTFOLIOS"}
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xxs uppercase tracking-[0.4em] font-black text-red-500">Pick a membership tier</h3>
            <p className="text-md font-sans text-zinc-400 font-bold uppercase mt-1">Full early access to streetwear models</p>
          </div>

          {/* Pricing cards columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 1: Weekly */}
            <div className="bg-zinc-950/90 border border-zinc-900 rounded-3xl p-8 text-left transition duration-300 hover:border-zinc-850 flex flex-col justify-between relative">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">STANDARD TESTER</span>
                  <h4 className="text-xl font-black uppercase text-white">Weekly Plan</h4>
                </div>
                
                <div className="pb-4 border-b border-zinc-900">
                  <p className="text-4xl font-black font-mono text-white">
                    ₹99<span className="text-xs text-zinc-550 font-sans tracking-normal bg-zinc-90 w-fit">/WEEK</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans">Ideal to evaluate initial streetwear drops</p>
                </div>

                <ul className="text-xs text-zinc-400 space-y-3 font-medium">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Access top 10 weekly fashion designs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Secure comment access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Early preview alerts
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribeClick("weekly", 99, "Weekly Couture")}
                className="w-full mt-8 bg-zinc-900 hover:bg-red-650 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer"
              >
                {currentUser?.premium_plan === "weekly" ? "Current active plan" : "Invest ₹99"}
              </button>
            </div>

            {/* CARD 2: Monthly */}
            <div className="bg-zinc-950/95 border-2 border-red-650 rounded-3xl p-8 text-left transition duration-300 relative flex flex-col justify-between shadow-[0_0_25px_rgba(220,38,38,0.15)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-650 text-white text-[9px] font-black uppercase tracking-widest px-4 py-0.5 rounded-full">
                MOST POPULAR PRESET
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-1 font-mono">DRIP ENTHUSIAST</span>
                  <h4 className="text-xl font-black uppercase text-white flex items-center justify-between">
                    Monthly Plan <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                  </h4>
                </div>
                
                <div className="pb-4 border-b border-zinc-900">
                  <p className="text-4xl font-black font-mono text-white">
                    ₹199<span className="text-xs text-zinc-550 font-sans tracking-normal uppercase">/MONTH</span>
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Excellent for active streetwear enthusiasts</p>
                </div>

                <ul className="text-xs text-zinc-300 space-y-3 font-medium">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Access all monthly premium drops
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Unlimited saved collections & lookbooks
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> VIP premium active profile badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Premium visual zoom options
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribeClick("monthly", 199, "Monthly Premium")}
                className="w-full mt-8 bg-red-650 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 shadow-xl cursor-pointer"
              >
                {currentUser?.premium_plan === "monthly" ? "Current active plan" : "Invest ₹199"}
              </button>
            </div>

            {/* CARD 3: Yearly */}
            <div className="bg-zinc-950/90 border border-zinc-900 rounded-3xl p-8 text-left transition duration-300 hover:border-zinc-850 flex flex-col justify-between relative">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">VIP MEMBER ACCESS</span>
                  <h4 className="text-xl font-black uppercase text-white">Yearly Plan</h4>
                </div>
                
                <div className="pb-4 border-b border-zinc-900">
                  <p className="text-4xl font-black font-mono text-white">
                    ₹999<span className="text-xs text-zinc-550 font-sans tracking-normal uppercase">/YEAR</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">Premium luxury early couture reporting</p>
                </div>

                <ul className="text-xs text-zinc-400 space-y-3 font-medium">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Full premium unlimited archives
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Exclusive premium designer vector files
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> Download premium complete lookbooks
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-red-650" /> VIP early notification drop alerts
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribeClick("yearly", 999, "Yearly Supreme VIP")}
                className="w-full mt-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 cursor-pointer"
              >
                {currentUser?.premium_plan === "yearly" ? "Current active plan" : "Invest ₹999"}
              </button>
            </div>

          </div>

          {/* Premium blog display area */}
          <div className="mt-20 border-t border-zinc-900 pt-16 text-left">
            <h3 className="text-xxs uppercase tracking-widest font-bold text-zinc-500 mb-6">Featured Premium Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex gap-4">
                <div className="w-24 h-24 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">COUTURE ANALYTICS</span>
                  <h4 className="text-sm font-bold text-white uppercase mt-1">Subculture Aesthetics in 2026</h4>
                  <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2">How heavy-wash Japanese raw denims and chunky dynamic tactical boots are completely dominating the Western high fashion landscape.</p>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex gap-4">
                <div className="w-24 h-24 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">LOOKBOOK DEBUT</span>
                  <h4 className="text-sm font-bold text-white uppercase mt-1">Industrial Minimalism Sneakers</h4>
                  <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2">A technical preview of asymmetric lacing systems, mesh running silhouettes with integrated security LEDs and composite materials.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ABOUT COMPANY DIVISION */}
      {activeTab === "about" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative z-10 text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Top high couture hero header */}
            <div className="border-b border-zinc-900 pb-10">
              <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase block mb-1">
                CORPORATE META PROFILE
              </span>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                Devkars pvt ltd
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
                Engineering high-dimensional garments and futuristic streetwear. Dripverse constitutes our premium digital storefront, delivering unparalleled fabrics and techwear aesthetics across India.
              </p>
            </div>

            {/* Core statistics / features bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/5 rounded-full blur-2xl pointer-events-none" />
                <Briefcase className="text-red-500 mb-4" size={24} />
                <h3 className="text-base font-black uppercase text-white">Vanguard Garments</h3>
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                  Every product drops via rigorous stress-testing, raw wash washes, and asymmetric sewing architectures, guaranteeing durability.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/5 rounded-full blur-2xl pointer-events-none" />
                <MapPin className="text-red-500 mb-4" size={24} />
                <h3 className="text-base font-black uppercase text-white">Indian Roots</h3>
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                  Based and structured strategically in India, designing garments that fuse subcultural global streetwear with local technical weaves.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/5 rounded-full blur-2xl pointer-events-none" />
                <CheckCircle2 className="text-red-500 mb-4" size={24} />
                <h3 className="text-base font-black uppercase text-white">Full Verification</h3>
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                  Every drip code features cryptographic serial hashes, protecting authentication for premium and VIP supreme tier assets.
                </p>
              </div>
            </div>

            {/* Corporate and Contact Card split section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
              
              {/* Left details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase text-white tracking-wider">The Innovation Manifesto</h2>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                    At <strong className="text-white font-black uppercase">Devkars pvt ltd</strong>, we reject traditional fashion calendars. We operate on live, algoritmically triggered Drops. Our garments target high durability, structural pocket placement, raw texture exposure, and modular utility. 
                  </p>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                    Led by principal designer and executive director Shrikrishna Devkar, Dripverse is the digital frontier where high subculture elements are democratized for select premium collectors.
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl block">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-3">EXECUTIVE SUMMARY</h4>
                  <div className="space-y-2 text-xxs font-mono">
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-500">PARENT CODE:</span>
                      <span className="text-zinc-300 font-bold uppercase">DEVKARS PVT LTD</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-500">FOUNDING DIRECTOR:</span>
                      <span className="text-zinc-300 font-bold uppercase">SHRIKRISHNA DEVKAR</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-500">OPERATIONAL SPHERE:</span>
                      <span className="text-zinc-300 font-bold uppercase">LUXURY street wear</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">DIGITAL DEPLOYMENT:</span>
                      <span className="text-red-500 font-bold uppercase">DRIPVERSE BETA LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right details - Beautiful Interactive Contact & Connect Cards */}
              <div className="space-y-6">
                <h2 className="text-xl font-black uppercase text-white tracking-wider">Direct Liaison Channels</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Establish instant contact with our leadership and corporate support deck. We are available for technical sizing guidance, drop reservations, and premium VIP validations.
                </p>

                <div className="space-y-3 pt-2">
                  
                  {/* WhatsApp contact Card */}
                  <a
                    href="https://wa.me/919730668645?text=Hello%20Devkars%20pvt%20ltd,%20I%20am%20interested%20in%20Dripverse%20designs!"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-[#075e54]/5 hover:bg-[#075e54]/15 border border-[#075e54]/30 rounded-3xl transition duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#25d366]/10 flex items-center justify-center text-[#25d366] shrink-0 border border-[#25d366]/20">
                        <MessageSquare size={22} className="fill-current" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold block mb-0.5">LAUNCH CHAT WHATSAPP</span>
                        <p className="text-sm font-black text-white font-mono">+91 9730668645</p>
                        <p className="text-[9px] text-zinc-500">Instant sizing & shipping consultations</p>
                      </div>
                    </div>
                    <span className="text-zinc-500 group-hover:text-white transition-all text-xs font-bold font-mono">&rarr;</span>
                  </a>

                  {/* Instagram social Card */}
                  <a
                    href="https://www.instagram.com/shrikrishna_devkar/"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-gradient-to-tr from-orange-500/5 to-pink-500/5 hover:from-orange-500/15 hover:to-pink-500/15 border border-pink-500/20 rounded-3xl transition duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500/10 to-pink-500/10 flex items-center justify-center text-pink-500 shrink-0 border border-pink-500/20">
                        <Instagram size={22} />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold block mb-0.5">FOLLOW INSTAGRAM</span>
                        <p className="text-sm font-black text-white font-sans">Shrikrishna devkar</p>
                        <p className="text-[9px] text-zinc-500">Behind-the-scenes lookbooks & live drops</p>
                      </div>
                    </div>
                    <span className="text-zinc-500 group-hover:text-white transition-all text-xs font-bold font-mono">&rarr;</span>
                  </a>

                  {/* Corporate Mail */}
                  <div className="flex items-center gap-4 p-5 bg-zinc-950 border border-zinc-900 rounded-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-800">
                      <Mail size={20} />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">EMAIL INQUIRIES</span>
                      <p className="text-xs font-bold text-white font-mono">support@devkars.com</p>
                      <p className="text-[9px] text-zinc-650">Expected compliance window: 12-24 hours</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Aesthetic corporate disclaimer row */}
            <div className="border-t border-zinc-905 pt-8 text-center">
              <p className="text-[10px] text-zinc-600 font-mono">
                &copy; {new Date().getFullYear()} DEVKARS PRIVATE LIMITED. ALL RIGHTS REGISTERED UNDER COUTURE TRADE ACT.
              </p>
            </div>

          </motion.div>

        </div>
      )}
      {activeTab === "admin" && currentUser?.role === "admin" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10 text-left">
          
          {/* Main header title area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-8 mb-10 gap-4">
            <div>
              <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase block mb-1">ADMINISTRATIVE CORE CONTROL</span>
              <h1 className="text-4xl font-black uppercase tracking-tight">Dripverse Master Console</h1>
              <p className="text-zinc-500 text-xs mt-1">Manage physical/digital drop trends, evaluate real-time analytics, edit clothing catalogs instantly.</p>
            </div>
            <button
              onClick={fetchAdminMetrics}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xxs tracking-widest uppercase px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer"
            >
              <LayoutGrid size={12} /> Reload Server Metrics
            </button>
          </div>

          {/* SERVER METRICS STATS BLOCKS CARDS */}
          {adminMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                <Users size={16} className="text-zinc-500 mb-2" />
                <p className="text-zinc-500 text-[10px] tracking-wide uppercase font-bold">Total Clients</p>
                <p className="text-2xl font-black font-mono text-zinc-100 mt-1">{adminMetrics.totalUsers}</p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-1 flex items-center gap-1">
                  <ArrowUpRight size={10} className="text-green-500" /> Active Users List
                </p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                <Sparkles size={16} className="text-yellow-500 mb-2" />
                <p className="text-zinc-500 text-[10px] tracking-wide uppercase font-bold">Premium VIPs</p>
                <p className="text-2xl font-black font-mono text-zinc-100 mt-1">{adminMetrics.premiumUsers}</p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-1">Active Subscribers</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                <ShoppingBag size={16} className="text-red-500 mb-2" />
                <p className="text-zinc-500 text-[10px] tracking-wide uppercase font-bold">Designer Pieces</p>
                <p className="text-2xl font-black font-mono text-zinc-100 mt-1">{adminMetrics.totalDesigns}</p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-1">Active Catalogues</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                <Heart size={16} className="text-zinc-400 mb-2" />
                <p className="text-zinc-500 text-[10px] tracking-wide uppercase font-bold">Global Hearts</p>
                <p className="text-2xl font-black font-mono text-zinc-100 mt-1">{adminMetrics.totalLikes}</p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-1">Algorithm Rank</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                <Eye size={16} className="text-rose-500 mb-2" />
                <p className="text-zinc-500 text-[10px] tracking-wide uppercase font-bold">Catalogue Traffic</p>
                <p className="text-2xl font-black font-mono text-zinc-100 mt-1">{adminMetrics.totalViews}</p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-1">Lifetime Views</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                <DollarSign size={16} className="text-green-500 mb-2" />
                <p className="text-zinc-500 text-[10px] tracking-wide uppercase font-bold">Net Earnings</p>
                <p className="text-2xl font-black font-mono text-white mt-1">₹{adminMetrics.subscriptionEarnings}</p>
                <p className="text-[9px] text-green-500 font-semibold mt-1">From Subscriptions</p>
              </div>
            </div>
          )}

          {/* TWO PANEL SPLIT: Creator form left, Catalog table right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: Create design form */}
            <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl">
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-zinc-900">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-200">
                  {editingDesignId ? "Modify Existing Apparel" : "Deploy New Clothing Cut"}
                </h3>
                {editingDesignId && (
                  <button
                    onClick={() => {
                      setEditingDesignId(null);
                      setNewDesignTitle("");
                      setNewDesignCover("");
                      setNewDesignDescription("");
                      setNewDesignTags("");
                      triggerToast("Form editor reset", "info");
                    }}
                    className="text-xxs font-bold text-red-500 uppercase hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Upload form container */}
              <form onSubmit={handleSaveDesignByAdmin} className="space-y-4 text-xs">
                
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Apparel Title Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acid Wash Distressed Jacket"
                    value={newDesignTitle}
                    onChange={(e) => setNewDesignTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none focus:border-red-650"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Category Select *</label>
                    <select
                      value={newDesignCategory}
                      onChange={(e) => setNewDesignCategory(e.target.value)}
                      className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-650"
                    >
                      {CATEGORIES.filter(c => c !== "All").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Designer Label</label>
                    <input
                      type="text"
                      placeholder="e.g. VINTAGE SOULS"
                      value={newDesignerName}
                      onChange={(e) => setNewDesignerName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Previews / Instant Preset helpers */}
                <div className="space-y-3.5 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex justify-between">
                    <span>Apparel Target Image Configuration *</span>
                  </label>
                  
                  {/* Local file uploader section option A */}
                  <div className="p-3 bg-zinc-90 w-full bg-zinc-900/40 rounded-xl border border-zinc-850/60 flex flex-col gap-1.5 hover:border-zinc-750 duration-150">
                    <span className="text-[9px] font-black text-red-500/80 tracking-widest uppercase">OPTION A: UPLOAD LOCAL FILE / PHOTO IMG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdminImageUpload}
                      className="text-[10px] text-zinc-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-zinc-500 tracking-widest uppercase">OPTION B: PASTE INTERNET SECURE LINK URL</span>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newDesignCover}
                      onChange={(e) => setNewDesignCover(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none focus:border-red-650 font-mono text-[10px]"
                    />
                  </div>
                  
                  {/* Visual Preset images helpers */}
                  <div className="pt-2">
                    <p className="text-[9px] font-bold text-zinc-650 mb-1">SELECT PRESET HIGH-FASHION PHOTOS:</p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {PRESET_IMAGE_SUGGESTIONS.map((imgObj) => (
                        <button
                          key={imgObj.name}
                          type="button"
                          onClick={() => {
                            setNewDesignCover(imgObj.url);
                            triggerToast(`Selected ${imgObj.name} preset!`, "info");
                          }}
                          className="flex-shrink-0 border border-zinc-800 hover:border-red-500 rounded p-1 text-[9px] bg-zinc-900 text-zinc-400 font-mono hover:text-white"
                        >
                          {imgObj.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Apparel Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="oversized, streetwear, baggy, vintage, heavy"
                    value={newDesignTags}
                    onChange={(e) => setNewDesignTags(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Coutures / Editorial Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe material heavy weight GSM, fabric treatment, vintage distress wash details..."
                    value={newDesignDescription}
                    onChange={(e) => setNewDesignDescription(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none focus:border-red-650"
                  />
                </div>

                {/* Algorithmic & VIP options checks */}
                <div className="bg-zinc-900 p-4 rounded-xl space-y-3.5 border border-zinc-850">
                  <p className="text-[9px] uppercase tracking-widest font-black text-zinc-550">DYNAMICS CONFIGURATION</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Lock as Premium (subscriber only)</span>
                    <input
                      type="checkbox"
                      checked={isNewDesignPremium}
                      onChange={(e) => setIsNewDesignPremium(e.target.checked)}
                      className="accent-red-600 w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Promote to Trending Algorithm List</span>
                    <input
                      type="checkbox"
                      checked={isNewDesignTrending}
                      onChange={(e) => setIsNewDesignTrending(e.target.checked)}
                      className="accent-red-600 w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Display in Top 10 Weekly VIP Box</span>
                    <input
                      type="checkbox"
                      checked={isNewDesignWeekly}
                      onChange={(e) => setIsNewDesignWeekly(e.target.checked)}
                      className="accent-red-600 w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Include in Monthly VIP Lookbooks</span>
                    <input
                      type="checkbox"
                      checked={isNewDesignMonthly}
                      onChange={(e) => setIsNewDesignMonthly(e.target.checked)}
                      className="accent-red-600 w-4 h-4"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload size={14} /> {editingDesignId ? "Update Configured Apparel" : "Deploy Live Apparel Drop"}
                </button>

              </form>
            </div>

            {/* COLUMN 2: List of curations for management */}
            <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 p-6 sm:p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-200">Deployed Apparels Catalogue ({designs.length})</h3>
                <span className="text-xxs font-mono text-zinc-500">INSTANT DISCOVERY SYNC SYNCED</span>
              </div>

              {/* Table list view */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-400">
                  <thead className="bg-zinc-900 text-zinc-400 text-xxs uppercase tracking-wider font-black">
                    <tr>
                      <th className="px-4 py-3.5 rounded-l-xl">Visual Item</th>
                      <th className="px-4 py-3.5">Apparel Spec</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5 text-center">Badges</th>
                      <th className="px-4 py-3.5 text-right">Metrics</th>
                      <th className="px-4 py-3.5 text-center rounded-r-xl">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-sans">
                    {designs.map((design) => (
                      <tr key={design.id} className="hover:bg-zinc-900/40 transition">
                        
                        <td className="px-4 py-3">
                          <img
                            src={design.image_url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-14 object-cover rounded-md border border-zinc-800"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-white line-clamp-1">{design.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">ID: {design.id}</p>
                        </td>

                        <td className="px-4 py-3 uppercase tracking-wider text-[10px] font-semibold text-zinc-400">
                          {design.category}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 items-center justify-center">
                            {design.is_premium && <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase tracking-widest leading-none">VIP</span>}
                            {design.is_trending && <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-widest leading-none">HOT</span>}
                            {design.is_weekly_top && <span className="bg-zinc-800 text-white text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-wider leading-none">WEEKLY</span>}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <p className="text-zinc-200 font-bold font-mono text-[11px]">{design.views} views</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{design.likes.length} likes</p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleEditDesignSelect(design)}
                              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800 duration-150 cursor-pointer"
                              title="Edit specifications"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteDesignByAdmin(design.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 bg-zinc-900 rounded-lg border border-zinc-800 duration-150 cursor-pointer"
                              title="Delete Design"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* FOOTER BAR */}
      <footer className="h-14 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-900 text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase bg-black relative z-10 w-full gap-2 py-4 sm:py-0 text-center">
        <div>
          DRIPVERSE &copy; 2026 / Premium Streetwear Trend Hub
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-semibold">
          <span className="hover:text-red-500 duration-150 cursor-pointer">Terms of Drop</span>
          <span className="hover:text-red-500 duration-150 cursor-pointer">Privacy Couture</span>
          {currentUser?.role === "admin" ? (
            <button onClick={() => setActiveTab("admin")} className="text-red-600 font-bold uppercase tracking-widest hover:text-white transition">Admin Panel Server Dashboard</button>
          ) : (
            <button onClick={() => { setIsAuthSignUp(false); setShowAuthModal(true); }} className="text-zinc-550 font-bold uppercase tracking-widest hover:text-white transition">Admin Gate</button>
          )}
        </div>
      </footer>


      {/* MODAL 1: STREETWEAR APPAREL DETAIL DESIGN PAGE MODAL */}
      <AnimatePresence>
        {currentDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Blur Lockout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurrentDesign(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Main Interactive Details Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-zinc-950 border border-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
            >
              
              {/* Close button */}
              <button
                onClick={() => setCurrentDesign(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-zinc-850 text-white hover:bg-zinc-900 transition duration-150 duration-200 cursor-pointer"
              >
                <X size={15} />
              </button>

              {/* LEFT SIDE BLOCK: High Resolution Photo Display */}
              <div className="md:col-span-6 bg-zinc-900 relative flex flex-col justify-between overflow-hidden max-h-[45vh] md:max-h-[90vh]">
                
                {/* Responsive Image with zoom capability */}
                <div className="w-full h-full min-h-[300px] relative">
                  <img
                    src={currentDesign.image_url}
                    alt={currentDesign.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Floated model specs details */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/65 backdrop-blur-md rounded-2xl border border-white/5 text-left md:block hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] tracking-widest font-black text-red-550 uppercase">Designer House</span>
                    <span className="text-[9px] font-mono text-zinc-520 uppercase">Drop Registered</span>
                  </div>
                  <div className="flex justify-between items-center bg-transparent">
                    <p className="text-xs font-black text-white">{currentDesign.designer_name}</p>
                    <p className="text-[10px] font-mono text-zinc-300">
                      {new Date(currentDesign.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE BLOCK: Complete Specification Sheet and Comments */}
              <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[90vh] text-left space-y-6">
                
                {/* Specific garment details */}
                <div className="space-y-4">
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-zinc-900 text-zinc-400">
                        {currentDesign.category}
                      </span>
                      {currentDesign.is_premium && (
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                          VIP LOOKBOOK
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tighter leading-tight">
                      {currentDesign.title}
                    </h2>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {currentDesign.description}
                  </p>

                  {/* Dynamic interactive quick actions row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleLikeDesign(currentDesign.id)}
                      className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xxs tracking-widest uppercase font-black tracking-normal transition duration-200 border cursor-pointer ${
                        savedStatus.isLiked
                          ? "bg-red-650 text-white border-red-650"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                      }`}
                    >
                      <Heart size={12} className={savedStatus.isLiked ? "fill-white text-white" : ""} />
                      <span>{currentDesign.likes.length} Public Likes</span>
                    </button>

                    <button
                      onClick={() => handleSaveDesign(currentDesign.id)}
                      className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xxs tracking-widest uppercase font-black transition duration-200 border cursor-pointer ${
                        savedStatus.isSaved
                          ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black border-transparent"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                      }`}
                    >
                      <Bookmark size={12} className={savedStatus.isSaved ? "fill-black" : ""} />
                      <span>{savedStatus.isSaved ? "Saved" : "Save Collection"}</span>
                    </button>

                    <button
                      onClick={() => handleShareDesign(currentDesign)}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white duration-150 cursor-pointer"
                      title="Copy Custom Link"
                    >
                      <Share2 size={13} />
                    </button>

                    <button
                      onClick={() => handleDownloadHD(currentDesign)}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xxs tracking-widest uppercase font-black bg-zinc-920 border border-zinc-800 text-red-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition duration-150 cursor-pointer"
                      title="Download image in HD quality"
                    >
                      <ArrowDownToLine size={12} className="text-red-500 animate-pulse" />
                      <span>Download HD</span>
                    </button>
                  </div>

                  {/* Display tags list capsules */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-550 block mb-2 uppercase">GARMENT TAGS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(new Set(currentDesign.tags)).map((tag, tagIdx) => (
                        <button
                          key={`${tag}-${tagIdx}`}
                          onClick={() => {
                            setSelectedCategory("All");
                            setSearchQuery(tag);
                            setActiveTab("categories");
                            setCurrentDesign(null);
                          }}
                          className="px-2.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-500 hover:text-red-500 transition font-mono border border-zinc-850 hover:border-red-500/10 cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* FEEDBACK COMMENTS COMPARTMENT */}
                <div className="border-t border-zinc-900 pt-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xxs uppercase tracking-widest font-black text-zinc-500 flex items-center gap-2 mb-4">
                      <MessageSquare size={12} /> Public Couture Advice ({comments.length})
                    </h3>

                    {/* Infinite static stack layout */}
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto mb-4 pr-1 scrollbar-thin">
                      {comments.length === 0 ? (
                        <p className="text-xxs font-mono text-zinc-650 tracking-wider">NO COMMENTS RECORDED. DROP AN ADVICE FIRST.</p>
                      ) : (
                        comments.map((commentItem) => (
                          <div key={commentItem.id} className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-900 text-xxs flex items-start gap-3">
                            <img
                              src={commentItem.user_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover mt-0.5"
                            />
                            <div className="space-y-1 text-left">
                              <div className="flex justify-between items-center gap-4">
                                <p className="font-extrabold text-zinc-300">{commentItem.user_name}</p>
                                <span className="text-[9px] text-zinc-600 font-mono">
                                  {new Date(commentItem.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-zinc-400 font-medium leading-normal">{commentItem.comment}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Submission Textbox */}
                  <form onSubmit={handlePostComment} className="relative flex items-center bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-2xl focus-within:border-zinc-700 transition">
                    <input
                      type="text"
                      placeholder="Drop a critique/comment..."
                      value={userCommentText}
                      onChange={(e) => setUserCommentText(e.target.value)}
                      className="bg-transparent border-none text-xxs text-white focus:outline-none focus:ring-0 w-full placeholder-zinc-500"
                    />
                    <button
                      type="submit"
                      disabled={!userCommentText.trim()}
                      className="bg-red-650 text-white font-bold text-[9px] uppercase tracking-widest px-3.5 py-1.5 rounded-lg hover:bg-red-500 disabled:opacity-50 transition duration-150 cursor-pointer"
                    >
                      Submit
                    </button>
                  </form>

                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>


      {/* MODAL 2: INDIAN CHECKOUT SUBSCRIPTION SIMULATOR MODAL (RAZORPAY STYLE) */}
      <AnimatePresence>
        {showSubscriptionModal && selectedPlan && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            
            {/* Dark screen locks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if(!submittingPayment) setShowSubscriptionModal(false); }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Simulated Razorpay window */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="relative bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-20 flex flex-col"
            >
              
              {/* Top branded bar */}
              <div className="bg-gradient-to-r from-red-650 to-rose-700 text-white px-6 py-6 text-left">
                <span className="text-[9px] tracking-widest font-black uppercase bg-black/30 text-white px-2 py-0.5 rounded">
                  RAZORPAY INDIA SECURED
                </span>
                <h3 className="text-lg font-black uppercase mt-2 select-none tracking-tight">DRIPVERSE Checkout</h3>
                <p className="text-[10px] text-white/70">Plan Selected: <strong>{selectedPlan.name}</strong></p>
              </div>

              {/* Central Details and simulator input fields */}
              <div className="p-6 text-xs text-zinc-300 space-y-4 text-left">
                
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">merchant partner details</label>
                  <p className="text-white font-bold uppercase text-xxs tracking-wide">DRIPVERSE / DEVKARS PVT LTD</p>
                </div>

                <div className="space-y-1 pb-2 border-b border-zinc-900 block bg-transparent">
                  <p className="text-[10px] text-zinc-400">Merchant Reference Transaction</p>
                  <div className="flex justify-between items-center bg-transparent pt-1">
                    <span className="text-xxs font-mono text-zinc-500 font-semibold">[ID: 610drip-7xyz]</span>
                    <span className="text-xl font-black font-mono text-red-500">₹{selectedPlan.price}.00</span>
                  </div>
                </div>

                {/* Checkout Method Selector tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900/60 rounded-xl mb-1.5 border border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setCheckoutMethod("upi")}
                    className={`py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                      checkoutMethod === "upi" ? "bg-red-600 text-white shadow-md font-extrabold" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    🇮🇳 UPI QR Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutMethod("card")}
                    className={`py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                      checkoutMethod === "card" ? "bg-red-600 text-white shadow-md font-extrabold" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>

                <form onSubmit={handleRazorpayPaymentSubmit} className="space-y-4 block">
                  {checkoutMethod === "upi" ? (
                    /* UPI METHOD VIEW COMPONENT */
                    <div className="space-y-3.5 pt-1">
                      <div className="space-y-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-900/60 text-center relative overflow-hidden">
                        <div className="absolute top-1.5 right-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase">
                          UPI SECURE
                        </div>
                        <div className="flex flex-col items-center space-y-2 pt-2">
                          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">UPI Scan to Pay</span>
                          
                          {/* Live scannable QR pointing dynamically to shrikrishnadevkar60@oksbi */}
                          <div className="bg-white p-2.5 rounded-2xl border border-zinc-800 shadow-xl inline-block">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=shrikrishnadevkar60@oksbi&pn=Shrikrishna%20Devkar&cu=INR&am=${selectedPlan.price}`)}`}
                              alt="Shrikrishna Devkar UPI QR Code Scanner"
                              className="w-[125px] h-[125px] object-contain pointer-events-none"
                            />
                          </div>

                          <div className="space-y-1 block mt-1.5">
                            <p className="text-[10px] text-zinc-400 font-bold">UPI ID: <span className="text-white font-mono font-extrabold tracking-tight">shrikrishnadevkar60@oksbi</span></p>
                            <p className="text-[9px] text-zinc-500">Payee Name: Shrikrishna Devkar</p>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("shrikrishnadevkar60@oksbi");
                                triggerToast("UPI ID copied successfully!", "success");
                              }}
                              className="bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 text-zinc-300 font-black text-[8px] tracking-widest uppercase px-3 py-1 rounded-full mt-1.5 cursor-pointer inline-flex items-center gap-1.5"
                            >
                              Copy Payment ID
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 text-left pt-3 border-t border-zinc-900/60 mt-1 dark">
                          <label className="text-[9px] text-zinc-400 uppercase tracking-wider block font-black">
                            Enter UPI UTR / Transaction ID (12 Digits) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 348293029103"
                            value={upiUtr}
                            onChange={(e) => setUpiUtr(e.target.value.replace(/[^0-9]/g, ""))}
                            maxLength={12}
                            minLength={6}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 font-mono tracking-widest focus:outline-none focus:border-red-600 block text-xs"
                          />
                          <span className="text-[8px] font-mono text-zinc-500 block leading-tight mt-1.5">
                            Find the 12-digit UTR/TXN number in your payment confirmation inside GPay, Paytm or PhonePe.
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* CARD METHOD VIEW COMPONENT */
                    <div className="space-y-3 pt-1">
                      <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Simulated Debit Card Details</p>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400">Debit / Credit Card Number</label>
                        <input
                          type="text"
                          required
                          value={simulatedCardNumber}
                          onChange={(e) => setSimulatedCardNumber(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 font-mono focus:outline-none focus:border-red-650"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-400">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={simulatedCardExpiry}
                            onChange={(e) => setSimulatedCardExpiry(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-350 font-mono text-center focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-400">Card CVV</label>
                          <input
                            type="password"
                            required
                            value={simulatedCardCVV}
                            onChange={(e) => setSimulatedCardCVV(e.target.value)}
                            className="w-full bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 font-mono text-center focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-850 flex items-start gap-2 text-[10px] text-zinc-450 mt-2">
                    <Info size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p>Verified secured payments routed directly. Premium subscriptions renew on terms matching chosen drop intervals. Backed by Devkars pvt ltd.</p>
                  </div>

                  {/* CTA Action button with loading spinners */}
                  <button
                    type="submit"
                    disabled={submittingPayment}
                    className="w-full bg-red-650 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {submittingPayment ? (
                      <div className="flex items-center gap-1">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Authenticating UPI Gateway...
                      </div>
                    ) : (
                      `Verify & Activate Premium ₹${selectedPlan.price}.00`
                    )}
                  </button>
                </form>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>


      {/* MODAL 3: CREDENTIALS AUTHENTICATION CONTROL DIALOG */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="relative bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-20 p-8"
            >
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white duration-150 cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="text-left space-y-4">
                <div className="space-y-1">
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">DRIPVERSE COUTURE</span>
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                    {isAuthSignUp ? "Create VIP Dossier" : "Access Authorized Dossier"}
                  </h3>
                  <p className="text-zinc-500 text-xs">
                    {isAuthSignUp 
                      ? "Register an authentication key to deploy saves, drop critiques, and participate inside trending structures." 
                      : "Input credentials corresponding to custom presets to retrieve lookbooks instantly."}
                  </p>
                </div>

                {/* Method selector toggle tabs */}
                <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-850 text-[10px] font-black tracking-wider uppercase">
                  <button
                    type="button"
                    onClick={() => setUsePhoneAuth(false)}
                    className={`flex-1 py-2 text-center rounded-lg transition duration-150 cursor-pointer ${!usePhoneAuth ? "bg-red-650 text-white" : "text-zinc-500 hover:text-zinc-350"}`}
                  >
                    Email + Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsePhoneAuth(true)}
                    className={`flex-1 py-2 text-center rounded-lg transition duration-150 cursor-pointer ${usePhoneAuth ? "bg-red-650 text-white" : "text-zinc-500 hover:text-zinc-350"}`}
                  >
                    Phone + SMS OTP
                  </button>
                </div>

                {/* Google Quick Sync Banner Access */}
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Contacting Google OAuth sync protocol...", "info");
                    setTimeout(() => {
                      const googleEmail = isAuthSignUp ? "new_google_user@gmail.com" : "shrikrishnadevkar60@gmail.com";
                      const googleName = isAuthSignUp ? "Google Client" : "Shri Krishna";
                      
                      fetch("/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: googleEmail, name: googleName, mode: "google" })
                      })
                        .then(res => res.json())
                        .then(data => {
                          setCurrentUser(data.user);
                          localStorage.setItem("dripverse_user_email", googleEmail);
                          setShowAuthModal(false);
                          triggerToast(`Successfully authenticated as ${data.user.name} via Google!`, "success");
                        });
                    }, 800);
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-300 font-bold text-xxs tracking-widest uppercase py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 px-4 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-9.1z"/>
                    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.2C3.3 21.4 7.4 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.3 14.2c-.2-.7-.4-1.5-.4-2.2s.2-1.5.4-2.2V6.6H1.3C.5 8.2 0 10.1 0 12s.5 3.8 1.3 5.4l4-3.2z"/>
                    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.3 15.2.5 12 .5 7.4.5 3.3 3.1 1.3 7.1l4 3.2c.9-2.9 3.6-5.5 6.7-5.5z"/>
                  </svg>
                  <span>Use Google Authentication</span>
                </button>

                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 h-[1px] bg-zinc-900" />
                  <span className="text-[9px] font-bold text-zinc-650 uppercase">Or Choose Traditional Credentials</span>
                  <div className="flex-1 h-[1px] bg-zinc-900" />
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  
                  {isAuthSignUp && (
                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">First and Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. SHRI KRISHNA"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-red-650"
                      />
                    </div>
                  )}

                  {!usePhoneAuth ? (
                    <>
                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Authentic Profile Reference Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. clients@gmail.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-red-650"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Secret Password Code</label>
                        <input
                          type="password"
                          placeholder="••••••••••••••••"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Contact Mobile Phone Number *</label>
                        <div className="flex gap-2">
                          <span className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-zinc-400 font-mono text-center flex items-center justify-center font-bold text-xs select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={authPhone}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "");
                              setAuthPhone(v);
                            }}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-red-650 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Verify SMS OTP Code</label>
                          <button
                            type="button"
                            onClick={() => {
                              if (!authPhone || authPhone.length < 10) {
                                triggerToast("Please enter a 10 digit Indian Phone number first!", "error");
                                return;
                              }
                              triggerToast("Verification code generated! Auto-typing otp (303030)", "success");
                              setAuthCode("303030");
                            }}
                            className="text-[9px] font-black tracking-widest text-red-550 uppercase hover:text-white transition cursor-pointer"
                          >
                            Send OTP Code
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Simulation: Type 303030 or 123456"
                          value={authCode}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "");
                            setAuthCode(v);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-250 text-center font-mono tracking-[0.3em] text-xs focus:outline-none focus:border-red-650"
                        />
                      </div>
                    </>
                  )}

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    className="w-full bg-red-650 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 mt-2 cursor-pointer"
                  >
                    {isAuthSignUp ? "Deploy Brand New Account" : "Access Core Client Server"}
                  </button>

                </form>

                {/* Preset shortcuts specifically designed for streamlined preview and testing */}
                <div className="pt-4 border-t border-zinc-900 space-y-3">
                  <p className="text-[9px] font-black tracking-wider uppercase text-zinc-650 text-center">Fast-Track Test Credentials (No configuration needed)</p>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={triggerQuickAdminLogin}
                      className="bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] font-black tracking-widest uppercase py-3 rounded-xl hover:bg-red-950/40 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck size={11} /> Admin Presets
                    </button>
                    <button
                      onClick={() => {
                        setAuthEmail("shrikrishnadevkar60@gmail.com");
                        setAuthName("Shri Krishna");
                        setIsAuthSignUp(false);
                        fetch("/api/auth/login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: "shrikrishnadevkar60@gmail.com" })
                        })
                          .then(res => res.json())
                          .then(data => {
                            setCurrentUser(data.user);
                            localStorage.setItem("dripverse_user_email", "shrikrishnadevkar60@gmail.com");
                            setShowAuthModal(false);
                            triggerToast("Welcome back, Shri Krishna!", "success");
                          });
                      }}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] py-3 rounded-xl hover:bg-zinc-850 hover:text-white transition duration-200 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Test VIP Client
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setIsAuthSignUp(!isAuthSignUp)}
                      className="text-xxs text-zinc-550 uppercase tracking-widest font-bold hover:text-white transition"
                    >
                      {isAuthSignUp ? "Already a designer client? Login &rarr;" : "New to DRIPVERSE? Create credentials &rarr;"}
                    </button>
                  </div>
                </div>

              </div>
              
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* FLOAT NOTIFICATION TOAST NOTIFIER SYSTEM */}
      <div className="fixed bottom-6 left-6 z-55 max-w-sm space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4.5 py-3 rounded-2xl border text-xxs font-bold uppercase tracking-wider relative shadow-2xl ${
              toast.type === "success" 
                ? "bg-black text-green-400 border-green-900/40" 
                : toast.type === "error" 
                  ? "bg-black text-red-500 border-red-950/40" 
                  : "bg-black text-zinc-300 border-zinc-800"
            }`}
          >
            {toast.type === "success" && <Check size={12} className="text-green-500" />}
            {toast.type === "error" && <AlertCircle size={12} className="text-red-500 mr-0.5 animate-bounce" />}
            {toast.type === "info" && <Info size={12} className="text-yellow-500" />}
            
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
