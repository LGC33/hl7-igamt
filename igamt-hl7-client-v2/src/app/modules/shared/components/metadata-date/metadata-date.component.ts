import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-metadata-date',
  templateUrl: './metadata-date.component.html',
  styleUrls: ['./metadata-date.component.scss'],
})
export class MetadataDateComponent implements OnInit {

  @Input() updateDate: string;
  @Input() creationDate: string;

  constructor() {
  }

  ngOnInit() {
  }

}
