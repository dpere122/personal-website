import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBlockComponent } from './main-block.component';

describe('MainBlockComponent', () => {
  let component: MainBlockComponent;
  let fixture: ComponentFixture<MainBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainBlockComponent]
    });
    fixture = TestBed.createComponent(MainBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
