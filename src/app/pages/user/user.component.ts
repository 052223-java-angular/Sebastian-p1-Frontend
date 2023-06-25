import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { LikeService } from 'src/app/services/like.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  constructor(private userService: UserService, private toastrService: ToastrService,
    private likeService: LikeService){}

  @Input() userId: string | null = null;
  user: User | null = null;
  picSrcUrl: string = "//:0";
  objectLikes: string[] = [];
  libraryLikes: string[] = [];

  ngOnInit() {
    this.likeService.getUserLikes(this.userId!, {
      next: (values: {type: string, value: string}[]) => {
        values.forEach((value)=> {
          if(value.type === "object") this.objectLikes.push(value.value);
          else if(value.type === "library") this.libraryLikes.push(value.value);
        });
      },
      error: (msg: string) => {
        this.toastrService.error(msg, "Couldn't get Likes");
      }
    });
    this.userService.getUser(this.userId!, {
      next: (user: User) => {
        this.user = user;
        if(user.hasProfilePic)
          this.picSrcUrl = environment.profilePicUrl + user.id + ".jpg";
        else this.picSrcUrl = "assets/placeholderProfilePic.png"
      },
      error: (msg) => {
        this.toastrService.error(msg, "Couldn't get User")
      }
    });
  }
}
