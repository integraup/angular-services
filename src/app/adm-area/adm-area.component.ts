import { Component } from '@angular/core';

@Component({
  selector: 'bot-adm-area',
  templateUrl: './adm-area.component.html',
  styleUrl: './adm-area.component.css'
})
export class AdmAreaComponent {
  productMenuOpen = false;
  categoyMenuOpen = false;

  toggleProductMenu() {
    this.productMenuOpen = !this.productMenuOpen;
  }
  toggleCategoryMenu() {
    this.categoyMenuOpen = !this.categoyMenuOpen;
  }

}
