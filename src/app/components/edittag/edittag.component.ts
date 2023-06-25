import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { LibraryTag } from 'src/app/models/library-tag';
import { ObjectTag } from 'src/app/models/object-tag';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-edittag',
  templateUrl: './edittag.component.html',
  styleUrls: ['./edittag.component.css']
})

export class EdittagComponent implements OnInit {
  // object/library-specific tags
  @Input() set taglist(inList: ObjectTag[] | LibraryTag[] | undefined){
    if(inList) {
      this.stringTags = Array<string>();
      inList.forEach(element => {
        this.stringTags?.push(element.tag.name);
      });
      this.stringTags.sort(this.sortFunc);
    }
  }

  @Input() entityAddress?: string | null;
  // global tags
  @Input() tagService?: TagService | null;

  @Input() saveSubject?: Observable<void> | null;

  @Output()
  save: EventEmitter<string[]> = new EventEmitter<string[]>

  @ViewChild("selectbox") selectBox!: ElementRef;

  globalTags: string[] | null = null;
  stringTags: string[] | undefined = [];

  saveSubscription: Subscription | undefined = undefined;

  saveTags(): void {
    //console.log("save tags");
    this.save.emit(this.stringTags);
  }

  sortFunc(a: string, b: string): number {
    return (a.toLowerCase() > b.toLowerCase() ? 1 : -1);
  }

  constructor(private toastrService: ToastrService) {}

  tagInputControl: FormControl = new FormControl('', Validators.required);

  deleteTag(idx: number): void {
    this.stringTags?.splice(idx, 1);
  }

  addTag(): void {
    const value: string = this.selectBox.nativeElement.value;
    let comp: string;
    if(value === "") return;
    let i: number = 0;
    for(; i < this.stringTags?.length!; i++) {
      comp = this.stringTags![i].toLowerCase();
      if(value == comp) return;
      if(value < comp) break;
    }
    this.stringTags?.splice(i, 0, value);
  }

  newTag(): void {
    let newTag: string = this.tagInputControl.value;
    newTag = newTag.trim().toLowerCase().replaceAll(' ', '-');
    //console.log(newTag);
    this.tagService?.createTag(newTag, {
      next: () => {
        this.insertTag(newTag);
        this.toastrService.success("Created Tag " + newTag);
      },
      error: (error) => {
        this.toastrService.error(error.error.message, "Couldn't Create Tag")
      },
      complete() {}
    });
    this.tagInputControl.reset();
  }

  insertTag(newTag: string): void {
    let compLower: string;
    let i: number = 0;
    for(; i < this.globalTags?.length!; i++) {
      compLower = this.globalTags![i].toLowerCase();
      /*if(newTag == compLower) return; shouldn't happen */
      if(newTag < compLower) break;
    }
    this.globalTags?.splice(i, 0, newTag);
  }

  ngOnInit(): void {
    this.tagService?.getTags({
      next: (tags: string[]) => {
        this.globalTags = tags.sort(this.sortFunc);
      },
      error: (error) => {
        //console.log(error)
        this.toastrService.error(error.error.message, "Couldn't get Tags");
      },
      complete: () =>{}
    });
    this.saveSubscription = this.saveSubject?.subscribe(() => this.saveTags());
  }

}
