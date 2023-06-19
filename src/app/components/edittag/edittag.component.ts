import { Component, Input, OnInit } from '@angular/core';
import { LibraryTag } from 'src/app/models/library-tag';
import { ObjectTag } from 'src/app/models/object-tag';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-edittag',
  templateUrl: './edittag.component.html',
  styleUrls: ['./edittag.component.css']
})
export class EdittagComponent implements OnInit{
  // object/library-specific tags
  @Input() taglist?: ObjectTag[] | LibraryTag[] | null;
  @Input() entityAddress?: string | null;
  // global tags
  @Input() tagService?: TagService | null;

  ngOnInit(): void {
      
  }
}
