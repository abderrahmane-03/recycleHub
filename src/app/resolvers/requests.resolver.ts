// src/app/resolvers/requests.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store, select } from '@ngrx/store'; // Import 'select' here
import { Observable, of } from 'rxjs';
import { loadRequests } from '../state/collection.actions';
import { selectAllRequests } from '../state/collection.selectors';
import { filter, take, map} from 'rxjs/operators'; // Import RxJS operators
import { timeout, catchError} from 'rxjs/operators';

// requests.resolver.ts
@Injectable()
export class RequestsResolver implements Resolve<boolean> {
  constructor(private store: Store) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(loadRequests());

    return this.store.pipe(
      select(selectAllRequests),
      timeout(2000),
      filter(requests => requests.length > 0 || !requests.length),
      take(1),
      map(requests => !!requests.length), 
      catchError(() => of(false))
    );
  }
}
