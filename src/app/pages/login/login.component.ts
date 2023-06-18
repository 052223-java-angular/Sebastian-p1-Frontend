import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginPayload } from 'src/app/models/login-payload';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formGroup!: FormGroup;

  constructor(private fb: FormBuilder, protected authService: AuthServiceService, private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    let password: string = this.formGroup.get('password')?.value;
    const payload: LoginPayload = {
      username: this.formGroup.get('username')?.value,
      password: password
    }
    console.log(payload);
    this.authService.login(payload, {
      next: (value: any) => {
        this.toastr.success("Successfully Logged In");
        this.router.navigateByUrl("/libraries");
      },
      error: (error: string) => {
        this.toastr.error(error, "Unsuccessful Login");
      }
    })
  }
}
