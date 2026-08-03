import {
  IconBrandFacebookFilled, IconBrandInstagramFilled, IconBrandYoutubeFilled,
  IconBrandTiktokFilled, IconBrandTwitterFilled, IconBrandLinkedinFilled,
  IconBrandPinterestFilled, IconClockFilled
} from '@tabler/icons-react';

export const PLATFORMS = [
  { id: 'facebook',  name: 'Facebook',  icon: IconBrandFacebookFilled,  color: '#1877F2', bg: '#E8F0FE' },
  { id: 'instagram', name: 'Instagram', icon: IconBrandInstagramFilled, color: '#E4405F', bg: '#FDE8EC' },
  { id: 'youtube',   name: 'YouTube',   icon: IconBrandYoutubeFilled,   color: '#FF0000', bg: '#FFE8E8' },
  { id: 'tiktok',    name: 'TikTok',    icon: IconBrandTiktokFilled,    color: '#010101', bg: '#F0F0F0' },
  { id: 'twitter',   name: 'X',         icon: IconBrandTwitterFilled,   color: '#1DA1F2', bg: '#E8F5FD' },
  { id: 'linkedin',  name: 'LinkedIn',  icon: IconBrandLinkedinFilled,  color: '#0A66C2', bg: '#E8F0FB' },
  { id: 'pinterest', name: 'Pinterest', icon: IconBrandPinterestFilled, color: '#E60023', bg: '#FDEAEA' },
];

export const SCHEDULED_ICON = IconClockFilled;

export const FILTER_CATEGORIES = [
  { id: 'facebook',  label: 'Facebook',  color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000' },
  { id: 'tiktok',    label: 'TikTok',    color: '#010101' },
  { id: 'twitter',   label: 'X / Twitter', color: '#1DA1F2' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2' },
  { id: 'pinterest', label: 'Pinterest', color: '#E60023' },
];

export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_HEADER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MAX_CAPTION = 280;
