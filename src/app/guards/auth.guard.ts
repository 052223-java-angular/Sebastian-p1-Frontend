import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastrService = inject(ToastrService);
  if(inject(AuthService).loggedIn) return true;
  toastrService.info("Please Log In", "Unauthorized");
  router.navigateByUrl("/login");
  return false;
};
