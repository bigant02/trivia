import * as firebase from 'firebase/app';
import { GameOptions } from './game-options';
export class User {
  id?: string;
  userId: string;
  name?: string;
  displayName: string;
  location?: string;
  categoryIds?: number[];
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  profilePicture?: String;
  email: string;
  idToken?: string;
  authState: firebase.User;
  roles?: any;
  tags?: string[];
  isSubscribed?: boolean;
  profilePictureUrl?: string;
  stats?: UserStats;
  isRequestedBulkUpload?: boolean;
  bulkUploadPermissionStatus: string;
  bulkUploadPermissionStatusUpdateTime: number;
  croppedImageUrl: any;
  originalImageUrl: any;
  imageType: string;
  androidPushTokens?: string[];
  iosPushTokens?: string[];
  lastGamePlayOption?: GameOptions;


  constructor(authState?: firebase.User & { name: string }) {
    if (authState) {
      this.authState = authState;
      this.userId = authState.uid;
      this.email = authState.providerData ? authState.providerData[0].email : authState.email;
      if (authState.providerData && authState.providerData[0].displayName) {
        this.displayName = authState.providerData[0].displayName;
      } else if (authState.name) {
        this.displayName = authState.name;
      } else {
        this.displayName = this.email.split('@')[0] + new Date().getTime();
      }
    }
  }
}

export class UserStats {
  leaderBoardStats?: { [key: number]: number };
  gamePlayed?: number;
  categories?: number;
  wins?: number;
  badges?: number;
  losses?: number;
  avgAnsTime?: number;
  contribution?: number;
  constructor() {
    this.leaderBoardStats = {};
  }
}

export class LeaderBoardUser {
  userId: string;
  score: number;
}
