import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseBoxComponent } from './response-box.component';

describe('ResponseBoxComponent', () => {
  let component: ResponseBoxComponent;
  let fixture: ComponentFixture<ResponseBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponseBoxComponent]
    });
    fixture = TestBed.createComponent(ResponseBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
