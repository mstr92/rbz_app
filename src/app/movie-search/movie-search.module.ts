import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MovieSearchPage } from './movie-search.page';
import {HttpModule} from '@angular/http';

const routes: Routes = [
  {
    path: '',
    component: MovieSearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MovieSearchPage]
})
export class MovieSearchPageModule {}
