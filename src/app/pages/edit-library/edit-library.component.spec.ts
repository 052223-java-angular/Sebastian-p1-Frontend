import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLibraryComponent } from './edit-library.component';

describe('EditLibraryComponent', () => {
  let component: EditLibraryComponent;
  let fixture: ComponentFixture<EditLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLibraryComponent]
    });
    fixture = TestBed.createComponent(EditLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
