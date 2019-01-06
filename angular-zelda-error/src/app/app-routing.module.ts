import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AnotherPageComponent} from "./another-page/another-page.component";
import {HomePageComponent} from "./home-page/home-page.component";

const routes: Routes = [
  {path: 'another', component: AnotherPageComponent},
  {path: '**', component: HomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
