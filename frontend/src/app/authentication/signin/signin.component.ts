import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/service/auth-service.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent {

  constructor(private fb: FormBuilder,
    private router: Router, private dialog: MatDialog,
     private authService: AuthServiceService,
    public dialogRef: MatDialogRef<SigninComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }


  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.authService.loginUser({ email, password }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        Swal.fire({
          title: '✅ Login Successful!',
          text: `Welcome ${res?.user?.name || ''}!`,
          icon: 'success',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #cbebff 100%)',
          color: '#1a1a1a',
          iconColor: '#16a34a',
          timer: 1200,
          showConfirmButton: false,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-3xl shadow-2xl',
            title: 'text-2xl font-semibold',
            htmlContainer: 'text-base'
          },
        });
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
        setTimeout(() => {
          if (res.user.role === 'medical') {
            this.router.navigate(['/medical/dashboard']);
          } else if (res.user.role === 'user') {
            this.router.navigate(['/user/dashboard']);
          }else if(res.user.role === 'admin'){
            this.router.navigate(['/admin/dashboard']);
          }
        }, 100);

        this.closeModal();
      },

      error: (err: any) => {
        console.error('Login Error:', err);
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: '❌ Login Failed',
          text: err.error?.message || 'Invalid credentials. Please try again.',
          background: 'linear-gradient(135deg, #fff0f0 0%, #ffe5e5 100%)',
          color: '#1a1a1a',
          iconColor: '#e53935',
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-3xl shadow-2xl',
            title: 'text-2xl font-semibold',
            htmlContainer: 'text-base'
          },
        });
      }
    });
  }


  get f() {
    return this.loginForm.controls;
  }

  closeModal() {
    this.dialogRef.close();
  }


  openSignUp() {
    this.closeModal();
    setTimeout(() => {
      this.dialog.open(SignupComponent);
    }, 100)
  }
}

