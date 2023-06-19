import { Component } from '@angular/core';
import { LibraryServiceService } from 'src/app/services/library-service.service';
import { PdLibrary } from 'src/app/models/pd-library';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.css']
})
export class LibrariesComponent {
  libraries: PdLibrary[] = [];
  constructor(private libraryService: LibraryServiceService, private toastrService: ToastrService) {
    libraryService.getLibraries({
      next: (value: PdLibrary[]) => {
        this.libraries = value.sort((a, b) => 
          (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      },
      error: error => {
        this.toastrService.error(error.error.message, "Couldn't Get Libraries");
      },
      complete: () => {}
    });
  }
}
