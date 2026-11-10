import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError, finalize, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // 1. Signals PRIVATI per lo stato (Requisito 1)
  private _users = signal<User[]>([]);
  private _selectedUser = signal<User | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Esposizione dei Signal in SOLA LETTURA tramite .asReadonly()
  readonly users = this._users.asReadonly();
  readonly selectedUser = this._selectedUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // GET: Scarica l'elenco di tutti gli utenti
  loadUsers(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<User[]>(this.apiUrl)
      .pipe(
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      )
      .subscribe(data => this._users.set(data));
  }

  // GET: Scarica un singolo utente dato il suo ID
  loadUserById(id: number): void {
    this._loading.set(true);
    this._error.set(null);
    this._selectedUser.set(null);

    this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      )
      .subscribe(user => this._selectedUser.set(user));
  }

  // POST: Crea un nuovo utente
  addUser(newUser: Omit<User, 'id'>): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.post<User>(this.apiUrl, newUser)
      .pipe(
        catchError(err => this.handleError(err)),
        finalize(() => this._loading.set(false))
      )
      .subscribe(createdUser => {
        // Aggiunge il nuovo utente in cima all'elenco locale
        this._users.update(current => [{ ...createdUser, id: Date.now() }, ...current]);
      });
  }

  // Gestione degli errori (Requisito 3)
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Stato 0 = nessuna connessione a internet o server spento
      this._error.set('Errore di rete (Stato 0): Controlla la tua connessione.');
    } else if (error.status === 404) {
      // Stato 404 = risorsa o ID non esistente
      this._error.set('Elemento non trovato (Errore 404).');
    } else {
      this._error.set(`Errore (${error.status}): ${error.message}`);
    }
    return throwError(() => error);
  }
}