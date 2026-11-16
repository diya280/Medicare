import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/service/auth-service.service';




@Component({
  selector: 'app-userarea',
  templateUrl: './userarea.component.html',
  styleUrls: ['./userarea.component.scss']
})
export class UserareaComponent implements OnInit {



  constructor(private dialog: MatDialog,
    private authService: AuthServiceService,
    public dialogRef: MatDialogRef<UserareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }


  ngOnInit(): void {
    this.getCartDetailbyUSerId();
  }


  closeModal() {
    this.dialogRef.close();
  }

  feedbackList: any[] = [];
  buyMedicinesData: any[] = [];
  isViewFeedbackDetail: boolean = false;


  getCartDetailbyUSerId() {
    const data = {
      buyerId: this.data._id
    }
    this.authService.getCartDetailsById(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.buyMedicinesData = res.data;
        this.getFeedbackById();
      }
    }, (err: any) => {
      console.error('Error getting at getCartDetailsById', err)
    });
  }

  getFeedbackById() {
    const data = {
      userId: this.data._id,
    }
    this.authService.getFeedbackDetailsById(data).subscribe((res: any) => {
      this.feedbackList = res.data;
    }, (err: any) => {
      console.error('Error at getFeedbackDetailsById', err)
    })
  }

  getFeedbackForItem(itemId: string) {
    return this.feedbackList?.find(
      (fb: any) => fb.feedBackDataId === itemId
    );
  }




  viewFeedbackData(data: any) {
    this.isViewFeedbackDetail = true;
  }

  closeFeedbackDetail() {
    this.isViewFeedbackDetail = false;
  }


  isOpenUpdateStatus: boolean = false;
  feedbackData: any;
  statusList = ['Active', 'Inactive'];
  selectedStatus: string = '';

  openUpdateStatus(data: any) {
    this.selectedStatus = data.status;
    this.feedbackData = data;
    this.isOpenUpdateStatus = true;
  }

  closeUpdateStatus() {
    this.isOpenUpdateStatus = false;
  }

  updateFeedbackStatus() {
    const data = {
      _id: this.feedbackData._id,
      status: this.selectedStatus
    }
    this.authService.updateStatusByAdmin(data).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.closeUpdateStatus();
        this.getCartDetailbyUSerId()
      }
    }, (err: any) => {
      console.error('Error at updateStatusByAdmin', err)
    })
  }




}
