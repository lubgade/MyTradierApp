import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { SelectaccountComponent } from './components/selectaccount/selectaccount.component';
import { AccountService } from './services/account.service';
import { DataService } from './services/data.service';
import { SharedataService } from './services/sharedata.service';
import { ArraysortPipe } from './pipes/arraysort.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { DialogComponent } from './components/dialog/dialog.component';
import { SelectedPositionComponent } from './components/selected-position/selected-position.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'confirm', 
  component: ConfirmComponent
  },
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', 
  component: DashboardComponent, 
  canActivate: [AuthGuard]
},
  {path: 'profile', 
  component: ProfileComponent,
  canActivate: [AuthGuard]
},
{path: 'accounts',
 component: AccountsComponent,
 canActivate: [AuthGuard]
},
{path: 'account/:name', 
component: SelectaccountComponent
},
{
  path: 'position',
  component: SelectedPositionComponent
}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ConfirmComponent,
    AccountsComponent,
    SelectaccountComponent,
    ArraysortPipe,
    DropdownDirective,
    DialogComponent,
    SelectedPositionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [ValidateService, AuthService, AuthGuard, AccountService, DataService, SharedataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
