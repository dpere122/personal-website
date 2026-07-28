# Build Plan: Lazy-load Blog and Home Routes via Standalone Conversion

## Task
Convert BlogFeedComponent and TextWallComponent to standalone, update routing to use loadComponent for lazy loading, and clean up app.module.ts so the blog route loads as a separate chunk.

## Current Implementation
Both HostPageComponent (home) and BlogFeedComponent (blog) are eagerly loaded in app-routing.module.ts. BlogFeedComponent and TextWallComponent are declared in app.module.ts. TextWallComponent lives at src/app/message-box/text-wall.component.ts and dynamically creates ModelBlockComponent and GitWidgetComponent. BlogFeedComponent imports SIZE and BOXTYPE enums from app.component.ts.

## File Changes
- [modify] src/app/message-box/text-wall.component.ts — Convert TextWallComponent to standalone: add standalone: true and imports array with CommonModule, ModelBlockComponent, GitWidgetComponent.
- [modify] src/app/blog-feed/blog-feed.component.ts — Convert BlogFeedComponent to standalone: add standalone: true and imports array with CommonModule, TextWallComponent.
- [modify] src/app/app-routing.module.ts — Replace static component imports with loadComponent dynamic imports for both routes, enabling Angular's lazy-loading code splitting.
- [modify] src/app/app.module.ts — Remove BlogFeedComponent and TextWallComponent from declarations and imports arrays since they become standalone. Remove RouterModule import from here if it was only needed for these components.

## Assumptions
- ModelBlockComponent and GitWidgetComponent are already standalone or will remain declared in app.module.ts (which still loads eagerly via AppComponent).
- TextWallComponent's selector is app-text-wall and BlogFeedComponent's is app-blog-feed — matching their current usage in templates.
- The SIZE and BOXTYPE enums exported from app.component.ts remain accessible since AppComponent loads eagerly.
- No other components or directives in the app depend on BlogFeedComponent or TextWallComponent being in the NgModule declarations.

## Rollback Notes
Revert the four files to their pre-change state. The simplest rollback is a git checkout of the four touched files. If no git history, restore: (1) remove standalone: true and imports from TextWallComponent and BlogFeedComponent, (2) restore static component imports in app-routing.module.ts, (3) re-add both components to app.module.ts declarations.

## Definition of Done
- BlogFeedComponent and TextWallComponent compile as standalone (standalone: true, imports declared).
- app-routing.module.ts uses loadComponent for both '' and 'blog' routes.
- app.module.ts no longer declares BlogFeedComponent or TextWallComponent.
- ng build succeeds with no errors.
- Navigating to / and /blog both render correctly at runtime.
- Angular generates separate lazy-loaded chunks for the blog route in the build output.

## Action Steps
<!-- step-id: step-1 -->
- [x] Convert TextWallComponent to standalone
  - **Files:** src/app/message-box/text-wall.component.ts
  - **Approach:** Read the current file. Add standalone: true to the @Component decorator. Add an imports array containing CommonModule and any components/directives/pipes used in the template (ModelBlockComponent, GitWidgetComponent, and any others discovered in the template). Remove the component from app.module.ts declarations in the same step if dependencies are clear, otherwise defer to A3.
  - **Acceptance criteria:**
    - TextWallComponent has standalone: true
    - All template dependencies are in the imports array
    - No compile errors in this file
  - **Verification:** lsp_get_diagnostics on src/app/message-box/text-wall.component.ts returns no errors
  - **Risks:**
    - TextWallComponent template may use additional directives/pipes (e.g., NgIf, NgFor) that need CommonModule in imports.
    - ModelBlockComponent or GitWidgetComponent may not be standalone — if they are NgModule-declared, TextWallComponent cannot import them directly as standalone. In that case, keep TextWallComponent in app.module.ts and only lazy-load BlogFeedComponent via a routed module approach.
<!-- step-id: step-2 -->
- [x] Convert BlogFeedComponent to standalone
  - **Files:** src/app/blog-feed/blog-feed.component.ts
  - **Approach:** Read the current file. Add standalone: true to the @Component decorator. Add an imports array containing CommonModule and TextWallComponent (plus any other template dependencies). Ensure the SIZE/BOXTYPE enum imports from app.component.ts remain intact since AppComponent is eager.
  - **Acceptance criteria:**
    - BlogFeedComponent has standalone: true
    - TextWallComponent is in the imports array
    - All template dependencies are in the imports array
    - No compile errors in this file
  - **Verification:** lsp_get_diagnostics on src/app/blog-feed/blog-feed.component.ts returns no errors
  - **Risks:**
    - BlogFeedComponent template may reference additional components/directives not yet identified.
<!-- step-id: step-3 -->
- [x] Update app-routing.module.ts to lazy-load both routes
  - **Files:** src/app/app-routing.module.ts
  - **Approach:** Replace the static component imports in the routes array with loadComponent arrow functions. For the home route: loadComponent: () => import('./host-page/host-page.component').then(m => m.HostPageComponent). For the blog route: loadComponent: () => import('./blog-feed/blog-feed.component').then(m => m.BlogFeedComponent). Remove the direct import statements for these components at the top of the file.
  - **Acceptance criteria:**
    - Both routes use loadComponent with dynamic import()
    - Direct imports of HostPageComponent and BlogFeedComponent are removed from the file top
    - No compile errors
  - **Verification:** lsp_get_diagnostics on src/app/app-routing.module.ts returns no errors
  - **Risks:**
    - HostPageComponent may not yet be standalone — if it's still NgModule-declared, loadComponent will fail. Need to verify HostPageComponent standalone status first.
<!-- step-id: step-4 -->
- [x] Clean up app.module.ts
  - **Files:** src/app/app.module.ts
  - **Approach:** Remove BlogFeedComponent and TextWallComponent from the declarations array. Remove any imports that were only needed by these components (e.g., if a module was imported solely for TextWallComponent). Keep RouterModule.forRoot() since it's needed for the app shell. Verify no other declared components reference the removed ones.
  - **Acceptance criteria:**
    - BlogFeedComponent removed from declarations
    - TextWallComponent removed from declarations
    - No dangling imports in the NgModule
    - No compile errors
  - **Verification:** lsp_get_diagnostics on src/app/app.module.ts returns no errors
  - **Risks:**
    - Removing a shared NgModule import (e.g., CommonModule was only needed for TextWallComponent) could break other declared components.
<!-- step-id: step-5 -->
- [x] Build and verify lazy loading works
  - **Approach:** Run ng build to verify the full application compiles. Check the build output for separate lazy-loaded chunks. Optionally run ng serve and navigate to both / and /blog to confirm runtime behavior.
  - **Acceptance criteria:**
    - ng build completes with zero errors
    - Build output contains separate JS chunks for the blog route
    - Both routes render correctly
  - **Verification:** npm run build (or ng build) succeeds; inspect dist/ output for lazy-loaded chunks
  - **Risks:**
    - Runtime errors may surface even if the build succeeds (e.g., missing standalone imports, circular dependencies).
