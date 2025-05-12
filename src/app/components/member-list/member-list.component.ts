import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberService, Member } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  role: string | null = null;
  private hubConnection!: signalR.HubConnection;

  constructor(
    private memberService: MemberService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.loadMembers();
    this.startSignalRConnection();
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe(data => this.members = data);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.deleteMember(id).subscribe(() => {
        this.loadMembers();
      });
    }
  }

  startSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7011/hubs/members')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('📡 Connected to MemberHub'))
      .catch(err => console.error('❌ SignalR error:', err));

    this.hubConnection.on('MembersUpdated', () => {
      console.log('📢 MembersUpdated received');
      this.loadMembers();
    });
  }
}
