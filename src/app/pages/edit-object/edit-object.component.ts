import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PdEditObject } from 'src/app/models/pd-edit-object';
import { PdObject } from 'src/app/models/pd-object';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';
import { ObjectTagService } from 'src/app/services/object-tag.service';

@Component({
  selector: 'app-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css']
})
export class EditObjectComponent implements OnInit {
  @Input() objName?: string | null;
  @Input() libName?: string | null;

  pdObject: PdObject | null = null;

  constructor(protected libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService, protected tagService: ObjectTagService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute) {}

  eventsSubject: Subject<void> = new Subject<void>();
  formGroup!: FormGroup;

  saveList(eventInput: string[]) {
    let outputObj: PdEditObject = this.formGroup.value;
    outputObj.objectTags = eventInput;
    this.authService.patchWithAuth<PdEditObject>(`libraries/${this.libName}/${this.objName}`, outputObj, {
      next: () => {
        this.toastrService.success("Edited " + this.objName + " successfully");
        let newLib = outputObj.library;
        let newObj = outputObj.name;
        //just update the library cache (easiest to update current library usually)
        this.libraryService.unsetRecent();
        this.libraryService.getLibraryByName(newLib, {next: (val) => {
          this.router.navigate([`/libraries/${newLib}/${newObj}`]);
        }, error: (msg)=> {this.toastrService.error(msg)}, complete() {},});
      },
      error: (message) => {
        console.log(message);
        this.toastrService.error(message, "Couldn't Edit Object " + this.objName);
      }
    })
  }

  saveEvent() {
    console.log("saveEvent");
    this.eventsSubject.next();
  }
  
  ngOnInit(): void {
    if(typeof(this.objName) !== "string" || typeof(this.libName) !== "string") {
      this.toastrService.error("No Object Provided");
      return;
    }
    this.formGroup = this.fb.group({
      name: [this.objName, Validators.required],
      libraryVersion: [''],
      library: [this.libName, Validators.required],
      author: [''],
      description: [''],
      helpText: ['']
    });
    this.libraryService.getObjectByAddress(this.objName, this.libName, {
      next: (value: PdObject) => {
        this.pdObject = value;
        this.formGroup.controls['libraryVersion'].setValue(this.pdObject.libraryVersion);
        this.formGroup.controls['author'].setValue(this.pdObject.author);
        this.formGroup.controls['description'].setValue(this.pdObject.description);
        this.formGroup.controls['helpText'].setValue(this.pdObject.helpText);
      },
      error: (error) => {
        this.toastrService.error(error.error.message, "Couldn't Load Object");
      },
      complete() {}
    });
  }
}
