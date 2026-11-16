import { Component, OnInit, Inject } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-medical-details',
  templateUrl: './medical-details.component.html',
  styleUrls: ['./medical-details.component.scss']
})
export class MedicalDetailsComponent implements OnInit {



  constructor(private authService: AuthServiceService,
    public dialogRef: MatDialogRef<MedicalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.getLoginUser();
  }

  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }


  closeModal() {
    this.dialogRef.close();
  }

  userDetails: any;
  filteredMedicineData: any[] = [];
 

  getLoginUser(): void {
    this.authService.getLoginUser().subscribe((res: any) => {
      this.userDetails = res.data;
      this.getMedicineDetailById();
    }, (err: any) => {
      console.error('getting error at getLoginUser', err)
    })
  }


  getMedicineDetailById() {
    const data = {
      userId: this.data._id
    }
    this.authService.getMedicineDetails(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        const medicineData = res.data;
        // .map((item: any) => {
        //   item.images = item.photos.map((img: any) => ({
        //     fullUrl: this.BASE_URL + img.url
        //   }));
        //   return item;
        // });
        this.filteredMedicineData = [...medicineData];
      }
    }, (err: any) => {
      console.error('error at getMedicineDetails', err)
    })
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
  defaultImage = 'assets/medicare_logo/medicine.png';

  onImgError(event: any) {
    event.target.src = this.defaultImage;
  }

  viewDetails(data: any) {
    this.selectedMedicine = data;
    this.isOpenViewDetails = true;
  }


  closeViewDetails() {
    this.isOpenViewDetails = false;
  }



  contact: any;
  quantity: any;
  buyMedicinesData: any;
  buyerName: string = '';
  deliverAddress: string = '';
  medicalDetails: any;
  isDisplayOrder: boolean = false;
  isOpenAddCart: boolean = false;



  viewMedicineDetails(data: any) {
    this.selectedMedicine = data;
    this.isOpenViewDetails = true;
    this.getDetailsByUserId(data.userId)
  }

  getDetailsByUserId(id: any) {
    const data = {
      userId: id
    }
    this.authService.getdetailsbyuserid(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.medicalDetails = res.data[0]
      }
    }, (err: any) => {
      console.error('error at getting getDetailsByUserId', err)
    })
  }

  buyMedicine() {
    this.isOpenViewDetails = false;
    this.isOpenAddCart = true;
  }

  closeCartDetails() {
    this.isOpenAddCart = false;
    this.isOpenViewDetails = true
  }

  limitLength(event: any) {
    const input = event.target;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 9);
    }
  }

  addMedicineToCart() {
    const data = {
      buyerName: this.buyerName,
      deliverAddress: this.deliverAddress,
      contact: this.contact,
      quantity: this.quantity,
      price: Number(this.quantity * this.selectedMedicine.price),
      medicineName: this.selectedMedicine.name,
      medicineId: this.selectedMedicine._id,
      buyerData: this.userDetails,
      medicalData: this.data,
    }
    this.authService.addCartDetails(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && Object.keys(res.data.length > 0)) {
        Swal.fire({
          title: 'Cart added',
          text: 'Your cart added successfully!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.closeCartDetails();
        this.getCartDetailsById();
        this.closeViewDetails();
        this.closeModal();
        
      }
    }, (error: any) => {
      console.error('error at add cart to details', error)
    })

  }

  getCartDetailsById() {
    const data = {
      buyerId: this.userDetails._id
    }
    this.authService.getCartDetailsById(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.buyMedicinesData = res.data;
        this.isDisplayOrder = true;
      }
    })
  }



}
