// account-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AccountData } from './../../core/account-data.model';
import { AccountService } from '@core/account.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent {
  accountForm: FormGroup;
  isSellesType: true;
  ip: any;

  constructor(private fb: FormBuilder, private accountService: AccountService, private firebaseAuthService: FirebaseAuthService) {
    this.GetIpUser();
    const currentDate = this.getCurrentDate();
    this.accountForm = this.fb.group({
      type: [!this.isSellesType ? 'SELLER' : 'BUYER' , Validators.required],
      person: this.fb.group({
        address: this.fb.group({
          street: ['', Validators.required],
          number: ['', Validators.required],
          complement: [''],
          city: ['', Validators.required],
          region_code: ['', Validators.required],
          country: ['', Validators.required],
          postal_code: ['', Validators.required],
          locality: ['', Validators.required]
        }),
        name: ['', Validators.required],
        birth_date: ['', Validators.required],
        mother_name: ['', Validators.required],
        tax_id: ['', Validators.required],
        phones: this.fb.array([this.createPhoneGroup()])
      }),
      company: this.fb.group({
        address: this.fb.group({
          street: ['Rua Silas Toledo Cruz'],
          number: ['980'],
          locality: ['Itaim Mirim'],
          city: ['Santana de Parnaíba'],
          region_code: ['SP'],
          country: ['BRA'],
          postal_code: ['32667460']
        }),
        name: ['ESPELHOS DECORATIVOS LTDA'],
        tax_id: ['89383673000181'],
        phones: this.fb.array([this.createPhoneGroup()])
      }),
      tos_acceptance: this.fb.group({
        user_ip: [this.ip, Validators.required],
        date: [currentDate, Validators.required]
      }),
      business_category: ['PROFESSIONAL_SERVICE', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.accountForm.get('type')?.valueChanges.subscribe((typeValue) => {
      const companyGroup = this.accountForm.get('company');

      if (companyGroup) {
        if (typeValue === 'SELLER') {
          companyGroup.clearValidators();
        } else {
          companyGroup.setValidators(Validators.required);
        }
        companyGroup.updateValueAndValidity();
      }
    });
  }

  get personPhones() {
    return (this.accountForm.get('person.phones') as FormArray);
  }

  get companyPhones() {
    return (this.accountForm.get('company.phones') as FormArray);
  }

 GetIpUser() {
    this.accountService.getUserIp().subscribe(ip => { this.ip = ip});
  }

  getCurrentDate(): string {
    return new Date().toISOString(); // Retorna a data atual no formato ISO
  }



  createPhoneGroup(): FormGroup {
    return this.fb.group({
      country: [55, Validators.required],
      area: ['', Validators.required],
      number: ['', Validators.required],
      type: ['MOBILE', Validators.required]
    });
  }

  addPersonPhone() {
    this.personPhones.push(this.createPhoneGroup());
  }

  addCompanyPhone() {
    this.companyPhones.push(this.createPhoneGroup());
  }

  onSubmit() {
    // console.log(this.accountForm.valid);
    // if (this.accountForm) {
    //   const accountData: AccountData = this.accountForm.value;
    //   const result = this.accountService.createAccount(accountData).subscribe(result => this.accountService.saveAccount(result).subscribe(r => {
    //         this.firebaseAuthService.signUp(accountData.email, accountData.);
    //   }));
    // }
  }
}
