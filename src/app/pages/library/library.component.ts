import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PdLibrary } from 'src/app/models/pd-library';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit{
  @Input() name?: string | null;
  pdLibrary: PdLibrary | null = null;
  constructor(private libraryService: LibraryService, private toastrService: ToastrService) {}
  ngOnInit(): void {
      if(typeof(this.name) !== "string") {
        this.toastrService.error("No Library Provided");
        return;
      }
      this.libraryService.getLibraryByName(this.name, {
        next: (value: PdLibrary) => {
          this.pdLibrary = value;
          this.pdLibrary.objects.sort((a, b) => 
            (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
        },
        error: (error) => {
          this.toastrService.error(error.error.message, "Couldn't get library info");
        },
        complete() {},
      });
  }
}
