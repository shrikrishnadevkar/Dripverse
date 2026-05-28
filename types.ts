/**
 * DRIPVERSE Type Definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  premium_plan: 'none' | 'weekly' | 'monthly' | 'yearly';
  premium_expiry?: string;
  created_at: string;
  role: 'user' | 'admin';
}

export interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  tags: string[];
  description: string;
  is_premium: boolean;
  is_trending: boolean;
  is_weekly_top: boolean;
  is_monthly_top: boolean;
  likes: string[]; // User IDs who liked this design
  views: number;
  uploaded_by: string; // "admin" or designer id
  designer_name: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_image?: string;
  design_id: string;
  comment: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'weekly' | 'monthly' | 'yearly';
  payment_id: string;
  amount: number;
  created_at: string;
  expiry_date: string;
}

export interface SavedDesign {
  id: string;
  user_id: string;
  design_id: string;
  created_at: string;
}

export interface ViewLog {
  user_id?: string;
  design_id: string;
  timestamp: string;
}
