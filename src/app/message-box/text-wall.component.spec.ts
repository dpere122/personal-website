import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWallComponent } from './text-wall.component';

describe('TextWallComponent', () => {
  let component: TextWallComponent;
  let fixture: ComponentFixture<TextWallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextWallComponent]
    });
    fixture = TestBed.createComponent(TextWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
