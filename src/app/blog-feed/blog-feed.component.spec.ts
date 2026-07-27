import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlogFeedComponent } from "./blog-feed.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("BlogFeedComponent", () => {
  let component: BlogFeedComponent;
  let fixture: ComponentFixture<BlogFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogFeedComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(BlogFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
