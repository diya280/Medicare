import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';



@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [CommonModule,  ],
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthServiceService,
              private dialog: MatDialog,
  ) { }


  ngOnInit() {
    this.getLoginUser();
  }

  loginUserData: any;

  getLoginUser() {
    this.authService.getLoginUser().subscribe((res: any) => {
      if(res.status === 'Success'){
      this.loginUserData = res.data;
      }
    }, (err: any) => {
      console.error('getting error at getLoginUser', err)
    })
  }

    openProfileModal() {
      this.dialog.open(ProfileComponent);
    }



}
