export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  roll_number?: string;
  role: UserRole;
  is_security_officer?: boolean;
  can_switch_views?: boolean;
  created_at: string;
}

export type ItemCategory =
  | 'Electronics'
  | 'IDs & Cards'
  | 'Keys'
  | 'Bags & Wallets'
  | 'Accessories'
  | 'Books & Notes'
  | 'Clothing'
  | 'Other'
  | (string & {});

export type ItemStatus =
  | 'LOST'
  | 'IN_CUSTODY'
  | 'MATCHED'
  | 'VERIFIED'
  | 'RETURNED';

export interface CampusZone {
  id: number;
  name: string;
  building: string;
  floor?: string;
  room_number?: string;
  active_reports_count?: number;
}

export interface LostItem {
  id: string;
  user_id: string;
  title: string;
  category: ItemCategory;
  brand?: string;
  color?: string;
  description: string;
  secret_details?: string;
  location_id: number;
  location_name?: string;
  lost_timestamp: string;
  status: ItemStatus;
  image_url?: string;
  created_at: string;
  matches_count?: number;
}

export interface FoundItem {
  id: string;
  title: string;
  category: ItemCategory;
  location_id: number;
  location_name?: string;
  storage_locker_bin?: string;
  found_timestamp: string;
  status: ItemStatus;
  primary_image_url?: string;
  description: string;
  created_at: string;
}

export interface MatchScoreBreakdown {
  text_score: number;       // 0 to 1
  image_score: number;      // 0 to 1
  spatial_score: number;    // 0 to 1
  temporal_score: number;   // 0 to 1
}

export type MatchStatus = 'SUGGESTED' | 'NOTIFIED' | 'CLAIMED' | 'VERIFIED' | 'RETURNED' | 'REJECTED';

export interface MatchCandidate {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  composite_score: number;  // 0 to 100
  breakdown: MatchScoreBreakdown;
  match_status: MatchStatus;
  created_at: string;
  found_item?: FoundItem;
  lost_item?: LostItem;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
  type?: 'match' | 'claim' | 'system';
}

export interface ClaimRecord {
  id: string;
  match_id: string;
  student_id: string;
  proof_description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  handover_otp?: string;
  handover_qr_token?: string;
  reviewed_by_id?: string;
  created_at: string;
}

export interface ReturnedItem {
  id: string;
  title: string;
  category: ItemCategory;
  description?: string;
  image_url?: string;
  location_name?: string;
  storage_locker_bin?: string;
  owner_name: string;
  owner_roll?: string;
  owner_email?: string;
  returned_timestamp: string;
  returned_date: string;
  returned_time: string;
  handed_over_by?: string;
  proof_description?: string;
}
