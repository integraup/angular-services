// account-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AccountData } from './../../core/account-data.model';
import { AccountService } from '@core/account.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { NotificationService, NotificationType } from '@core/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  passwordForm: FormGroup;
  isFirstStep = true;
  isSellesType = false;
  ip: any;
  rules: any = {};

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private firebaseAuthService: FirebaseAuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkAccountType(); // Verifica o tipo de conta com base na URL
    this.initializeForms();
    this.GetIpUser();
  }

  initializeForms() {
    const currentDate = this.getCurrentDate();

    // Formulário principal
    this.accountForm = this.fb.group({
      type: [!this.isSellesType ? 'BUYER' : 'SELLER', Validators.required],
      person: this.fb.group({
        address: this.fb.group({
          street: ['', Validators.required],
          number: ['', Validators.required],
          complement: [''],
          city: ['', Validators.required],
          region_code: ['', Validators.required],
          country: ['BRA', Validators.required],
          postal_code: ['', Validators.required],
          locality: ['Itaim Mirim', Validators.required]
        }),
        name: ['', Validators.required],
        birth_date: ['', Validators.required],
        mother_name: ['', Validators.required],
        tax_id: ['', Validators.required],
        phones: this.fb.array([this.createPhoneGroup()])
      }),
      ...(this.isSellesType && {
        company: this.fb.group({
          address: this.fb.group({
            street: [''],
            number: [''],
            locality: [''],
            city: [''],
            region_code: [''],
            country: ['BRA'], // Pode manter padrão se sempre for o mesmo
            postal_code: ['']
          }),
          name: [''],
          tax_id: [''],
          phones: this.fb.array([this.createPhoneCompanyGroup()])
        }),
      }),
      tos_acceptance: this.fb.group({
        user_ip: ['8.8.8.8', Validators.required],
        date: [currentDate, Validators.required]
      }),
      ...(this.isSellesType && {
      business_category: ['', Validators.required],
      }),
      email: ['', [Validators.required, Validators.email]]
    });


    // Formulário de senha
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.required]
    });

    // Validação para confirmação de senha
    this.passwordForm.get('confirmPassword')?.addValidators(this.matchPasswords());
  }

  checkAccountType() {
    const type = this.route.snapshot.paramMap.get('type'); // Obtém o parâmetro 'type' da URL
    this.isSellesType = type === 'SELLER'; // Define isSellesType como true se o tipo for 'SELLER'
  }

  matchPasswords() {
    return () => {
      const password = this.passwordForm.get('password')?.value;
      const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  get personPhones() {
    return this.accountForm.get('person.phones') as FormArray;
  }

  get companyPhones() {
    var arr = this.accountForm.get('company.phones') as FormArray;
    console.log(arr);
    return arr
  }

  GetIpUser() {
    this.accountService.getUserIp().subscribe((ip) => {
      this.ip = ip;
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString();
  }

  removeCompanyPhone(index: number) {
    this.companyPhones.removeAt(index);
  }

  createPhoneGroup(): FormGroup {
    return this.fb.group({
      country: [55, Validators.required],
      area: ['', Validators.required],
      number: ['', Validators.required],
      type: ['MOBILE', Validators.required]
    });

  }

  createPhoneCompanyGroup(): FormGroup {
    return this.fb.group({
      country: [55, Validators.required],
      area: ['', Validators.required],
      number: ['', Validators.required],
      type: ['MOBILE', Validators.required]
    });

  }

  addPersonPhone() {
    this.personPhones.push(this.createPhoneGroup());
    console.log(this.personPhones);
  }

  addCompanyPhone() {
    this.companyPhones.push(this.createPhoneCompanyGroup());
    console.log(this.companyPhones);
  }

  nextStep() {
    console.log(this.passwordForm);
    if (this.passwordForm.valid) {
      this.isFirstStep = false;
    }
  }

  previousStep() {
    this.isFirstStep = true;
  }

  onSubmit() {
    console.log(this.accountForm);

    if (!this.accountForm.get('region_code')?.value) {
        this.accountForm.patchValue({
            region_code: this.accountForm.get('postal_code')?.value
        });
    }

    if (this.passwordForm.valid) {
        this.accountForm.patchValue({ email: this.passwordForm.get('email')?.value });
        if (this.accountForm.valid) {
            const accountData: AccountData = this.accountForm.value;
            const password = this.passwordForm.get('password')?.value;

            this.accountService.createAccount(accountData).subscribe({
                next: (result) => {

                  if(this.isSellesType) {
                    result.rules = {
                      "isAdmin": true,
                      "canAccessDashboard": true,
                      "canEditProducts": false
                    }
                  } else {
                    result.rules = {
                      "isAdmin": false,
                      "canAccessDashboard": false,
                      "canEditProducts": false
                    }
                  }

                    this.accountService.saveAccount(result).subscribe(() => {
                      this.firebaseAuthService.signUp(accountData.email, password, this.rules);
                    });
                },
                error: (error) => {
                    if (error?.error_messages?.length) {
                        error.error_messages.forEach((msg: any) => {
                            const fullMessage = `Erro: ${msg.description}. ${msg.errors?.join(" ")}`;
                            this.notificationService.notify(NotificationType.Error, fullMessage);
                        });
                    } else if (error.status === 404) {
                        this.notificationService.notify(NotificationType.Error, 'Nenhum pedido encontrado para este e-mail.');
                    } else {
                        this.notificationService.notify(NotificationType.Error, 'Erro ao processar a solicitação. Verifique os dados informados.');
                    }
                }
            });
        }
    }
}

}
