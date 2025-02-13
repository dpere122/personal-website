import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelBlockComponent } from './model-block.component';

describe('ModelBlockComponent', () => {
  let component: ModelBlockComponent;
  let fixture: ComponentFixture<ModelBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelBlockComponent]
    });
    fixture = TestBed.createComponent(ModelBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
