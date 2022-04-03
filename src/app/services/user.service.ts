import { Injectable } from '@angular/core';
import {UuidService} from './uuid.service';
import {ApiService} from './api.service';
import {User} from '../models/user';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static storageloaded = false;
  private static user: User;
  public static Changes = new Subject<User>();

  public static get User(): User {
    if (!this.storageloaded) {
      this.loadStorage();
    }
    return this.user;
  }

  public static get UserName(): string {
    if (!this.storageloaded) {
      this.loadStorage();
    }
    return this.user?.username || '';
  }

  public static get UserId(): string {
    if (!this.storageloaded) {
      this.loadStorage();
    }
    return this.user?.userid || '';
  }

  constructor() { }

  private static loadStorage(): void {
    let userid = localStorage.getItem('ttt_userid');
    if (userid) {
      ApiService.GET<User>('/user/' + userid).then(e => {
        this.user = e;
        this.Changes.next(e);
        this.storageloaded = true;
      });
    } else {
      this.Changes.next();
      this.storageloaded = true;
    }
  }

  static CreateUser(UserName: string): Promise<User> {
    this.user = new User();
    this.user.username = UserName;
    this.user.userid = UuidService.Create();

    return ApiService.POST<User>('/user', this.user).then(e => {
      if (e.username && e.username === UserName) {
        localStorage.setItem('ttt_userid', this.user.userid);
        this.Changes.next(e);
      }
      return e;
    });
  }
}
