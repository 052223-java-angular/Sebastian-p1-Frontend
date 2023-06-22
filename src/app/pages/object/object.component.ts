import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PdObject } from 'src/app/models/pd-object';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  @Input() objName?: string | null;
  @Input() libName?: string | null;

  pdObject: PdObject | null = null;

  constructor(private libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService) {}

  ngOnInit(): void {
    if(typeof(this.objName) !== "string" || typeof(this.libName) !== "string") {
      this.toastrService.error("No Object Provided");
      return;
    }
    this.libraryService.getObjectByAddress(this.objName, this.libName, {
      next: (value: PdObject) => {
        value.objectTags.sort((a, b) => {
            return (a.tag.name.toLowerCase() > b.tag.name.toLowerCase() ? 1 : -1);
        });

        this.pdObject = value;
      },
      error: (error) => {
        this.toastrService.error(error.error.message, "Couldn't Load Object");
      },
      complete() {}
    });
  }


}
