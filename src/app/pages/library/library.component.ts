import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DekenService } from 'src/app/deken.service';
import { PdEditObject } from 'src/app/models/pd-edit-object';
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
  updating: boolean = false;
  updateMsg: string = "";
  currentSubscription: any;

  constructor(private libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService, private dekenService: DekenService) {}

  persistObjs(makeObjs: {name: string, description: string}[]) {
    let pendingObjs: number = makeObjs.length;
    this.currentSubscription = [];
    for(let i: number = 0; i < pendingObjs; i++) {
      let value = makeObjs[i];
      let pdEditObject: PdEditObject = {name: value.name, description: value.description, libraryVersion: "",
        library: this.name!, author: "", helpText: "", objectTags: []};
      this.currentSubscription.push(this.authService.postWithAuth<PdEditObject>(`libraries/${this.name}`,
        pdEditObject, {
        next: (value) => {
          this.updateMsg = "saved " + pdEditObject.name;
          pendingObjs--;
          if(pendingObjs <= 0) {
            this.toastrService.success("Successfully updated library");
            this.displayNoUpdate();
            this.libraryService.unsetRecent();
            this.libraryService.getLibraryByName(this.name!, {next: (update: PdLibrary) => {
              this.pdLibrary = update;
              this.sortLib();
            }, 
            error: (msg) => {this.toastrService.error(msg, "Couldn't refresh Library")},
            complete(){}});
          }
        },
        error: (string) => {
          this.toastrService.error(string, "Failed to save object " + pdEditObject.name);
          this.currentSubscription.forEach((value: { unsubscribe: () => void; }) => {value.unsubscribe()});
          this.displayNoUpdate();
        }}));
    }
  }

  makeAllObjs(objects: {name: string, description: string}[]) {
    let makeObjs = new Array<any>();
    let currObjs = this.pdLibrary?.objects!;
    let currObj: PdObject;
    let mergeObj;
    let j: number = 0;
    let i: number = 0;
    if(objects.length > 0 && currObjs.length > 0) {
      currObj = currObjs[0];
      mergeObj = objects[0];
      outer: while (true) {
        while(mergeObj.name < currObj.name) {
          makeObjs.push(mergeObj);
          j++;
          if(j >= objects.length) break outer;
          mergeObj = objects[j];
        }
        if(mergeObj.name === currObj.name) {
          i++;
          j++;
          if(i >= currObjs.length || j >= objects.length) break outer;
          mergeObj = objects[j];
          currObj = currObjs[i];
          continue outer;
        }
        while(currObj.name < mergeObj.name) {
          i++;
          if(i >= currObjs.length) break outer;
          currObj = currObjs[i];
        }
      }
    }
    makeObjs.push(... objects.slice(j));
    this.persistObjs(makeObjs);
  }
  
  updateFromDeken() {
    this.updating = true;
    this.updateMsg = "Getting Library Info for " + this.name + " ...";
    let responseObserver = {
      next: (objects: any) => {
        this.updateMsg = "Saving objects to database...";
        this.makeAllObjs(objects);
      },
      error: (error: any) => {
        this.toastrService.error("possibly missing in deken", "Can't get Objects for " + this.name);
        this.displayNoUpdate();
      }
    };
    this.currentSubscription = this.dekenService.getAddress(this.name!, {
      next: (url: string) => {
        this.updateMsg = "Getting objects for " + this.name + " at url " + url + " ...";
        this.currentSubscription = this.dekenService.getLibrary(this.name!, url, responseObserver);
      },
      error: (error: any) => {
        this.toastrService.error("Couldn't get URL info for " + this.name);
        this.displayNoUpdate();
      }
    });
  }

  cancelUpdate() {
    if(Array.isArray(this.currentSubscription)) {
      this.currentSubscription.forEach((value) => {
        value.unsubscribe();
      })
    } else this.currentSubscription?.unsubscribe();
    this.toastrService.success("Cancelled Update");
    this.displayNoUpdate();
  }

  displayNoUpdate() {
    this.updating = false;
    this.updateMsg = "";
  }

  sortLib() {
    this.pdLibrary?.objects.sort((a, b) => 
      (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    this.pdLibrary?.objects.forEach((value: PdObject) => {
      value.objectTags.sort((a, b) => {
        return (a.tag.name > b.tag.name ? 1 : -1);
      });
    });
    this.pdLibrary?.libraryTags.sort((a,b)=>{
      return a.tag.name > b.tag.name ? 1 : -1;
    });
  }

  ngOnInit(): void {
    if(typeof(this.name) !== "string") {
      this.toastrService.error("No Library Provided");
      return;
    }
    this.libraryService.getLibraryByName(this.name, {
      next: (value: PdLibrary) => {
        this.pdLibrary = value;
        this.sortLib();
      },
      error: (message) => {
        this.toastrService.error(message, "Couldn't get library info");
      },
      complete() {},
    });
  }
}
