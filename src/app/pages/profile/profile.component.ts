import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { LikeService } from 'src/app/services/like.service';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private userService: UserService, private toastrService: ToastrService,
    private likeService: LikeService, private recService: RecommendationService){}

  user: User | null = null;
  picSrcUrl: string = "//:0";
  objectLikes: string[] = [];
  libraryLikes: string[] = [];
  objectRecs: string[] = [];
  libraryRecs: string[] = [];

  ngOnInit() {
    this.likeService.getAllLikes({
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
    this.recService.getLibraryRecommendation({
      next: (libs: string[]) => {
        this.libraryRecs = libs;
      },
      error: (msg: string) => {
        this.toastrService.error(msg, "Couldn't get Library Recommendations")
      }
    });
    this.recService.getObjectRecommendation({
      next: (objs: string[]) => {
        this.objectRecs = objs;
      },
      error: (msg: string) => {
        this.toastrService.error(msg, "Couldn't get Object Recommendations")
      }
    });
    this.userService.getMe({
      next: (user: User) => {
        this.user = user;
        if(user.hasProfilePic)
          this.picSrcUrl = environment.profilePicUrl + user.id + ".jpg" + this.userService.profilePicSuffix;
        else this.picSrcUrl = "assets/placeholderProfilePic.png"
      },
      error: (msg) => {
        this.toastrService.error(msg, "Couldn't get User")
      }
    });
  }
}
