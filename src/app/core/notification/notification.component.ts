import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification} from '@core/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent  implements OnInit {

  notification: Notification | null = null;
  private notificationSubscription: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationSubscription = this.notificationService.notification$.subscribe(
      (notification: Notification) => {
        this.notification = notification;
        setTimeout(() => {
          this.notification = null;
        }, 5000);
      }
    );
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }


}
