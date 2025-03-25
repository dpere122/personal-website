import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBoxComponent } from './portfolio-box.component';

describe('PortfolioBoxComponent', () => {
  let component: PortfolioBoxComponent;
  let fixture: ComponentFixture<PortfolioBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortfolioBoxComponent]
    });
    fixture = TestBed.createComponent(PortfolioBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
