// src/app/state/collection.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { CollectionState, initialState } from './collection.state';
import * as CollectionActions from './collection.actions';

export const collectionReducer = createReducer(
  initialState,
  on(CollectionActions.loadRequests, (state) => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.loadRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests: requests,
    error: null
  })),
  on(CollectionActions.addRequest, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request]
  })),
  on(CollectionActions.updateRequestStatus, (state, { requestId, status }) => ({
    ...state,
    requests: state.requests.map(req =>
      req.id === requestId ? { ...req, status } : req
    )
  }))
);
