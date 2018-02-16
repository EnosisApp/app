import { Config } from './config';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@Injectable()
export class Session
{
    id: string;
    userData: any;

    constructor(private http : Http, public storage: Storage) {}

    init(poi : number) {
      //start change nicho for debug
      console.log('start session');
      //end change nicho for debug
      this.storage.get('userData').then((userPrefs) => {
        if(userPrefs) {
          this.userData = JSON.parse(userPrefs);
          this.http.post(Config.API_ENDPOINT + 'api/v2/session/start', {
            prefs: this.userData,
            poi: poi
          })
          .subscribe(data => {
            const json = data.json();
            this.id = json.id;
          });
        }
      });
    }

    terminate() {
      this.http.post(Config.API_ENDPOINT + 'api/v2/session/stop', {session_id: this.id}).subscribe(() => { });
      this.id = undefined;
    }

    sendHearbeat() {
      this.http.post(Config.API_ENDPOINT + 'api/v2/session/heartbeat', {session_id: this.id}).subscribe(() => { });
    }
}
