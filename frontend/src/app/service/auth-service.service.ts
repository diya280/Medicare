import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  // <---------------------------- Backend api calls ------------------------------->

  constructor(private http: HttpClient) { }
  apiUrlString: string = 'https://medicare-f9lb.onrender.com/api';


  signupUser(data: any): Observable<any> {
    const apiUrl: string = this.apiUrlString + `/add/user`;
    return this.http.post(apiUrl, data)
  }

  loginUser(data: any): Observable<any> {
    const apiUrl: string = this.apiUrlString + `/login/user`;
    return this.http.post(apiUrl, data)
  }

  getLoginUser(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is missing');
    }
    return from(
      fetch(this.apiUrlString + '/get/login/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .catch(error => {
          console.error(error);
          throw error;
        })
    );
  }

  updateUserProfile(data: any) {
    const apiUrl: string = this.apiUrlString + `/updateuserdetails`;
    return this.http.post(apiUrl, data)
  }

  uploadImages(data: any): Observable<any> {
    const apiUrl: string = this.apiUrlString + `/uploadmedicalimages`;
    return this.http.post(apiUrl, data)
  }

  getUploadImages(data: any) {
    const apiUrl: string = this.apiUrlString + `/getmedicalimagebyuserId`;
    return this.http.post(apiUrl, data)
  }

  removeUploadedImages(data: any) {
    const apiUrl: string = this.apiUrlString + `/deletemedicalimagebyuserid`;
    return this.http.post(apiUrl, data)
  }

  addMedicineData(data: any) {
    const apiUrl: string = this.apiUrlString + `/addmedicinedetails`;
    return this.http.post(apiUrl, data)
  }

  getMedicineDetails(data: any) {
    const apiUrl: string = this.apiUrlString + `/getMedicineDataByUserId`;
    return this.http.post(apiUrl, data)
  }

  updateMedicineData(data: any) {
    const apiUrl: string = this.apiUrlString + `/updatemedicinestockdetails`;
    return this.http.post(apiUrl, data)
  }

  getMedicalByCity(data: any) {
    const apiUrl: string = this.apiUrlString + `/getmedicalbycity`;
    return this.http.post(apiUrl, data)
  }

  updateMedicine(data: any) {
    const apiUrl: string = this.apiUrlString + `/`;
    return this.http.post(apiUrl, data)
  }

  getAllMedical() {
    const apiUrl: string = this.apiUrlString + `/getallmedicallist`;
    return this.http.get(apiUrl)
  }

  getAllUsers() {
    const apiUrl: string = this.apiUrlString + `/getalluserlist`;
    return this.http.get(apiUrl)
  }

  getMedicalImagesByIdArray(data: any) {
    const apiUrl: string = this.apiUrlString + `/getmedicalimagesbyidarray`;
    return this.http.post(apiUrl, data)
  }

  getAllMedicineDataByCity(data: any) {
    const apiUrl: string = this.apiUrlString + `/getallmedicinedatabycity`;
    return this.http.post(apiUrl, data)
  }

  getdetailsbyuserid(data: any) {
    const apiUrl: string = this.apiUrlString + `/getdetailsbyuserid`;
    return this.http.post(apiUrl, data)
  }

  addCartDetails(data: any) {
    const apiUrl: string = this.apiUrlString + `/addcartdetails`;
    return this.http.post(apiUrl, data)
  }

  getCartDetailsById(data: any) {
    const apiUrl: string = this.apiUrlString + `/getcartdetailsbyid`;
    return this.http.post(apiUrl, data)
  }

  addFeedbackDetails(data: any) {
    const apiUrl: string = this.apiUrlString + `/addfeedbackforuser`;
    return this.http.post(apiUrl, data)
  }

  getFeedbackDetailsById(data: any) {
    const apiUrl: string = this.apiUrlString + `/fetchfeedbackviauserid`;
    return this.http.post(apiUrl, data)
  }

  getFeedbackByMedicineId(data: any) {
    const apiUrl: string = this.apiUrlString + `/getFeedbackByMedicineId`;
    return this.http.post(apiUrl, data)

  }

  getAllFeedback() {
    const apiUrl: string = this.apiUrlString + `/getallfeedback`;
    return this.http.get(apiUrl)
  }

  updateCartStatus(data: any) {
    const apiUrl: string = this.apiUrlString + `/updateCartStatus`;
    return this.http.post(apiUrl, data)
  }

  getDataByRole(data: any) {
    const apiUrl: string = this.apiUrlString + `/getDataByRole`;
    return this.http.post(apiUrl, data)

  }

  updateStatusByAdmin(data: any) {
    const apiUrl: string = this.apiUrlString + `/updateStatusByAdmin`;
    return this.http.post(apiUrl, data)
  }

  getFeedbackByMedicalId(data: any) {
    const apiUrl: string = this.apiUrlString + `/getFeedbackByMedicalId`;
    return this.http.post(apiUrl, data)
  }




}
