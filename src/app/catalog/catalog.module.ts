import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CatalogComponent } from './catalog.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { BannerRotationsComponent } from './banner-rotations/banner-rotations.component';


@NgModule({
  imports: [SharedModule, HttpClientModule],
  declarations: [CatalogComponent, SearchComponent, BannerRotationsComponent],
  exports: []
})
export class CatalogModule { }
