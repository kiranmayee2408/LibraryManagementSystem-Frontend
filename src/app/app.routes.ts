import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { IssuedBookListComponent } from './components/issued-book-list/issued-book-list.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { IssuedBookFormComponent } from './components/issued-book-form/issued-book-form.component'; // ✅ NEW
import { AuthGuard } from './guards/auth.guard';
import { BookFormComponent } from './components/book-form/book-form.component';
import { MemberFormComponent } from './components/member-form/member-form.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'books', component: BookListComponent, canActivate: [AuthGuard] },
    { path: 'issued-books', component: IssuedBookListComponent, canActivate: [AuthGuard] },
    { path: 'issued-books/manage', component: IssuedBookFormComponent, canActivate: [AuthGuard] },
    { path: 'issued-books/manage/:id', component: IssuedBookFormComponent, canActivate: [AuthGuard] },
    { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
    { path: 'books/manage', component: BookFormComponent, canActivate: [AuthGuard] },
    { path: 'books/manage/:id', component: BookFormComponent, canActivate: [AuthGuard] },
    { path: 'members/manage', component: MemberFormComponent, canActivate: [AuthGuard] },
    { path: 'members/manage/:id', component: MemberFormComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'books', pathMatch: 'full' },
    { path: '**', redirectTo: 'books' }
];
