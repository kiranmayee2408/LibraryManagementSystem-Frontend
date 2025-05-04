import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MemberService, Member } from '../../services/member.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule]
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe({
      next: (data) => {
        this.members = data;
        console.log('Members Loaded:', this.members);
      },
      error: (err) => console.error('Failed to load members', err)
    });
  }

  onDelete(memberId: number): void {
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.deleteMember(memberId).subscribe(() => {
        this.loadMembers();
      });
    }
  }
}
