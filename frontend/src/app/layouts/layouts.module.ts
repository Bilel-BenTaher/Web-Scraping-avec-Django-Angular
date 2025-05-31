import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule,} from '@angular/router';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';



@NgModule({
  declarations: [
    UserLayoutComponent,
    FrontLayoutComponent,
    NewsletterComponent,
    NotificationSettingsComponent,
    AdminLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
   
    
  ]
})
export class LayoutsModule { }
