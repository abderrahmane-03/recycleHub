// src/app/state/collection.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './collection.state';

const selectCollectionState = createFeatureSelector<CollectionState>('collection');

export const selectAllRequests = createSelector(
  selectCollectionState,
  (state) => state.requests
);

export const selectUserRequests = (userId: string) =>
  createSelector(
    selectAllRequests,
    (requests) => requests.filter(req => req.userId === userId)
  );
