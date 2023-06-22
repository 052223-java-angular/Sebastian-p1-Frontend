import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
export class EditObjectComponent implements OnInit, AfterViewChecked {
  @Input() objName?: string | null;
  @Input() libName?: string | null;

  pdObject: PdObject | null = null;
  isNew: boolean = false;

  constructor(protected libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService, protected tagService: ObjectTagService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  eventsSubject: Subject<void> = new Subject<void>();
  formGroup!: FormGroup;

  saveList(eventInput: string[]) {
    let outputObj: PdEditObject = this.formGroup.value;
    outputObj.name = outputObj.name.trim();
    outputObj.library = outputObj.library.trim();
    outputObj.objectTags = eventInput;
    const objPutObserver = {
      next: () => {
        this.toastrService.success(this.isNew ? "Created" : "Edited " + this.objName + " successfully");
        let newLib = outputObj.library;
        let newObj = outputObj.name;
        //just update the library cache (easiest to update current library usually)
        this.libraryService.unsetRecent();
        this.libraryService.getLibraryByName(newLib, {next: (val) => {
          this.router.navigate([`/libraries/${newLib}/view/${newObj}`]);
        }, error: (msg)=> {this.toastrService.error(msg)}, complete() {},});
      },
      error: (message: string) => {
        this.toastrService.error(message, "Couldn't " + this.isNew? "Create" : "Edit" +  " Object " +
          this.objName);
      }
    }
    if(this.isNew)
      this.authService.postWithAuth<PdEditObject>(`libraries/${this.libName}`,
        outputObj, objPutObserver)
    else
      this.authService.patchWithAuth<PdEditObject>(`libraries/${this.libName}/${this.objName}`,
        outputObj, objPutObserver)
  }

  saveEvent() {
    //console.log("saveEvent");
    this.eventsSubject.next();
  }
  
  ngOnInit(): void {
    if(typeof(this.libName) !== "string") {
      this.toastrService.error("No Library Provided");
      return;
    }
    if(typeof(this.objName) !== "string") {
      this.objName = "";
      this.isNew = true;
    }
    this.formGroup = this.fb.group({
      name: [this.objName, [Validators.pattern(/^\s*\S+\s*$/)]],
      libraryVersion: [''],
      library: [{value: this.libName, disabled: this.isNew}, Validators.required],
      author: [''],
      description: [''],
      helpText: ['']
    });
    if(!this.isNew)
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

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
}
