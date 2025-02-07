export interface CollectionRequest {



  id: string; // Unique ID for the request
  userId: string; // ID of the user who created the request
  realWeight?: number;
  validationPhotos?: string[];
  wasteTypes: string[]; // Types of waste (e.g., ['plastique', 'verre'])
  photos?: string[]; // Optional base64-encoded photos
  estimatedWeight: number; // Estimated weight in grams (min 1000g)
  collectionAddress: string; // Address for collection
  collectionDate: string; // Date of collection (ISO format)
  collectionTime: string; // Time slot (e.g., '09:00-10:00')
  notes?: string; // Optional notes
  status: string; // Request status
}

