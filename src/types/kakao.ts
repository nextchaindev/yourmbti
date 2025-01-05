/**
 * Kakao API Type Definitions
 * Contains type definitions for Kakao user data
 */

// Interface defining the structure of a Kakao user
export interface KakaoUser {
  id: number;                         // Unique identifier for the user
  profile_nickname?: string;          // User's nickname from profile
  properties?: {                      // Additional user properties
    nickname: string;                 // User's nickname
  };
  profile_thumbnail_image?: string;   // URL of user's thumbnail image
  // ... other properties
}