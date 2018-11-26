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
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'movie-search', loadChildren: './movie-search/movie-search.module#MovieSearchPageModule' },
  { path: 'movie-result', loadChildren: './movie-result/movie-result.module#MovieResultPageModule' },
  { path: 'movie-query', loadChildren: './movie-query/movie-query.module#MovieQueryPageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
