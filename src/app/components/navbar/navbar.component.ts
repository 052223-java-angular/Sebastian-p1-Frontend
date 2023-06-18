import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(protected authService: AuthServiceService, private toastr: ToastrService) {};

  logout() {
    this.authService.logout();
    this.toastr.success("Logged out");
  }
}
