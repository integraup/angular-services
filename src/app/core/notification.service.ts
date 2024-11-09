import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export interface Notification {
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  notify(type: NotificationType, message: string) {
    this.notificationSubject.next({ type, message });
  }

}
