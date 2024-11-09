import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bot-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private firebaseAuthService: FirebaseAuthService){
    this.loginForm = this.fb.group({
        email: ['', Validators.required],
        senha: ['', Validators.required],
      });
  }

  navigateToRecover() {
    this.router.navigate(['/recover']);
  }

  onSubmit() {
    if(this.loginForm.valid){
        let login = this.loginForm.get('email')?.value;
        let senha = this.loginForm.get('senha')?.value;
        this.firebaseAuthService.login(login, senha).then(r =>{
          console.log(r);
        }
      )
    }
  }
}
