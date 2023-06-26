import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterPayload } from 'src/app/models/register-payload';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerFormGroup!: FormGroup;
  nonMatching: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    // 8-20 alphanumeric chars, no repeated _ or . chars, can't end or start with . or _
    let usernameValidator: ValidatorFn = Validators.pattern("^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$");
    // at least 8 chars, must contain 1 number
    let passwordValidator: ValidatorFn = Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    this.registerFormGroup = this.fb.group({
      username: ['', [Validators.required, usernameValidator]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required, passwordValidator]],
    });
  }

  submitForm(): void {
    let password: string = this.registerFormGroup.get('password')?.value;
    let confirmPassword: string = this.registerFormGroup.get('confirmPassword')?.value;
    if(password != confirmPassword) {
      this.nonMatching = true;
      return;
    }
    const payload: RegisterPayload = {
      username: this.registerFormGroup.get('username')?.value,
      password: password,
      confirmPassword: confirmPassword
    }
    this.nonMatching = false;
    this.authService.register(payload, {
      next: value => {
        this.toastr.success("Please Login", "Successfully Registered");
        this.router.navigateByUrl("/login");
      },
      error: message => {
        this.toastr.error(message, "Unsuccessful Registration");
      }
    })
  }
}
