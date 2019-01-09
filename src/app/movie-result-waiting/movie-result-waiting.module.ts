import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MovieResultWaitingPage } from './movie-result-waiting.page';

const routes: Routes = [
  {
    path: '',
    component: MovieResultWaitingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MovieResultWaitingPage]
})
export class MovieResultWaitingPageModule {}
