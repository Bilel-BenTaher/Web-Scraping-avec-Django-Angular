import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AddRoutingModule } from './add-routing.module';
import { AddComponent } from './add/add.component';

@NgModule({
  declarations: [
    AddComponent
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AddModule { }