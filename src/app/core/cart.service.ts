import { computed, Injectable, signal } from "@angular/core";
import { Product } from "@shared/product.model";

@Injectable({ providedIn: 'root' })
export class CartService {
  cart = signal<{ product: Product; account: any; imageUrls: string[] }[]>([]);



   add(combinedItem: { product: Product; account: any; imageUrls: string[] }){
    if (!combinedItem.imageUrls || combinedItem.imageUrls.length === 0) {
      combinedItem.imageUrls = ['/assets/placeholder.png']; // Caminho para a imagem padrão
    }
    this.cart.update((oldCart) => [...oldCart, combinedItem]);

   }

   remove(combinedItem: { product: Product; account: any }){
    this.cart.update((oldCart) => oldCart.filter(p => p !== combinedItem));
   }

   get cartTotal() {
    return computed(() =>
      this.cart().reduce((total, item) => {
        const price = item.product.price || 0; // Garantir que o preço seja numérico
        const discount = item.product.discount || 0; // Garantir que o desconto seja numérico

        // Validar o desconto para estar no intervalo [0, 1]
        const validDiscount = discount >= 0 && discount <= 1 ? discount : 0;

        // Calcular o preço com desconto
        const discountedPrice = price * (1 - validDiscount);

        // Somar ao total
        return total + discountedPrice;
      }, 0)
    );
  }




}
