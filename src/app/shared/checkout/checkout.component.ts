import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountData } from './../../core/account-data.model';
import { AccountService } from '@core/account.service';
import { NotificationService, NotificationType } from '@core/notification.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { environment } from 'src/environments/environment';
import { CartService } from '@core/cart.service';
declare var PagSeguro: any;

@Component({
  selector: 'bot-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent implements OnInit {
  PagSeguro: any;
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  cartTotal: number = 0;
  accountData?: AccountData;
  installmentOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}x`
  }));

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private cartService: CartService,
    private firebaseAuthService: FirebaseAuthService,
    private notificationService: NotificationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { cart: any[], total: number };
    this.cartItems = state?.cart || [];
    this.cartTotal = state?.total || 0;

    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerTaxId: ['', Validators.required],
      customerPhone: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      locality: ['', Validators.required],
      city: ['', Validators.required],
      regionCode: ['', Validators.required],
      postalCode: ['', Validators.required],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      installments: [1, Validators.required],
      expMonth: ['', Validators.required],
      expYear: ['', Validators.required],
      securityCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    const userData = this.firebaseAuthService.getUserData();

  if (userData?.accountData) {
    this.accountData = userData.accountData;
    this.populateFormWithAccountData();
  }
  }

  populateFormWithAccountData(): void {
    if (this.accountData) {
      const phoneNumber = this.accountData.person.phones[0].number.toString();

      if (phoneNumber.length < 8 || phoneNumber.length > 9) {
        this.notificationService.notify(NotificationType.Error, 'Número de telefone inválido. Deve ter entre 8 e 9 dígitos.');
        return;
      }

      this.checkoutForm.patchValue({
        customerName: this.accountData.person.name,
        customerEmail: this.accountData.email,
        customerTaxId: this.accountData.person.tax_id,
        customerPhone: `${this.accountData.person.phones[0].area}${phoneNumber}`,
        street: this.accountData.person.address.street,
        number: this.accountData.person.address.number,
        complement: this.accountData.person.address.complement,
        locality: this.accountData.person.address.locality,
        city: this.accountData.person.address.city,
        regionCode: this.accountData.person.address.region_code,
        postalCode: this.accountData.person.address.postal_code,
        cardHolderName: this.accountData.person.name,
      });
    }
  }



  encryptCard() {
    if (typeof PagSeguro !== 'undefined') {
      const card = PagSeguro.encryptCard({
        publicKey: environment.pagbank.public_key,
        holder: this.checkoutForm.value.cardHolderName,
        number: this.checkoutForm.value.cardNumber,
        expMonth: this.checkoutForm.value.expMonth,
        expYear: this.checkoutForm.value.expYear,
        securityCode: this.checkoutForm.value.securityCode
      });

      const encrypted = card.encryptedCard;
      const hasErrors = card.hasErrors;
      const errors = card.errors;

      if (hasErrors) {
        console.error('Erros ao encriptar o cartão:', errors);
        return null;
      }
      return encrypted;
    } else {
      console.error('PagSeguro SDK não está carregado.');
      return null;
    }
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const encryptedCard = this.encryptCard();

      if (!encryptedCard) {
        this.notificationService.notify(NotificationType.Error, 'Erro ao encriptar o cartão. Verifique as informações e tente novamente.');
        return;
      }

     // Extração e validação do número de telefone
    const fullPhone = this.checkoutForm.value.customerPhone;
    const areaCode = fullPhone.substring(0, 2); // Considera os primeiros dois dígitos como código de área
    const phoneNumber = fullPhone.substring(2); // Remove o código de área para considerar apenas o número

    if (phoneNumber.length < 8 || phoneNumber.length > 9) {
      this.notificationService.notify(NotificationType.Error, 'Número de telefone inválido. Deve ter entre 8 e 9 dígitos.');
      return;
    }



const items = this.cartItems.map((item) => {
  const quantity = Number(this.cartItems.length);
  if (isNaN(quantity) || quantity <= 0) {
    this.notificationService.notify(NotificationType.Error, `Quantidade inválida para o item ${item.name}.`);
    return null; // Interrompe o processamento caso a quantidade seja inválida
  }

  return {
    reference_id: item.product.referenceId,  // Ajuste conforme a estrutura do item
    name: item.product.name,
    quantity: quantity, // Assegura que quantity é um número
    unit_amount: item.product.price * 100 // Multiplicado por 100 para representar centavos
  };
}).filter(item => item !== null); // Remove itens inválidos

// Verifica se todos os itens são válidos
if (items.length === 0) {
  this.notificationService.notify(NotificationType.Error, 'Carrinho inválido. Verifique os itens e tente novamente.');
  return;
}

// Taxa fixa ou percentual do marketplace (em decimal)
const marketplaceFeePercentage = 0.15; // 15%

// Total do carrinho (em centavos)
const totalCar = Math.round(this.cartService.cartTotal() * 100);

// Calcular a comissão do marketplace (em centavos)
const marketplaceFee = Math.round(totalCar * marketplaceFeePercentage);

// Valor restante para o vendedor (em centavos)
const vendorAmount = totalCar - marketplaceFee;


      const orderData = {
        customer: {
          name: this.checkoutForm.value.customerName,
          email: this.checkoutForm.value.customerEmail,
          tax_id: this.checkoutForm.value.customerTaxId,
          phones: [
            {
              country: 55, // Código do Brasil
              area: areaCode, // Primeiros dois dígitos como código de área
              number: phoneNumber,  // Número de telefone com até 9 dígitos
              type: 'MOBILE' // Define o tipo como "MOBILE"
            }
          ]
        },
        items: items,
        shipping: {
          address: {
            street: this.checkoutForm.value.street,
            number: this.checkoutForm.value.number,
            complement: this.checkoutForm.value.complement,
            locality: this.checkoutForm.value.locality,
            city: this.checkoutForm.value.city,
            region_code: this.checkoutForm.value.regionCode,
            country: "BRA",
            postal_code: this.checkoutForm.value.postalCode
          }
        },
        charges: [
          {
            reference_id: 'ref-001',
            description: 'Compra online',
            amount: {
              value: totalCar,
              currency: 'BRL'
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: this.checkoutForm.value.installments,
              capture: true,
              card: {
                encrypted: encryptedCard,
                store: false
              },
              holder: {
                name: this.checkoutForm.value.cardHolderName,
                tax_id: this.checkoutForm.value.customerTaxId
              }
            },
            splits: {
                method: "FIXED",
                receivers: [
                    {
                        account: {
                            id: environment.pagbank.account_id
                        },
                        amount: {
                            value: marketplaceFee
                        }
                    },
                    {
                        account: {
                            id: this.cartItems[0].account.id
                        },
                        amount: {
                            value: vendorAmount
                        }
                    }
                ]
            }
          }
        ]
      };

      console.log(orderData);
      this.accountService.createOrder(orderData).subscribe(
        (response) => {
          this.notificationService.notify(NotificationType.Success, 'Compra realizada com sucesso!');
           this.accountService.saveOrderData(response).subscribe(r => {
             //this.router.navigate(['//squad/bot-order']);
             this.checkoutForm.reset({
              installments: 1,
            });
            });
        },
        (error) => {
          console.error('Erro ao criar ordem:', error);
          this.notificationService.notify(NotificationType.Error, 'Erro ao processar a compra. Tente novamente.');
        }
      )
    } else {
      this.notificationService.notify(NotificationType.Error, 'Por favor, preencha todos os campos corretamente.');
    }
  }

}
