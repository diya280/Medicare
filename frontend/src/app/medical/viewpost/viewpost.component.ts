import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddpostComponent } from '../addpost/addpost.component';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/service/shared.service';




@Component({
  selector: 'app-viewpost',
  templateUrl: './viewpost.component.html',
  styleUrls: ['./viewpost.component.scss']
})
export class ViewpostComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private sharedService: SharedService,
    private authService: AuthServiceService) {
    setTimeout(() => {
      this.getCallAfterAddMedicine();
    }, 2000)
  }

  subscription!: Subscription;

  getCallAfterAddMedicine() {
    this.subscription = this.sharedService.myData$.subscribe((data) => {
      if (data && data.Active === null) {
        this.isButtonDisplayAtMiddle = true;
        return;
      } else if (data && data.Active === true) {
        this.getMedicineDetails();

      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openAddPostModal() {
    this.dialog.open(AddpostComponent);
  }

  userDetails: any;
  medicineData: any;
  myPosts: any[] = [];
  othersPosts: any[] = [];
  filteredMedicineData: any[] = [];
  selectedTab: string = 'mine';
  isButtonDisplayAtMiddle: boolean = false;



  onSelectedTab(tab: any) {
    this.selectedTab = tab
  }

  ngOnInit(): void {
    this.getLoginUser();
  }

  getLoginUser() {
    this.authService.getLoginUser().subscribe((res: any) => {
      this.userDetails = res.data;
      setTimeout(() => {
        this.getMedicineDetails();
        this.getCartDetailsById();
      }, 100)
    })
  }


  getMedicineDetails() {
    const data = {
      userId: this.userDetails._id
    }
    this.authService.getMedicineDetails(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.medicineData = res.data;
        // .map((item: any) => {
        //   item.images = item.photos.map((img: any) => ({
        //     fullUrl: this.BASE_URL + img.url
        //   }));
        //   return item;
        // });
        this.filteredMedicineData = [...this.medicineData];
        this.isButtonDisplayAtMiddle = false;
      } else {
        this.isButtonDisplayAtMiddle = true;
      }
    }, (err: any) => {
      console.error('error at getting getMedicineDetails', err)
    })
  }


  defaultImage = 'assets/medicare_logo/medicine.png';

  onImgError(event: any) {
    event.target.src = this.defaultImage;
  }


  expandedDesc: { [key: number]: boolean } = {};

  toggleDescription(i: number) {
    this.expandedDesc[i] = !this.expandedDesc[i];
  }

  getShortText(desc: string): string {
    if (!desc) return '';
    const words = desc.trim().split(/\s+/);
    return words.length > 6 ? words.slice(0, 6).join(' ') + '...' : desc;
  }



  isDescriptionLong(desc: string): boolean {
    if (!desc) return false;
    return desc.trim().split(/\s+/).length > 6;
  }


  selectedMedicine: any;
  isOpenViewDetails: boolean = false;

  viewDetails(data: any) {
    this.selectedMedicine = data;
    this.isOpenViewDetails = true;
  }


  closeViewDetails() {
    this.isOpenViewDetails = false;
  }

  showFullImage: boolean = false;
  selectedImage: string | null = null;

  openFullImage(img: string) {
    this.selectedImage = img;
    this.showFullImage = true;
  }

  closeFullImage() {
    this.showFullImage = false;
    this.selectedImage = null;
  }

  isEditMode = false;
  editableMedicine: any = {};

  editDetails() {
    this.isEditMode = true;
    this.editableMedicine = {
      quantityInStock: this.selectedMedicine.quantityInStock,
      availableToDispatch: this.selectedMedicine.availableToDispatch
    };
  }

  cancelUpdate() {
    this.isEditMode = false;
  }

  saveUpdatedDetails() {
    const updatedData = {
      recordId: this.selectedMedicine._id,
      quantityInStock: this.editableMedicine.quantityInStock,
      availableToDispatch: this.editableMedicine.availableToDispatch
    };
    this.authService.updateMedicine(updatedData).subscribe({
      next: (res: any) => {
        alert("Updated Successfully!");
        this.selectedMedicine.quantityInStock = this.editableMedicine.quantityInStock;
        this.selectedMedicine.availableToDispatch = this.editableMedicine.availableToDispatch;

        this.isEditMode = false;
      },
      error: (err) => {
        console.error(err);
        alert("Update failed!");
      }
    });
  }


  allMedicals: any[] = [];
  searchText: string = '';

  onSearch() {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredMedicineData = this.medicineData.filter((med: any) =>
      med.name.toLowerCase().includes(searchTerm) || med.description.toLowerCase().includes(searchTerm)
    );
  }



  buyMedicinesData: any[] = [];


  getCartDetailsById() {
    const data = {
      medicalId: this.userDetails._id
    }
    this.authService.getCartDetailsById(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.buyMedicinesData = res.data;
      }
    }, (err: any) => {
      console.error('getting error at getCartDetailsById', err)
    }
    )
  }




  feedbackList: any[] = [];
  isDisplayFeedback: boolean = false;

  openFeedbacks(data: any) {
    this.isDisplayFeedback = true;
    const payload = {
      feedBackDataId: data._id
    }
    this.authService.getFeedbackByMedicineId(payload).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.feedbackList = res.data;
      }
    }, (err: any) => {
      console.error('Error at getAllFeedback', err)
    })
  }


  closeFeedback() {
    this.isDisplayFeedback = false;
    this.feedbackList = [];
  }

  isOpenUpdateFeedback: boolean = false;
  statusList: string[] = ['Pending', 'Accept', 'Reject', 'Delivered'];
  selectedStatus: string = '';
  updateFeedbackData: any;

  openUpdateFeedback(data: any) {
    this.selectedStatus = data.status;
    this.updateFeedbackData = data;
    this.isOpenUpdateFeedback = true;
  }

  closeUpdateFeedback() {
    this.isOpenUpdateFeedback = false;
  }


  updateStatus() {
    const data = {
      _id: this.updateFeedbackData._id,
      status: this.selectedStatus
    }

    this.authService.updateCartStatus(data).subscribe((res: any)=>{
      if(res.status === 'Success'){
        this.closeUpdateFeedback();
        this.getCartDetailsById()
      }
    },(err: any)=>{
      console.error('Error at updateCartStatus', err)
    })

  }

}
