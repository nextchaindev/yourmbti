export interface KakaoUser {
  id: number;
  profile_nickname?: string;
  properties?: {
    nickname: string;
  };
  profile_thumbnail_image?: string;
  // ... other properties
}