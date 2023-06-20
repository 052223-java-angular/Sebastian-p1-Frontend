import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LibrariesComponent } from './pages/libraries/libraries.component';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LibraryComponent } from './pages/library/library.component';
import { ObjectComponent } from './pages/object/object.component';
import { EditObjectComponent } from './pages/edit-object/edit-object.component';

const routes: Routes = [
  { path: 'libraries/:libName/:objName/edit', component: EditObjectComponent},
  { path: 'libraries/:libName/:objName', component: ObjectComponent},
  { path: 'libraries/:name', component: LibraryComponent },
  { path: 'libraries', component: LibrariesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: 'about', pathMatch: "full" },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
      bindToComponentInputs: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
