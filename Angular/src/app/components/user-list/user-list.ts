import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.html'
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);

  searchTerm = signal<string>('');
  newName = signal<string>('');
  newEmail = signal<string>('');

  // Requisito 2: filtro calcolato con computed
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.userService.users().filter(u =>
      u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  });

  // Requisito 2: conteggio calcolato con computed
  totalCount = computed(() => this.filteredUsers().length);

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  onCreateUser(): void {
    if (!this.newName().trim() || !this.newEmail().trim()) return;
    
    this.userService.addUser({
      name: this.newName(),
      username: this.newName().toLowerCase().replace(/\s+/g, ''),
      email: this.newEmail(),
      phone: 'N/A',
      website: 'N/A'
    });

    this.newName.set('');
    this.newEmail.set('');
  }
}