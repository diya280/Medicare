import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from 'src/app/authentication/signin/signin.component';
import { SignupComponent } from 'src/app/authentication/signup/signup.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private dialog: MatDialog) {}

  openLoginModal() {
    this.dialog.open(SigninComponent);
  }

  openSignupModal() {
    this.dialog.open(SignupComponent);
  }
}
