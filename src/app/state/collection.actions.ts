// src/app/state/collection.actions.ts
import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../models/collection-request.model';

export const loadRequests = createAction('[Collection] Load Requests');
export const loadRequestsSuccess = createAction(
  '[Collection] Load Requests Success',
  props<{ requests: CollectionRequest[] }>()
);
export const addRequest = createAction(
  '[Collection] Add Request',
  props<{ request: CollectionRequest }>()
);
export const updateRequestStatus = createAction(
  '[Collection] Update Status',
  props<{ requestId: string; status: string }>()
);
// collection.actions.ts
export const loadRequestsFailure = createAction(
  '[Collection] Load Requests Failure',
  props<{ error: any }>()
);

export const addRequestSuccess = createAction(
  '[Collection] Add Request Success',
  props<{ request: CollectionRequest }>()
);

export const addRequestFailure = createAction(
  '[Collection] Add Request Failure',
  props<{ error: any }>()
);
export const deleteRequest = createAction(
  '[Collection] Delete Request',
  props<{ requestId: string }>()
);
export const deleteRequestSuccess = createAction(
  '[Collection] Delete Request Success',
  props<{ requestId: string }>()
);
export const deleteRequestFailure = createAction(
  '[Collection] Delete Request Failure',
  props<{ error: any }>()
);
export const updateRequest = createAction(
  '[Collection] Update Request',
  props<{ requestId: string; updates: Partial<CollectionRequest> }>()
);
export const updateRequestSuccess = createAction(
  '[Collection] Update Request Success',
  props<{ request: CollectionRequest }>()
);
export const updateRequestFailure = createAction(
  '[Collection] Update Request Failure',
  props<{ error: any }>()
);

