import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittagComponent } from './edittag.component';

describe('EdittagComponent', () => {
  let component: EdittagComponent;
  let fixture: ComponentFixture<EdittagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdittagComponent]
    });
    fixture = TestBed.createComponent(EdittagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
