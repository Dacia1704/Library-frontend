import { Component, computed, input } from '@angular/core';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-reader-header',
  standalone: true,
  imports: [],
  templateUrl: './reader-header.html',
  styleUrls: ['./reader-header.scss'],
})
export class ReaderHeaderComponent {
  members = input.required<Member[]>();
  totalElements = input<number>(0);
}
