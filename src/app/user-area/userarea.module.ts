import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserAreaRoutingModule } from './userarea-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [SharedModule, UserAreaRoutingModule, ReactiveFormsModule],
  providers: [],
})
export class UserAreaModule { }
