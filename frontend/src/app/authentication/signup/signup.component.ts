import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  showMedicalFields = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private authService: AuthServiceService, private route: Router,
    public dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      contact: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: [''],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      pincode: ['', Validators.required, Validators.pattern(/^\d{6}$/)],
      state: ['', Validators.required],
      role: ['', Validators.required],
      medicalName: [''],
      medicalAddress: [''],
      canDeliver: [false]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onRoleChange() {
    this.showMedicalFields = this.signupForm.value.role === 'medical';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  closeModal() {
    this.dialogRef.close();
  }

  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }


  openLogin() {
    this.closeModal();
    setTimeout(() => {
      this.dialog.open(SigninComponent);
    }, 100)
  }


  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      const invalidFields: string[] = [];
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control && control.invalid) {
          invalidFields.push(key);
        }
      });
      console.warn('Invalid or missing fields:', invalidFields);
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        html: `Please fill out or correct the following fields:<br><b>${invalidFields.join(', ')}</b>`,
        confirmButtonText: 'OK'
      });
      return;
    }

    const { password, confirmPassword } = this.signupForm.value;
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please check again.'
      });
      return;
    }

    const signupData = { ...this.signupForm.value };
    delete signupData.confirmPassword;
    Swal.fire({
      title: 'Signing up...',
      text: 'Please wait while we create your account.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.authService.signupUser(signupData).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful',
          text: 'Your account has been created successfully!',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // this.route.navigate(['/medical/dashboard']);
          this.openLogin();
          this.signupForm.reset();
          this.closeModal();
        });
      },
      error: (err: any) => {
        console.error('Signup Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: err.error?.message || 'An unexpected error occurred. Please try again.'
        });
      }
    });
  }


  limitLength(event: any, type: any) {
    const input = event.target;
    if (type === 'contact') {
      if (input.value.length > 10) {
        input.value = input.value.slice(0, 9);
      }
    } else if (type === 'pincode') {
      if (input.value.length > 5) {
        input.value = input.value.slice(0, 9);
      }
    }

  }



}



