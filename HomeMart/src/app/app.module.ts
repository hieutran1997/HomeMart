import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,MatCardModule ,MatPaginatorModule,MatSliderModule,MatPaginatorIntl,} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
    FormsModule,
    NgbModule.forRoot(),
  ],
  providers: [CookieService,{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}],
  bootstrap: [AppComponent]
})
export class AppModule  { }
