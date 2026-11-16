import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { DashboardAreaModule } from './dashboard_area/dashboard_area.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    DashboardAreaModule,
    AuthenticationModule,
    ProfileComponent,
    HeaderComponent,
    NgbModule, HttpClientModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
