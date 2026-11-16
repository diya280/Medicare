import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { MedicalareaComponent } from '../medicalarea/medicalarea.component';
import { UserareaComponent } from '../userarea/userarea.component';




@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {

  constructor(private authService: AuthServiceService,
    private dialog: MatDialog,) { }

  selectedTab: string = 'Medical';
  searchTextMedical: string = '';
  searchTextUser: string = '';
  filteredMedicalData: any[] = [];
  filteredUserData: any[] = [];
  medicalDetails: any[] = [];
  userDetails: any[] = [];


  ngOnInit(): void {
    this.getAllMedical();
    this.getAllUser();
  }

  onSelectedTab(tab: any) {
    this.selectedTab = tab;
    if (this.selectedTab === 'Medical') {
      this.getAllMedical();
    } else {
      this.getAllUser();
    }
  }

  getAllMedical() {
    const data = {
      role: 'medical'
    }
    this.authService.getDataByRole(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.medicalDetails = res.data;
        this.filteredMedicalData = [... this.medicalDetails]
      }
    }, (err: any) => {
      console.error('error getting at getAllMedical', err)
    })
  }

  getAllUser() {
    const data = {
      role: 'user'
    }
    this.authService.getDataByRole(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.userDetails = res.data;
        this.filteredUserData = [...this.userDetails]
      }
    }, (err: any) => {
      console.error('error getting at getAllUser', err)
    })
  }

  onSearchMedical() {
    const searchTerm = this.searchTextMedical.toLowerCase();

    this.filteredMedicalData = this.medicalDetails.filter((med: any) =>
      med.medicalName.toLowerCase().includes(searchTerm)
    );

  }

  onSearchUser() {
    const searchTerm = this.searchTextUser.toLowerCase();
    this.filteredUserData = this.userDetails.filter((user: any) =>
      user.fullName.toLowerCase().includes(searchTerm)
    );
  }


  openMedicalDetails(data: any) {
    this.dialog.open(MedicalareaComponent, { data: data })
  }


  openUserDetails(data: any) {
    this.dialog.open(UserareaComponent, { data: data })
  }



}
