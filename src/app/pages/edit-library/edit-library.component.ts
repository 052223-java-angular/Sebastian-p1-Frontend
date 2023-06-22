import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PdEditLibrary } from 'src/app/models/pd-edit-library';
import { PdLibrary } from 'src/app/models/pd-library';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';
import { LibraryTagService } from 'src/app/services/library-tag.service';

@Component({
  selector: 'app-edit-library',
  templateUrl: './edit-library.component.html',
  styleUrls: ['./edit-library.component.css']
})
export class EditLibraryComponent {
  @Input() name?: string | null;

  pdLibrary: PdLibrary | null = null;
  isNew: boolean = false;

  constructor(protected libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService, protected tagService: LibraryTagService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute) {}

  eventsSubject: Subject<void> = new Subject<void>();
  formGroup!: FormGroup;

  saveList(eventInput: string[]) {
    let outputLib: PdEditLibrary = this.formGroup.value;
    outputLib.name = outputLib.name.trim();
    outputLib.libraryTags = eventInput;
    const libPutObserver = {
      next: () => {
        this.toastrService.success(this.isNew ? "Created" : "Edited " + this.name + " successfully");
        let newLib = outputLib.name;
        //just update the library cache (easiest to update current library usually)
        this.libraryService.unsetRecent();
        this.libraryService.getLibraryByName(newLib, {next: (val) => {
          this.router.navigate([`/libraries/${newLib}/view`]);
        }, error: (msg)=> {this.toastrService.error(msg)}, complete() {},});
      },
      error: (message: string) => {
        this.toastrService.error(message, "Couldn't " + this.isNew? "Create" : "Edit" +  " Library " +
          this.name);
      }
    }
    if(this.isNew)
      this.authService.postWithAuth<PdEditLibrary>(`libraries`,
        outputLib, libPutObserver)
    else
      this.authService.patchWithAuth<PdEditLibrary>(`libraries/${this.name}`,
        outputLib, libPutObserver)
  }

  saveEvent() {
    //console.log("saveEvent");
    this.eventsSubject.next();
  }
  
  ngOnInit(): void {
    if(typeof(this.name) !== "string") {
      this.name = "";
      this.isNew = true;
    }
    this.formGroup = this.fb.group({
      name: [this.name, Validators.required],
      recentVersion: [''],
      author: [''],
      description: [''],
    });
    if(!this.isNew)
      this.libraryService.getLibraryByName(this.name, {
        next: (value: PdLibrary) => {
          this.pdLibrary = value;
          this.formGroup.controls['recentVersion'].setValue(this.pdLibrary.recentVersion);
          this.formGroup.controls['author'].setValue(this.pdLibrary.author);
          this.formGroup.controls['description'].setValue(this.pdLibrary.description);
        },
        error: (error) => {
          this.toastrService.error(error.error.message, "Couldn't Load Object");
        },
        complete() {}
      });
  }
}
