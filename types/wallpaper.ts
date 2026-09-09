export type Category = 'desktop' | 'mobile';

export interface Wallpaper {
  id: string;
  name: string | null;
  category: Category;
  r2_key: string;
  created_at: string;
}

export interface UploadResult {
  success: boolean;
  wallpaper?: Wallpaper;
  error?: string;
}
