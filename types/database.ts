export type Language = 'en' | 'bn';

export interface Profile {
  id: string;
  name_en: string;
  name_bn: string;
  bio_en: string;
  bio_bn: string;
  interests_en: string[];
  interests_bn: string[];
  profile_image: string;
  creative_name: string;
  current_focus_en?: string;
  current_focus_bn?: string;
  updated_at?: string;
}

export interface Memory {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  image_url: string;
  category: 'Life' | 'Friends' | 'Travel' | 'Special Moments' | 'Work' | 'CrypticX' | 'Other';
  memory_date: string;
  location?: string;
  created_at?: string;
}

export interface Album {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  cover_image: string;
  created_at?: string;
  photos_count?: number;
}

export interface AlbumPhoto {
  id: string;
  album_id: string;
  image_url: string;
  caption_en?: string;
  caption_bn?: string;
  photo_date?: string;
  sort_order: number;
}

export interface JourneyItem {
  id: string;
  year: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  image_url?: string;
  location?: string;
  link?: string;
  sort_order: number;
}

export interface Project {
  id: string;
  name: string;
  description_en: string;
  description_bn: string;
  technology: string[];
  image_url: string;
  project_url?: string;
  project_date?: string;
  is_crypticx: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
}
