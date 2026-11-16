import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    SigninComponent, SignupComponent, ForgetPasswordComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [SigninComponent, SignupComponent, ForgetPasswordComponent],
  providers: [],
})



export class AuthenticationModule { }