
import { SocialPlatform } from './types';

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'ig-square',
    name: 'Instagram',
    type: 'Square Post',
    aspectRatio: '1:1',
    dimensions: '1080 x 1080 px',
    icon: 'fa-brands fa-instagram',
    description: 'The standard square format for the main feed.'
  },
  {
    id: 'ig-portrait',
    name: 'Instagram',
    type: 'Portrait Post',
    aspectRatio: '3:4', // Closest to 4:5 (1080x1350)
    dimensions: '1080 x 1350 px',
    icon: 'fa-solid fa-expand',
    description: 'Taller feed posts for better visibility on mobile.'
  },
  {
    id: 'ig-story',
    name: 'Instagram',
    type: 'Story / Reel',
    aspectRatio: '9:16',
    dimensions: '1080 x 1920 px',
    icon: 'fa-solid fa-mobile-screen',
    description: 'Vertical format for full-screen immersive content.'
  },
  {
    id: 'fb-cover',
    name: 'Facebook',
    type: 'Page Cover',
    aspectRatio: '16:9',
    dimensions: '851 x 315 px',
    icon: 'fa-brands fa-facebook',
    description: 'Wide banner for your profile or page header.'
  },
  {
    id: 'fb-post',
    name: 'Facebook',
    type: 'Feed Post',
    aspectRatio: '16:9', // Landscape
    dimensions: '1200 x 630 px',
    icon: 'fa-solid fa-image',
    description: 'Standard landscape post for the Facebook feed.'
  },
  {
    id: 'tw-header',
    name: 'X (Twitter)',
    type: 'Header Banner',
    aspectRatio: '16:9', // Closest to 3:1 (1500x500)
    dimensions: '1500 x 500 px',
    icon: 'fa-brands fa-x-twitter',
    description: 'The wide horizontal banner at the top of your profile.'
  },
  {
    id: 'tw-post',
    name: 'X (Twitter)',
    type: 'In-Stream Post',
    aspectRatio: '16:9',
    dimensions: '1600 x 900 px',
    icon: 'fa-solid fa-bolt',
    description: 'Optimized post size for the X timeline.'
  },
  {
    id: 'yt-thumbnail',
    name: 'YouTube',
    type: 'Thumbnail',
    aspectRatio: '16:9',
    dimensions: '1280 x 720 px',
    icon: 'fa-brands fa-youtube',
    description: 'Catchy visuals for your video clicks.'
  },
  {
    id: 'yt-banner',
    name: 'YouTube',
    type: 'Channel Banner',
    aspectRatio: '16:9',
    dimensions: '2560 x 1440 px',
    icon: 'fa-solid fa-tv',
    description: 'High-res artwork for your channel header.'
  },
  {
    id: 'li-banner',
    name: 'LinkedIn',
    type: 'Profile Banner',
    aspectRatio: '16:9', // Closest to 4:1
    dimensions: '1584 x 396 px',
    icon: 'fa-brands fa-linkedin',
    description: 'Professional header for your personal profile.'
  },
  {
    id: 'tk-video',
    name: 'TikTok',
    type: 'Native Video',
    aspectRatio: '9:16',
    dimensions: '1080 x 1920 px',
    icon: 'fa-brands fa-tiktok',
    description: 'Full-screen vertical videos for FYP.'
  },
  {
    id: 'pin-standard',
    name: 'Pinterest',
    type: 'Standard Pin',
    aspectRatio: '3:4',
    dimensions: '1000 x 1500 px',
    icon: 'fa-brands fa-pinterest',
    description: 'High-performing tall format for Pinterest.'
  }
];
