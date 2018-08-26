import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,MatCardModule ,MatPaginatorModule,MatSliderModule,MatPaginatorIntl,MatFormFieldModule ,MatInputModule ,MatDatepickerModule,MatNativeDateModule} from '@angular/material';
import { NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './_layout/layout/layout.component';
import { HeaderComponent } from './_layout/header/header.component';
import { FooterComponent } from './_layout/footer/footer.component';
import { HomeComponent } from './_layout/home/home.component';
import { NgbdPopoverConfig } from './_layout/ngbd-popover-config/ngbd-popover-config.component';
import { NgbdCarouselConfig } from './_layout/ngbd-carousel-config/ngbd-carousel-config.component';
import { CookieService } from 'ngx-cookie-service';
import { ViewCartDetailComponent } from './_layout/view-cart-detail/view-cart-detail.component';
import { DetailMerchandiseComponent } from './_layout/detail-merchandise/detail-merchandise.component';
import {MatPaginatorIntlCro} from './MatPaginatorIntlCro';
import { CommonServiceService } from './service/common-service.service';
import { CategoryDetailsComponent } from './_layout/category-details/category-details.component';
import { ContentHomeComponent } from './_layout/content-home/content-home.component';
import { LoopingRhumbusesSpinnerModule } from 'angular-epic-spinners';
import { NgxGalleryModule } from 'ngx-gallery';
import { SalesComponent } from './_layout/sales/sales.component';
import { LoginComponent } from './_layout/login/login.component';
import { RegisterComponent } from './_layout/register/register.component';
import {MatStepperModule} from '@angular/material/stepper';
import { InfoPageComponent } from './_layout/info-page/info-page.component';
import { ShippingComponent } from './_layout/shipping/shipping.component';
import { ContactComponent } from './_layout/contact/contact.component';
import { SearchDetailComponent } from './_layout/search-detail/search-detail.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { InfoCustomComponent } from './_layout/info-custom/info-custom.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NgbdPopoverConfig,
    NgbdCarouselConfig,
    ViewCartDetailComponent,
    DetailMerchandiseComponent,
    CategoryDetailsComponent,
    ContentHomeComponent,
    SalesComponent,
    LoginComponent,
    RegisterComponent,
    InfoPageComponent,
    ShippingComponent,
    ContactComponent,
    SearchDetailComponent,
    InfoCustomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatSliderModule,
    MatStepperModule,
    MatDatepickerModule,
    FormsModule,
    LoopingRhumbusesSpinnerModule,
    NgxGalleryModule,
    ReactiveFormsModule,
    MatFormFieldModule ,
    MatInputModule ,
    MatNativeDateModule,
    SlickCarouselModule,
    NgbModule.forRoot(),
  ],
  providers: [CookieService,{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro},CommonServiceService],
  bootstrap: [AppComponent]
})
export class AppModule  { }
