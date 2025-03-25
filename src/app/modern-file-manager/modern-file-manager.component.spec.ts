import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModernFileManagerComponent } from './modern-file-manager.component';

describe('ModernFileManagerComponent', () => {
  let component: ModernFileManagerComponent;
  let fixture: ComponentFixture<ModernFileManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModernFileManagerComponent]
    });
    fixture = TestBed.createComponent(ModernFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
