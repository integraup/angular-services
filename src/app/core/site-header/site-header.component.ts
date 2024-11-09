import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'bot-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css'],
})
export class SiteHeaderComponent {
  currentUser$: Observable<User | null>;

  constructor(private firebaseAuthService: FirebaseAuthService) {
    // Assina o Observable para monitorar o estado do usuário
    this.currentUser$ = this.firebaseAuthService.currentUser$;
  }
  logout(){
    this.firebaseAuthService.logout();
  }

  ngOnInit(): void {}
}
