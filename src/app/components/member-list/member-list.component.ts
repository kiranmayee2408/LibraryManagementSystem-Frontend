import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberService, Member } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class MemberListComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('🔌 SignalR disconnected from MemberHub');
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe({
      next: (data) => {
        this.members = data;
      },
      error: (err) => {
        console.error('Failed to load members:', err);
        alert('Failed to load members');
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.deleteMember(id).subscribe({
        next: () => {
          console.log('Member deleted');
          // this.loadMembers(); // SignalR will update the list
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Delete failed. See console.');
        }
      });
    }
  }

  startSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/members`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('📡 Connected to MemberHub'))
      .catch(err => console.error('SignalR error:', err));

    this.hubConnection.on('MembersUpdated', () => {
      console.log('MembersUpdated received');
      this.loadMembers();
    });
  }
}
