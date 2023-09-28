import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PdLibrary } from 'src/app/models/pd-library';
import { PdObject } from 'src/app/models/pd-object';
import { AuthService } from 'src/app/services/auth.service';
import { DekenService } from 'src/app/services/deken.service';
import { LibraryService } from 'src/app/services/library.service';
import { LikeService } from 'src/app/services/like.service';
import { environment } from 'src/environments/environment';

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
  currentSubscription: Subscription | null = null;
  hasUserLiked: boolean = false;
  baseUrl = environment.apiBaseUrl;

  constructor(private libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService, private dekenService: DekenService, private likeService: LikeService) {}

    updateAllObjs(objects: Array<PdObject>) {
        let makeObjs = new Array<PdObject>();
        let currObjs = this.pdLibrary!.objects!;
        let currObj: PdObject;
        let mergeObj: PdObject;
        let j: number = 0;
        let i: number = 0;
        if(objects.length > 0) {
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
                    makeObjs.push(mergeObj);
                    i++;
                    j++;
                    if(i >= currObjs.length || j >= objects.length) break outer;
                    mergeObj = objects[j];
                    currObj = currObjs[i];
                    continue outer;
                }
                while(currObj.name < mergeObj.name) {
                    makeObjs.push(mergeObj);
                    i++;
                    if(i >= currObjs.length) break outer;
                    currObj = currObjs[i];
                }
            }
            makeObjs.push(... objects.slice(j));
            this.pdLibrary!.objects = makeObjs;
        }
    }

    displayUpdatedObjs(objects: Array<PdObject>): void {
        this.updating = false;
        this.updateMsg = "Updated objects: " + objects.map(elem => elem.name).join(", ");
        setTimeout(this.displayNoUpdate, 4000);
    }

  updateFromDeken() {
    this.updating = true;
    this.updateMsg = "Getting Library Info for " + this.name + " ...";
    let responseObserver = {
      next: (objects: Array<PdObject>) => {
        this.displayUpdatedObjs(objects);
        this.updateAllObjs(objects);
      },
      error: (_: any) => {
        this.toastrService.error("possibly missing in deken", "Can't get Objects for " + this.name);
        this.displayNoUpdate();
      }
    };
    this.currentSubscription = this.dekenService.getAddress(this.name!, {
      next: (url: string) => {
        this.updateMsg = "updating objects for " + this.name + " at url " + url + " ...";
        this.currentSubscription = this.authService.putWithAuth("deken", url, responseObserver);
      },
      error: (_: any) => {
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

  toggleLike() {
    let currLike: boolean = this.hasUserLiked;
    if(currLike) {
      this.likeService.deleteLibraryLike(this.name!, {
        next: () => {
          this.toastrService.success("unstarred " + this.name);
          this.hasUserLiked = false;
        },
        error: (msg: string) => {
          this.toastrService.error(msg, "Couldn't unstar " + this.name);
        }
      })
    } else {
      this.likeService.addLibraryLike(this.name!, {
        next: () => {
          this.toastrService.success("starred " + this.name);
          this.hasUserLiked = true;
        },
        error: (msg: string) => {
          this.toastrService.error(msg, "Couldn't star " + this.name);
        }
      })
    }
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
    if(this.authService.loggedIn)
      this.likeService.hasUserLikedLibrary(this.name, {
        next: (value: boolean) => {
          this.hasUserLiked = value;
        },
        error: (msg: string) => {
          this.toastrService.error(msg, "couldn't get 'likes'")
        }
      });
  }
}
