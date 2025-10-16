// my interface

export interface Customer {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
inscriptions: string;
  date_start: number;
  date_end: number;
}

 export interface ArticAPIResponse {
  data: {
    id: number;
    title: string;
    place_of_origin?: string;
    artist_display?: string;
    inscriptions: string;
    date_start?: number;
    date_end?: number;
  }[];
}
