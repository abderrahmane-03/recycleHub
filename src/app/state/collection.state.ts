
import { CollectionRequest } from '../models/collection-request.model';

export interface CollectionState {
  requests: CollectionRequest[];
  loading: boolean;
  error: string | null;
}

export const initialState: CollectionState = {
  requests: [],
  loading: false,
  error: null
};
