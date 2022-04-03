import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  username: string = '';

  constructor() { }

  ngOnInit(): void {
    this.username = UserService.UserName;
  }

  createUser() {
    UserService.CreateUser(this.username).then(e => {
      console.log(e);
    });
  }

}
