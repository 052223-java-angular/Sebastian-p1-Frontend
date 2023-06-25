import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(protected authService: AuthService, private toastr: ToastrService) {};

  logout() {
    this.authService.logout();
    this.toastr.success("Logged out");
  }
}
