import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { CollectionRequestComponent } from './pages/collecte/request/request.component';
import { CollectionListComponent } from './pages/collecte/list/collecte-list/collecte-list.component';
import { EditRequestComponent } from './pages/collecte/edit-request/edit-request.component';
import { CollectorDashboardComponent } from './pages/dashboard/collector/collector.component';
import { PointsComponent } from './pages/collecte/convertpoints/convertpoints.component';
export const routes: Routes = [
  { path: 'edit-request/:id',
     component: EditRequestComponent
    },
  { path: 'collection-request',
     component: CollectionRequestComponent
    },
  { path: 'collection-list',
     component: CollectionListComponent
     },
     { path: 'collectiorDashboard',
      component: CollectorDashboardComponent
      },

      { path: 'convertpoints', component: PointsComponent },
          {
    path:'',
  component: HomeComponent,
  },
  {
      path:'login',
      component: LoginComponent,
    },
  {
    path:'register',
    component: RegisterComponent,
     },
  {
      path:'profile',
      component: ProfileComponent,
    },


];
