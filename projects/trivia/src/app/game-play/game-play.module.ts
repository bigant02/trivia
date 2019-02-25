import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';
import {
  NewGameComponent, GameComponent,
  GameQuestionComponent, GameQuestionContinueComponent,
  GameOverComponent, GameDialogComponent, ReportGameComponent
} from './components';
import { effects, reducer } from './store';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent,
    GameQuestionComponent,
    GameQuestionContinueComponent,
    GameOverComponent,
    GameDialogComponent,
    ReportGameComponent,
  ],
  entryComponents: [
    GameDialogComponent,
    ReportGameComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    GamePlayRoutingModule,
    MatSnackBarModule,
    //ngrx feature store
    StoreModule.forFeature('gameplay', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

  ],
  providers: [
  ]
})
export class GamePlayModule { }