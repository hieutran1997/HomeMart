import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout/layout.component';
import { HomeComponent } from './_layout/home/home.component';
import { ViewCartDetailComponent } from './_layout/view-cart-detail/view-cart-detail.component';
import { DetailMerchandiseComponent } from './_layout/detail-merchandise/detail-merchandise.component';
import { SalesComponent } from './_layout/sales/sales.component';
import { LoginComponent } from './_layout/login/login.component';
import { RegisterComponent } from './_layout/register/register.component';

const routes: Routes = [
    {
      path:'',
      component:LayoutComponent,
      children:[
        {path:'',component:HomeComponent,pathMatch:'full'},
        {path:'chi-tiet-gio-hang',component:ViewCartDetailComponent},
        {path:'chi-tiet-hang-hoa/:mavattu',component : DetailMerchandiseComponent},
        {path:'loai-hang/:maloaivattu',component : HomeComponent},
        {path:'chuong-trinh-khuyen-mai',component:SalesComponent}
      ]
    },
    {
      path:'dang-nhap',
      component : LoginComponent
    },
    {
      path:'dang-ky',
      component:RegisterComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes ,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
