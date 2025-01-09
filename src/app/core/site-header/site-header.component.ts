import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FirebaseAuthService, UserData } from '@shared/oauth/firebase-auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'bot-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css'],
})
export class SiteHeaderComponent {
  currentUser$: Observable<UserData | null>;
  currentAccount$: Observable<any | null>;
  isAdmin: boolean;
  userData: any;

  constructor(private firebaseAuthService: FirebaseAuthService) {
    // Assina o Observable para monitorar o estado do usuário
    this.currentUser$ = this.firebaseAuthService.currentUser$;

    this.currentAccount$ = this.firebaseAuthService.currentAccount$;

    // this.currentAccount$.subscribe(user => {
    //   console.log(user.accountData.rules.isAdmin);
    // })




  }
  logout(){
    this.firebaseAuthService.logout();
  }

  ngOnInit(): void {




  }
}
