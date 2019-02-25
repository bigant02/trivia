import { Component, Input, OnChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  User, Game, Category, GameStatus,
  GameInviteConstants, CalenderConstants
} from 'shared-library/shared/model';
import { AppState,  categoryDictionary } from '../../store';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
@Component({
  selector: 'game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameInviteComponent implements OnChanges, OnDestroy {

  @Input() userDict: { [key: string]: User } = {};
  @Input() game: Game;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  randomCategoryId = 0;
  gameStatus;
  subs: Subscription[] = [];
  remainingDays: number;


  constructor(private store: Store<AppState>, private utils: Utils, private userActions: UserActions) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.subs.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    if (this.game) {
      this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
      this.gameStatus = (this.game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) ? 'Random' : 'Friend';
      this.remainingDays = (GameInviteConstants.INVITATION_APPROVAL_TOTAL_DAYS -
        Math.floor(this.utils.getTimeDifference(this.game.turnAt) / (CalenderConstants.DAYS_CALCULATIONS)));
    }
  }

  rejectGameInvitation() {
    this.store.dispatch(this.userActions.rejectGameInvitation(this.game.gameId));
  }


  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}
