import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: User | null = null;
  picSrcUrl: string = "//:0";
  form: FormGroup | null = null;
  imageChanged: boolean = false;
  @ViewChild("fileInput") fileInput: any;
  constructor(private userService: UserService, private toastrService: ToastrService, private fb: FormBuilder,
    private authService: AuthService, private router: Router) {}

  imageChange() {
    this.imageChanged = true;
  }

  submitForm() {
    const formData = new FormData();
    formData.append('image', this.fileInput.nativeElement.files[0]);
    formData.append('username', this.form?.controls["username"].value);
    formData.append('email', this.form?.controls["email"].value);
    this.authService.putWithAuth("user/edit", formData, {
      next: (any) => {
        this.toastrService.success("Updated profile");
        this.userService.newProfileSuffix();
        this.router.navigate(["/profile"]);
      },
      error: (msg: string) => {
        this.toastrService.error(msg, "Couldn't Edit User Info");
      }
    });
  }

  ngOnInit() {
    const usernameValidator: ValidatorFn = Validators.pattern("^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$");
    this.form = this.fb.group({
      username: ['', [Validators.required, usernameValidator]],
      email: [''],
      image: [null]
    });
    this.userService.getMe({
      next: (user: User) => {
        this.user = user;
        if(user.hasProfilePic)
          this.picSrcUrl = this.userService.profilePicUrl + user.id + ".jpg" + this.userService.profilePicSuffix;
        else this.picSrcUrl = "assets/placeholderProfilePic.png"
        this.form?.controls["username"].setValue(user.username);
        this.form?.controls["email"].setValue(user.email);
      },
      error: (msg) => {
        this.toastrService.error(msg, "Couldn't get User")
      }
    });
  }

}
