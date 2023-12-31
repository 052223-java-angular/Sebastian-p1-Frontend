import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PdObject } from 'src/app/models/pd-object';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';
import { LikeService } from 'src/app/services/like.service';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  @Input() objName?: string | null;
  @Input() libName?: string | null;

  pdObject: PdObject | null = null;
  editingComment: boolean = false;
  commentControl: FormControl = new FormControl('', Validators.required);
  hasUserLiked: boolean = false;

  constructor(private libraryService: LibraryService, private toastrService: ToastrService,
    protected authService: AuthService, private router: Router, private route: ActivatedRoute,
    private likeService: LikeService) {}

  deleteMe() {
    this.authService.deleteWithAuth(`libraries/${this.libName}/${this.objName}`, {
      next: () => {
        this.toastrService.success("deleted object " + this.objName + " from library " + this.libName);
        this.libraryService.unsetRecent();
        this.libraryService.getLibraryByName(this.libName!, {next: (val) => {
          this.router.navigate(['../'], {relativeTo: this.route});
        }, error: (msg)=> {this.toastrService.error(msg)}, complete() {},});
      },
      error: (msg) => {
        this.toastrService.error(msg, "couldn't delete " + this.objName);
      }
    });
  }

  sortComments() {
    this.pdObject?.comments.sort((a, b) => {
      return a.timePosted < b.timePosted ? 1 : -1;
    });
  }

  sortTags() {
    this.pdObject?.objectTags.sort((a, b) => {
      return a.tag.name > b.tag.name ? 1 : -1;
    });
  }

  editComment() {
    this.editingComment = true;
  }

  cancelEdit() {
    this.commentControl.setValue("");
    this.editingComment = false;
  }

  submitComment() {
    this.authService.postWithAuth(`libraries/${this.libName}/${this.objName}/comment`, this.commentControl.value, {
      next: (id: string) => {
        this.libraryService.unsetRecent();
        this.libraryService.getObjectByAddress(this.objName!, this.libName!, {
          next: (newObj: PdObject) => {
            this.pdObject = newObj;
            this.sortComments();
            this.sortTags();
            this.editingComment = false;
            this.commentControl.setValue("");
          },
          error: (err) => {
            this.toastrService.error(err.error.message, "failed to re-fetch object for comment")
          },
          complete() {},
        });
      },
      error: (msg) => {
        this.toastrService.error(msg, "Failed to Post");
      } 
    });
  }

  toggleLike() {
    let currLike: boolean = this.hasUserLiked;
    if(currLike) {
      this.likeService.deleteObjectLike(this.libName!, this.objName!,{
        next: () => {
          this.toastrService.success("unstarred " + this.objName);
          this.hasUserLiked = false;
        },
        error: (msg: string) => {
          this.toastrService.error(msg, "Couldn't unstar " + this.objName);
        }
      })
    } else {
      this.likeService.addObjectLike(this.libName!, this.objName!, {
        next: () => {
          this.toastrService.success("starred " + this.objName);
          this.hasUserLiked = true;
        },
        error: (msg: string) => {
          this.toastrService.error(msg, "Couldn't star " + this.objName);
        }
      })
    }
  }

  ngOnInit(): void {
    if(typeof(this.objName) !== "string" || typeof(this.libName) !== "string") {
      this.toastrService.error("No Object Provided");
      return;
    }
    this.libraryService.getObjectByAddress(this.objName, this.libName, {
      next: (value: PdObject) => {
        this.pdObject = value;
        this.sortComments();
        this.sortTags();
      },
      error: (error) => {
        this.toastrService.error(error.error.message, "Couldn't Load Object");
      },
      complete() {}
    });
    if(this.authService.loggedIn)
      this.likeService.hasUserLikedObject(this.libName!, this.objName!, {
        next: (value: boolean) => {
          this.hasUserLiked = value;
        },
        error: (msg: string) => {
          this.toastrService.error(msg, "couldn't get 'likes'")
        }
      });
  }

}
