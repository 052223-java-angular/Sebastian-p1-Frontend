import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PdLibrary } from 'src/app/models/pd-library';
import { PdObject } from 'src/app/models/pd-object';
import { SearchResults } from 'src/app/models/search-results';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  hasSearched = false;
  objResults: string[] = [];
  libResults: string[] = [];
  searchTerm: string = "";
  objTerms: string[] = ["objTagResults", "objectResults"];
  libTerms: string[] = ["libTagResults", "libraryResults", "authorResults"];
  searchInputControl: FormControl = new FormControl('', Validators.required);
  @ViewChild("selectBox") selectBox!: ElementRef;
  constructor(private searchService: SearchService, private toastrService: ToastrService) {}

  search() {
    this.libResults = [];
    this.objResults = [];
    // in case "enter is pressed"
    if(this.searchInputControl.invalid) return;
    this.searchTerm = this.searchInputControl.value;
    const value: string = this.selectBox.nativeElement.value;
    this.searchService.search(this.searchInputControl.value, value, {
      next: (results: SearchResults) => {
        console.log(JSON.stringify(results));
        this.objTerms.forEach((term: string) => {
          if(results[term as keyof SearchResults])
            this.objResults = this.objResults.concat(results[term as keyof SearchResults])
        })
        this.libTerms.forEach((term: string) => {
          if(results[term as keyof SearchResults])
          this.libResults = this.libResults.concat(results[term as keyof SearchResults])
        })
        this.hasSearched = true;
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message, "Couldn't get Results");
      }
    });
  }
}
