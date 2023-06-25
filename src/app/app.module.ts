import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { SearchComponent } from './pages/search/search.component';
import { LibrariesComponent } from './pages/libraries/libraries.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './pages/profile/profile.component';
import { LibraryComponent } from './pages/library/library.component';
import { ObjectComponent } from './pages/object/object.component';
import { EdittagComponent } from './components/edittag/edittag.component';
import { EditObjectComponent } from './pages/edit-object/edit-object.component';
import { EditLibraryComponent } from './pages/edit-library/edit-library.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NotFoundComponent,
    AboutComponent,
    SearchComponent,
    LibrariesComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    LibraryComponent,
    ObjectComponent,
    EdittagComponent,
    EditObjectComponent,
    EditLibraryComponent,
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
