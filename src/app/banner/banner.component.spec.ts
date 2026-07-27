import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BannerComponent } from "./banner.component";
import { Router, NavigationEnd, Event } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Subject } from "rxjs";

describe("BannerComponent", () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let routerEvents: Subject<Event>;

  beforeEach(async () => {
    routerEvents = new Subject<Event>();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [BannerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy("navigate"),
            events: routerEvents.asObservable(),
            url: "/",
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have 4 pages", () => {
    expect(component.pages.length).toBe(4);
    expect(component.pages).toEqual(["Home", "Portfolio", "Blog", "Resume"]);
  });

  it("should toggle navbar collapse state", () => {
    expect(component.isNavbarCollapsed).toBeFalse();
    component.toggleNavbar();
    expect(component.isNavbarCollapsed).toBeTrue();
    component.toggleNavbar();
    expect(component.isNavbarCollapsed).toBeFalse();
  });

  it("should return true for active home page when route is /", () => {
    component.currentRoute = "/";
    expect(component.isActive("Home")).toBeTrue();
  });

  it("should return true for active blog page when route is /blog", () => {
    component.currentRoute = "/blog";
    expect(component.isActive("Blog")).toBeTrue();
  });

  it("should return false for non-active page", () => {
    component.currentRoute = "/";
    expect(component.isActive("Blog")).toBeFalse();
  });

  it("should navigate to home page", () => {
    const mockRouter = TestBed.inject(Router);
    component.navigateToPage("Home");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should navigate to blog page", () => {
    const mockRouter = TestBed.inject(Router);
    component.navigateToPage("Blog");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/blog"]);
  });

  it("should close navbar on navigation", () => {
    component.isNavbarCollapsed = true;
    routerEvents.next(new NavigationEnd(1, "/blog", "/blog"));
    expect(component.isNavbarCollapsed).toBeFalse();
    expect(component.currentRoute).toBe("/blog");
  });

  it("should have correct HTML structure", () => {
    const nav = fixture.nativeElement.querySelector("nav");
    expect(nav).toBeTruthy();
    expect(nav.classList.contains("navbar")).toBeTrue();
    expect(nav.classList.contains("navbar-expand-lg")).toBeTrue();

    const container = fixture.nativeElement.querySelector(".container-fluid");
    expect(container).toBeTruthy();

    const row = fixture.nativeElement.querySelector(".row");
    expect(row).toBeTruthy();

    const col = fixture.nativeElement.querySelector(".col-12");
    expect(col).toBeTruthy();
  });

  it("should have brand and nav items in correct positions", () => {
    const brand = fixture.nativeElement.querySelector(
      ".navbar-brand-container",
    );
    expect(brand).toBeTruthy();
    expect(brand.querySelector(".title").textContent).toContain("Daniel");
    expect(brand.querySelector(".sub-title").textContent).toContain(
      "Full Stack Developer",
    );

    const navItems = fixture.nativeElement.querySelectorAll(".nav-item");
    expect(navItems.length).toBe(4);
  });

  it("should not have the toggle button inside the collapsible menu container", () => {
    const collapseContainer =
      fixture.nativeElement.querySelector(".navbar-collapse");
    expect(collapseContainer).toBeTruthy();

    const toggleButton = fixture.nativeElement.querySelector(".navbar-toggler");
    expect(toggleButton).toBeTruthy();

    // Toggle button should NOT be a descendant of the collapse container
    expect(collapseContainer.contains(toggleButton)).toBeFalse();
  });
});
