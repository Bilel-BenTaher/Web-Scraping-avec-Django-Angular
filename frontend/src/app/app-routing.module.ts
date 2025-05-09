import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontLayoutComponent } from './layouts/front-layout/front-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

const routes: Routes = [
  { 
    path: '',component: FrontLayoutComponent,
    children: [
      {path: 'home', loadChildren: () => import('./views/front/home/home.module').then(m => m.HomeModule)},
      {path: 'contact', loadChildren: () => import('./views/front/contact/contact.module').then(m => m.ContactModule)},
      {path: 'about', loadChildren: () => import('./views/front/about/about.module').then(m => m.AboutModule)},
      {path: 'login', loadChildren: () => import('./views/front/login/login.module').then(m => m.LoginModule)},
      {path: 'sign-up', loadChildren: () => import('./views/front/sign-in/sign-in.module').then(m => m.SignInModule)},
    ]
  },
  { 
    path: 'user', 
    component: UserLayoutComponent 
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
