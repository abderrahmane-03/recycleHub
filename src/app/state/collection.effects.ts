import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap,tap, exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CollectionActions from './collection.actions';
import { CollectionService } from '../services/collection.service';

@Injectable()
export class CollectionEffects {
  loadRequests$;
  addRequest$;

  constructor(
    private actions$: Actions,
    private collectionService: CollectionService
  ) {
    this.loadRequests$ = createEffect(() =>
      this.actions$.pipe(
    ofType(CollectionActions.loadRequests),
    tap(() => console.log('Effect: Load Requests Action Dispatched')),
    exhaustMap(() => this.collectionService.getAllRequests().pipe(
      tap(requests => console.log('Effect: Data Fetched', requests)),
          map(requests => CollectionActions.loadRequestsSuccess({ requests })),
          catchError(error => of(CollectionActions.loadRequestsFailure({ error })))
        ))
      )
    );

    this.addRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CollectionActions.addRequest),
        mergeMap(({ request }) => this.collectionService.createRequest(request).pipe(
          map(() => CollectionActions.addRequestSuccess({ request })),
          catchError(error => of(CollectionActions.addRequestFailure({ error })))
        ))
      )
    );
  }
}
