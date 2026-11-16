import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SharedService } from 'src/app/service/shared.service';
import Swal from 'sweetalert2';
import { MedicalDetailsComponent } from '../medical-details/medical-details.component';


@Component({
  selector: 'app-viewarea',
  templateUrl: './viewarea.component.html',
  styleUrls: ['./viewarea.component.scss']
})
export class ViewareaComponent {

  constructor(private dialog: MatDialog,
    private sharedService: SharedService,
    private authService: AuthServiceService) { }


  userDetails: any;
  selectedTab: string = 'medicine';
  medicalData: any[] = [];
  medicalId: any;
  BASE_URL = 'http://localhost:8080';





  ngOnInit(): void {
    this.getLoginUser();
  }


  onSelectedTab(tab: any) {
    this.selectedTab = tab
    if (this.selectedTab === 'order') {
      this.getCartDetailsById();
    }
  }


  getLoginUser() {
    this.authService.getLoginUser().subscribe((res: any) => {
      this.userDetails = res.data;
      setTimeout(() => {
        this.getAllMedicineDataByCity();
        this.getMedicalByCity();
        this.getAllMedical();
        this.getCartDetailsById();
      }, 20)
    }, (err: any) => {
      console.error('error at getting getLoginUser', err)
    })
  }


  getMedicalByCity() {
    const data = {
      city: this.userDetails?.address?.city
    }
    this.authService.getMedicalByCity(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        const id = res.data.map((id: any) => id._id)
        this.getMedicalImagesByIdArray(res.data, id);
      }
    }, (error: any) => {
      console.error('error at getting getMedicalByCity', error)
    })
  }


  getMedicalImagesByIdArray(details: any, medicalId: any) {
    const data = {
      userId: medicalId
    }
    this.authService.getMedicalImagesByIdArray(data).subscribe((res: any) => {

      const medicalImages = res.data
      // .map((item: any) => {
      //   item.images = item.images.map((img: any) => ({
      //     getId: item._id,
      //     ...img,
      //     fullUrl: this.BASE_URL + img.url
      //   }));
      //   return item;
      // });

      this.medicalData = details.map((user: any) => {
        const userImages = medicalImages.filter((img: any) => img.userId === user._id)
          .map((img: any) => img.images).flat();
        return {
          ...user,
          images: userImages
        };
      });

    })
  }


  getAllMedical() {
    this.authService.getAllMedical().subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        const id = res.data.map((id: any) => id._id);
        this.getMedicalImagesByIdArrayForAllMedical(res.data, id)
      }
    }, (error: any) => {
      console.error('error at getting getAllMedical', error)
    })
  }


  getMedicalImagesByIdArrayForAllMedical(details: any, medicalId: any) {
    const data = {
      userId: medicalId
    }
    this.authService.getMedicalImagesByIdArray(data).subscribe((res: any) => {
      const medicalImages = res.data
      // .map((item: any) => {
      //   item.images = item.images
      //   .map((img: any) => ({
      //     getId: item._id,
      //     ...img,
      //     fullUrl: this.BASE_URL + img.url
      //   }));
      //   return item;
      // });

      this.allMedicals = details.map((user: any) => {
        const userImages = medicalImages
          .filter((img: any) => img.userId === user._id)
          .map((img: any) => img.images).flat();
        return {
          ...user,
          images: userImages
        };
      });
    })
  }








  searchText: string = '';
  allMedicals: any[] = [];
  medicineData: any[] = [];
  filteredMedicineData: any[] = [];
  expandedDesc: { [key: number]: boolean } = {};
  defaultImage = 'assets/medicare_logo/medicine.png';



  onImgError(event: any) {
    event.target.src = this.defaultImage;
  }

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


  getAllMedicineDataByCity() {
    const data = {
      city: this.userDetails.address?.city
    }

    this.authService.getAllMedicineDataByCity(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.medicineData = res.data;
        // .map((item: any) => {
        //   item.images = item.photos.map((img: any) => ({
        //     fullUrl: this.BASE_URL + img.url
        //   }));
        //   return item;
        // });
        this.filteredMedicineData = [...this.medicineData];
      }

    }, (err: any) => {
      console.error('error getting at getAllMedicineDataByCity', err)
    })

  }


  onSearch() {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredMedicineData = this.medicineData.filter((med: any) =>
      med.name.toLowerCase().includes(searchTerm) || med.description.toLowerCase().includes(searchTerm)
    );
  }



  contact: any;
  quantity: any;
  buyMedicinesData: any;
  buyerName: string = '';
  deliverAddress: string = '';
  selectedMedicine: any;
  medicalDetails: any;
  isOpenViewDetails: boolean = false;
  isDisplayOrder: boolean = false;
  isOpenAddCart: boolean = false;



  closeViewDetails() {
    this.isOpenViewDetails = false;
  }

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
      medicalData: this.medicalDetails,
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
        this.getFeedbackById();
      }
    }, (err: any) => {
      console.error('Error getting at getCartDetailsById', err)
    });
  }




  // ----------------------------------------





  openMedicalDetails(data: any) {
    this.dialog.open(MedicalDetailsComponent, { data: data });
  }



  rating = 0;
  hoverRating = 0;
  feedbackText: string = '';
  feedbackList: any[] = [];
  feedbackData: any;
  feedbackDetails: any;
  isOpenFeedback: boolean = false;
  isViewFeedbackDetail: boolean = false;



  openFeedback(data: any) {
    this.isOpenFeedback = true;
    this.feedbackData = data;
  }

  closeFeedback() {
    this.isOpenFeedback = false;
  }

  setRating(value: number) {
    this.rating = value;
  }

  setHover(value: number) {
    this.hoverRating = value;
  }

  clearHover() {
    this.hoverRating = 0;
  }

  addFeedbackToCart() {
    const data = {
      rating: this.rating,
      feedbackMessage: this.feedbackText,
      medicalData: this.feedbackData.medicalData,
      userId: this.userDetails._id,
      feedBackDataId: this.feedbackData._id,
    }
    this.authService.addFeedbackDetails(data).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.closeFeedback();
        this.getFeedbackById();
        this.feedbackText = '';
        this.rating = 0;
      }
    }, (err: any) => {
      console.error('Error getting at addFeedbackDetails', err)
    })

  }


  getFeedbackById() {
    const data = {
      userId: this.userDetails._id,
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
    this.feedbackDetails = data;
    this.isViewFeedbackDetail = true;
  }

  closeFeedbackDetail() {
    this.isViewFeedbackDetail = false;
  }



  // ---------------------------------------------------




  isOpenReviews: boolean = false;
  feedbackListArea: any[] = [];

  viewReviews(data: any, event: Event) {
    event.stopPropagation();
    this.isOpenReviews = true;
    this.getReviewByMedicineId(data._id)
  }

  closeReviews() {
    this.isOpenReviews = false;
  }

  getReviewByMedicineId(id: any) {
    const data = {
      medicalId: id
    }
    this.authService.getFeedbackByMedicalId(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        this.feedbackListArea = res.data;
      }
    }, (err: any) => {
      console.error('Error at getReviewByMedicineId', err)
    })
  }









}

