import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PdLibrary } from 'src/app/models/pd-library';
import { PdObject } from 'src/app/models/pd-object';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit{
  @Input() name?: string | null;
  pdLibrary: PdLibrary | null = null;
  constructor(private libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService) {}

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
        this.pdLibrary.objects.forEach((value: PdObject) => {
          value.objectTags.sort((a, b) => {
            return (a.tag.name.toLowerCase() > b.tag.name.toLowerCase() ? 1 : -1);
          });
        })
      },
      error: (message) => {
        this.toastrService.error(message, "Couldn't get library info");
      },
      complete() {},
    });
  }
}
