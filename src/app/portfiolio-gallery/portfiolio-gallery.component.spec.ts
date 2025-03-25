import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfiolioGalleryComponent } from './portfiolio-gallery.component';

describe('PortfiolioGalleryComponent', () => {
  let component: PortfiolioGalleryComponent;
  let fixture: ComponentFixture<PortfiolioGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfiolioGalleryComponent]
    });
    fixture = TestBed.createComponent(PortfiolioGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
