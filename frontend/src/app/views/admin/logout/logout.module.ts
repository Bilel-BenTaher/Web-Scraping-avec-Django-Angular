import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutRoutingModule } from './logout-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    LogoutRoutingModule,
    HttpClientModule
  ]
})
export class LogoutModule { }
