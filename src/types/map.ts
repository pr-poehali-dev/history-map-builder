export type TimeUnit = 'day' | 'month' | 'year' | 'decade' | '50years' | 'century';

export type MapObject = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  info: string;
  activeFrom: number;
  activeTo: number;
  color?: string;
  image?: string;
  imageCaption?: string;
  customDate?: string;
};

export type Event = {
  id: string;
  date: number;
  title: string;
  description: string;
  category: string;
  objectId?: string | string[];
  image?: string;
};

export type MapInfo = {
  id: string;
  name: string;
  period: string;
  minYear: number;
  maxYear: number;
  image: string;
  description?: string;
};