import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/dashboard/home/home.component';

export const routes: Routes = [

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
