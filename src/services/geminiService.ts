export interface Writer {
  name: string;
  era: string; 
  description: string;
  biography: string;
  representativeWork: string;
  quotes: string[];
  locationContext: string;
  books: { title: string; info: string }[];
}

export async function searchWritersByLocation(location: string): Promise<Writer[]> {
  try {
    const response = await fetch(`/api/search?location=${encodeURIComponent(location)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch from server");
    }
    return await response.json();
  } catch (error) {
    console.error("Client fetch error:", error);
    throw error;
  }
}
