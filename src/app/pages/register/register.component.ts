import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerFormGroup!: FormGroup;
  nonMatching: boolean = false;
  constructor(private fb: FormBuilder) { }

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
    if(this.registerFormGroup.get('password')?.value != this.registerFormGroup.get('confirmPassword')?.value) {
      this.nonMatching = true;
      return;
    }
    this.nonMatching = false;
  }
}
