import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { FrontLayoutComponent } from './front-layout/front-layout.component';



@NgModule({
  declarations: [
    UserLayoutComponent,
    FrontLayoutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LayoutsModule { }
