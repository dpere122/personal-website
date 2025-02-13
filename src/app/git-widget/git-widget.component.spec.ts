import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitWidgetComponent } from './git-widget.component';

describe('GitWidgetComponent', () => {
  let component: GitWidgetComponent;
  let fixture: ComponentFixture<GitWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GitWidgetComponent]
    });
    fixture = TestBed.createComponent(GitWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
