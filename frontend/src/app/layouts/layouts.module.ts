import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { RouterModule,} from '@angular/router';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserLayoutComponent,
    FrontLayoutComponent,
    NewsletterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
   
    
  ]
})
export class LayoutsModule { }
