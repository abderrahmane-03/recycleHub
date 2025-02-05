// src/app/pages/collecte/list/collecte-list.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-collecte-list',
  templateUrl: './collecte-list.component.html',
  styleUrls: ['./collecte-list.component.css']
})
export class CollecteListComponent {
  collecteList = [
    { id: 1, name: 'Collecte A', status: 'Active' },
    { id: 2, name: 'Collecte B', status: 'Completed' }
  ];
}
