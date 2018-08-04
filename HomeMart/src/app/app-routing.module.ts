import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout/layout.component';
import { HomeComponent } from './_layout/home/home.component';
import {ViewCartDetailComponent} from './_layout/view-cart-detail/view-cart-detail.component';

const routes: Routes = [
    {
      path:'',
      component:LayoutComponent,
      children:[
        {path:'',component:HomeComponent,pathMatch:'full'},
        {path:'chi-tiet-gio-hang',component:ViewCartDetailComponent}
      ]
    }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
