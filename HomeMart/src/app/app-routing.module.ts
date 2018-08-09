import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout/layout.component';
import { HomeComponent } from './_layout/home/home.component';
import {ViewCartDetailComponent} from './_layout/view-cart-detail/view-cart-detail.component';
import {DetailMerchandiseComponent} from './_layout/detail-merchandise/detail-merchandise.component';
import {CategoryDetailsComponent} from './_layout/category-details/category-details.component';
import {ContentHomeComponent} from './_layout/content-home/content-home.component';
const routes: Routes = [
    {
      path:'',
      component:LayoutComponent,
      children:[
        {path:'',component:HomeComponent,pathMatch:'full'},
        {path:'chi-tiet-gio-hang',component:ViewCartDetailComponent},
        {path:'chi-tiet-hang-hoa/:mavattu',component : DetailMerchandiseComponent},
        {path:'loai-hang/:maloaivattu',component : HomeComponent}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
