import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { collectionReducer } from './state/collection.reducer';
import { CollectionEffects } from './state/collection.effects';
import { RequestsResolver } from './resolvers/requests.resolver';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    RequestsResolver,
    provideRouter(routes),
    provideStore({ collection: collectionReducer }),
    provideEffects([CollectionEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ]
};
