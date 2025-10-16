// connect with the backend
import type { ArticAPIResponse } from "../types/Customer";

export const CustomerService = {
  async getCustomersMedium(page = 1) {
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const data: ArticAPIResponse = await response.json();

      return data.data.map((item) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin || 'Unknown',
        artist_display: item.artist_display || 'Unknown',
        inscriptions: item.inscriptions || '',
        date_start: item.date_start || 0,
        date_end: item.date_end || 0
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
};
