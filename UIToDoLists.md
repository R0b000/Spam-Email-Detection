# UI TODO Lists

## Components
- [ ] **Toaster** - Toast notification component
- [ ] **Loader** - Loading spinner component
- [ ] **Menu / Sidebar** - Navigation sidebar component
- [ ] **Modal** - Generic modal dialog component
- [ ] **Confirm Modal** - Confirmation dialog component
- [ ] **Table** - Reusable table component
- [ ] **Uploader** - File upload component
- [ ] **TextEditor** - TinyMCE rich text editor component

## Pages

### Auth
- [ ] **AuthLayout** (`AuthLayout.tsx`) - Layout wrapper for auth pages
- [ ] **Login** (`Login.tsx`)
- [ ] **Register** (`Register.tsx`)

### Email
- [ ] **EmailLayout** (`EmailLayout.tsx`) - Renders sidebar + body content
- [ ] **EmailPageLayout** (`EmailPageLayout.tsx`) - Layout for compose mail and email table
- [ ] **EmailPage** (`EmailPage.tsx`)
- [ ] **EmailViewPage** (`EmailViewPage.tsx`)

## Router
- [ ] Remove `routes.ts` (unnecessary space consumption)
- [ ] Create `Manager/Route/AuthRoute.ts`
- [ ] Create `Manager/Route/EmailRoute.ts`
- [ ] Refactor Router to use new route files

## Axios / API Configuration
- [ ] Remove `useApis` (unnecessary abstraction)
- [ ] Add axios interceptors (request + response) in axios configuration
- [ ] Hide API request/response values from devtools/network in **production**
