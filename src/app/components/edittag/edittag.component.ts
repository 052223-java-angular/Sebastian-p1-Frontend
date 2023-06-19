import { Component, Input, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-edittag',
  templateUrl: './edittag.component.html',
  styleUrls: ['./edittag.component.css']
})
export class EdittagComponent implements OnInit{
  @Input() taglist?: string[] | null;
  @Input() entityAddress?: string | null;
  @Input() tagService?: TagService | null;

  ngOnInit(): void {
      
  }
}
