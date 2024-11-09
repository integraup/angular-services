import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SquadRoutingModule } from './squad-routing.module';
import { SquadCatalogComponent } from './squad-catalog/squad-catalog.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountItemComponent } from './account-item/account-item.component';

@NgModule({
  declarations: [SquadCatalogComponent, AccountFormComponent, AccountItemComponent],
  imports: [SharedModule, SquadRoutingModule, ReactiveFormsModule],
  providers: [],
})
export class SquadModule { }
