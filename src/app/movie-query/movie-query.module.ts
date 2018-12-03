import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MovieQueryPage } from './movie-query.page';
import {MovieSearchPageModule} from '../movie-search/movie-search.module';

const routes: Routes = [
  {
    path: '',
    component: MovieQueryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MovieQueryPage]
})
export class MovieQueryPageModule {}
