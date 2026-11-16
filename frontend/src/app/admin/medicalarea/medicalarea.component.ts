import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/service/auth-service.service';






@Component({
  selector: 'app-medicalarea',
  templateUrl: './medicalarea.component.html',
  styleUrls: ['./medicalarea.component.scss']
})
export class MedicalareaComponent implements OnInit {


  constructor(private dialog: MatDialog,
    private authService: AuthServiceService,
    public dialogRef: MatDialogRef<MedicalareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  filteredMedicineData: any[] = [];
  BASE_URL = 'http://localhost:8080';  
  defaultImage = 'assets/medicare_logo/medicine.png';
  expandedDesc: { [key: number]: boolean } = {};

  

  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }


  ngOnInit(): void {
    this.getMedicineDetailById();
  }

  closeModal() {
    this.dialogRef.close();
  }

  onImgError(event: any) {
    event.target.src = this.defaultImage;
  }
  
  getMedicineDetailById() {
    const data = {
      userId: this.data._id
    }
    this.authService.getMedicineDetails(data).subscribe((res: any) => {
      if (res.status === 'Success' && res.data && res.data.length > 0) {
        const medicineData = res.data.map((item: any) => {
          item.images = item.photos.map((img: any) => ({
            fullUrl: this.BASE_URL + img.url
          }));
          return item;
        });
        this.filteredMedicineData = [...medicineData];
      }
    }, (err: any) => {
      console.error('error at getMedicineDetails', err)
    })
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


  isOpenReviews: boolean = false;
  feedbackList: any[] =[];

  viewReviews(data: any){
    this.isOpenReviews = true;
    this.getReviewByMedicineId(data._id)
  }

  closeReviews(){
    this.isOpenReviews = false;
  }

  getReviewByMedicineId(id: any){
    const data = {
      medicineId: id
    }
    this.authService.getFeedbackByMedicineId(data).subscribe((res: any)=>{
      if(res.status === 'Success' && res.data && res.data.lengt > 0){
        this.feedbackList = res.data;
      }
    },(err: any)=>{
      console.error('Error at getReviewByMedicineId', err)
    })
  }



}
