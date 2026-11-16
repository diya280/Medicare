import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service';



@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule],

})
export class ProfileComponent implements OnInit {

  loginUser: any = {};
  editableData: any = {};
  editMode: boolean = false;
  isOpenProfileModal: boolean = false;
  isOpenUploadImgModal: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthServiceService,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getLoginUser();
    this.isOpenProfileModal = true;

  }

  getLoginUser() {
    this.authService.getLoginUser().subscribe(
      (res: any) => {
        if (res.status === 'Success') {
          this.loginUser = res.data;
          this.editableData = JSON.parse(JSON.stringify(this.loginUser));
          this.editMode = false;
        }
        this.getUploadImages();

      },
      (err: any) => {
        console.error('Error at getLoginUser()', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong.',
          confirmButtonColor: '#d33',
          timer: 1500
        });

      }
    );
  }

  enableEdit() {
    this.editMode = true;
    this.editableData = JSON.parse(JSON.stringify(this.loginUser)); // deep copy
  }

  cancelEdit() {
    this.editMode = false;
    this.editableData = JSON.parse(JSON.stringify(this.loginUser));
  }

  saveProfile() {
    const data = {
      userId: this.editableData._id,
      ...this.editableData
    }

    this.authService.updateUserProfile(data).subscribe(
      (res: any) => {
        if (res.status === 'Success') {
          this.loginUser = JSON.parse(JSON.stringify(this.editableData));
          this.editMode = false;
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile information has been successfully updated!',
            timer: 1500
          });
        }
      },
      (err: any) => {
        console.error('Error updating profile:', err);
        Swal.fire('Error', 'Something went wrong!', 'error');
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }


  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'No, Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.localStorageService.remove('token');
        this.localStorageService.remove('loginUser');
        this.closeModal();
        this.router.navigate(['/dashboard']);
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }


  previewImages: string[] = [];
  showFullImage = false;
  selectedImage: string | null = null;

  onMultipleFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImages.push(reader.result as string);
      };
      reader.readAsDataURL(file);
      this.openUploadImgModal();
    }
  }

  removeImage(img: string) {
    this.previewImages = this.previewImages.filter(i => i !== img);
    if (this.previewImages && this.previewImages.length === 0) {
      this.closeUploadModal();
    }
  }

  openFullImage(img: string) {
    this.selectedImage = img;
    this.showFullImage = true;
  }

  closeFullImage() {
    this.showFullImage = false;
    this.selectedImage = null;
  }

  openUploadImgModal() {
    this.isOpenProfileModal = false;
    this.isOpenUploadImgModal = true;
  }

  closeUploadModal() {
    this.isOpenUploadImgModal = false;
    this.isOpenProfileModal = true;
    this.isViewImages = false;
  }

  uploadImages() {
    const data = {
      images: this.previewImages,
      userId: this.loginUser._id,
      medicalName: this.loginUser.medicalName,
      medicalAddress: this.loginUser.medicalAddress,
    }
    this.authService.uploadImages(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && Object.keys(res.data.length > 0)) {
        this.getUploadImages();
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile information has been successfully updated!',
          timer: 1500
        });
        this.isOpenUploadImgModal = false;
        this.isViewImages = true;
      }
    }, (err: any) => {
      console.error('error getting at uploadImages', err)
    })
  }

  isImgUploaded: boolean = false;
  uploadedImages: any;

 

  getUploadImages() {
    const data = {
      userId: this.loginUser._id
    }
    this.authService.getUploadImages(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.isImgUploaded = true;
        this.uploadedImages = res.data;
        // .map((item: any) => {
        //   item.images = item.images.map((img: any) => ({
        //     getId: item._id,
        //     ...img,
        //     fullUrl: this.BASE_URL + img.url
        //   }));
        //   return item;
        // });
      } else {
        this.closeUploadModal();
        this.isViewImages = false;
        this.isImgUploaded = false;
      }
    }, (err: any) => {
      console.error('error getting at getUploadImages', err)
    })
  }

  isViewImages: boolean = false;

  openViewImages() {
    this.isViewImages = true;
  }


  removeUploadedImages(data: any) {
    const payload = {
      _id: data.getId,
      status: 'Inactive'
    };
    this.authService.removeUploadedImages(payload).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.getUploadImages();
      }
    }, (err: any) => {
      console.error('error getting at removeUploadedImages', err)
    })



  }



}