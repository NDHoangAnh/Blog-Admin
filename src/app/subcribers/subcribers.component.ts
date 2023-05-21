import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subcribers',
  templateUrl: './subcribers.component.html',
  styleUrls: ['./subcribers.component.css'],
})
export class SubcribersComponent implements OnInit {
  subscriberArray: Array<any> = [];
  constructor(private subService: SubscribersService) {}
  ngOnInit(): void {
    this.subService.loadData().subscribe((val) => {
      this.subscriberArray = val;
    });
  }

  onDelete(id: any) {
    this.subService.deleteData(id);
  }
}
