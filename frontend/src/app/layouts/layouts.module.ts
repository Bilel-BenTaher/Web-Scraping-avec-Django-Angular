import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [
    UserLayoutComponent,
    FrontLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class LayoutsModule { }
