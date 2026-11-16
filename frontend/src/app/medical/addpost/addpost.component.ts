import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SharedService } from 'src/app/service/shared.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.scss'],
})
export class AddpostComponent implements OnInit {

  medicineForm!: FormGroup;
  selectedPhotos: File[] = [];
  previewImages: string[] = [];
  userDetails: any;

  constructor(
    public dialogRef: MatDialogRef<AddpostComponent>, private sharedService: SharedService,
    private fb: FormBuilder, private authService: AuthServiceService,
  ) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantityInStock: [null, [Validators.required]],
      availableToDispatch: [false],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLoginUser();
  }

  getLoginUser() {
    this.authService.getLoginUser().subscribe((res: any) => {
      this.userDetails = res.data;
    })
  }


  closeModal() {
    this.dialogRef.close();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
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
    }
  }

  removeImage(img: string) {
    const index = this.previewImages.indexOf(img);
    if (index !== -1) {
      this.previewImages.splice(index, 1);
      this.selectedPhotos.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    const data = {
      userId: this.userDetails._id,
      name: this.medicineForm.get('name')?.value,
      description: this.medicineForm.get('description')?.value,
      quantityInStock: this.medicineForm.get('quantityInStock')?.value,
      availableToDispatch: this.medicineForm.get('availableToDispatch')?.value,
      photo: this.previewImages,
      city: this.userDetails.address?.city,
      price: this.medicineForm.get('price')?.value,
    }
    this.authService.addMedicineData(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data) {
        this.closeModal();
        const obj ={ Active: true}
        this.sharedService.setData(obj)
        Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: 'Medicone details added successfully!',
          showConfirmButton: false,
          confirmButtonColor: '#4CAF50',
          timer: 1500
        });
      }
    }, (err: any) => {
      console.error('error at add medicine details', err)
       Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong, try again later!',
          showConfirmButton: false,
          confirmButtonColor: '#9f1919ff',
          timer: 1500
        });
    })

  }

  isInvalid(field: string) {
    const c = this.medicineForm.get(field);
    return c?.invalid && (c.touched || c.dirty);
  }

  getError(field: string) {
    const c = this.medicineForm.get(field);
    if (c?.hasError('required')) return 'This field is required';
    if (c?.hasError('min')) return 'Minimum value should be 1';
    return '';
  }




}

