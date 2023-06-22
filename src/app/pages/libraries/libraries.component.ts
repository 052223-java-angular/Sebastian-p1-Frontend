import { Component } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { ToastrService } from 'ngx-toastr';
import { LibrarySummary } from 'src/app/models/library-summary';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.css']
})
export class LibrariesComponent {
  libraries: LibrarySummary[] = [];
  constructor(private libraryService: LibraryService, private toastrService: ToastrService) {
    libraryService.getLibraries({
      next: (value: LibrarySummary[]) => {
        value.forEach((summary) => {
          summary.tags.sort((a, b) => 
          (a.toLowerCase() > b.toLowerCase() ? 1 : -1));

        });
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
