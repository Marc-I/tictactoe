import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import {FormsModule} from '@angular/forms';
import { GameSelectionComponent } from './components/game-selection/game-selection.component';
import { OpponentWaitComponent } from './components/opponent-wait/opponent-wait.component';
import { GameComponent } from './components/game/game.component';
import { WaitForRevancheComponent } from './components/wait-for-revanche/wait-for-revanche.component';

@NgModule({
  declarations: [
    AppComponent,
    UserCreateComponent,
    GameSelectionComponent,
    OpponentWaitComponent,
    GameComponent,
    WaitForRevancheComponent
  ],
    imports: [
        BrowserModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
