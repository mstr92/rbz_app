import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  // { path: 'movie-search', loadChildren: './movie-search/movie-search.module#MovieSearchPageModule' },
  { path: 'movie-result', loadChildren: './movie-result/movie-result.module#MovieResultPageModule' },
  { path: 'movie-query', loadChildren: './movie-query/movie-query.module#MovieQueryPageModule' },
  { path: 'favourites', loadChildren: './favourites/favourites.module#FavouritesPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule' }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
