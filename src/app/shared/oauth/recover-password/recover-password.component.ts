import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../firebase-auth.service';

@Component({
  selector: 'bot-recover-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {

  recoverForm: FormGroup;

  constructor(private fb: FormBuilder, private firebaseAuthService: FirebaseAuthService){
    this.recoverForm = this.fb.group({
        email: ['', Validators.required]
      });
  }

  onSubmit() {
    console.log(this.recoverForm.valid);

    if(this.recoverForm.valid){
      this.firebaseAuthService.resetPassword(this.recoverForm.get('email')?.value).then(r =>
      {
        console.log(r);
      }
      )
    }
  }

}
