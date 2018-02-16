import { Session } from './Session';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Config } from './config';
import { Http } from '@angular/http';
import { BLE } from '@ionic-native/ble';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Injectable } from "@angular/core";

@Injectable()
export class BackgroundTaskService {
    INTERVAL_CHECK_NOACTIVITY = 600;
    INTERVAL_CHECK_ACTIVITY = 300;
    INTERVAL_CHECK_ACTIVITY_FIRST = 180; // Interval before user on POI confirmation
    interval: number;
    nearBeacons: Array<Object>;
    nearBeaconsList: Array<String>;

    c_Beacon_Poi: Map<String,number> = new Map<String,number>();

    currentPoi : number;

    noBluetoothAlertSent: boolean = false;

    constructor(private bg : BackgroundMode, private http : Http, private notifier : LocalNotifications, private ble : BLE, private session : Session) {
    }

    init() {
        this.interval = this.INTERVAL_CHECK_NOACTIVITY*1000;

        this.bg.on('enable').subscribe(() => {
            // Callback for internal calls
            this.scan();
        });

        this.bg.enable();
    }

    scan() {
        // Doing stuff here

        console.log('scanning');

        this.ble.isEnabled()
        .then(() => {
            this.nearBeacons = new Array<Object>();
            this.nearBeaconsList = new Array<String>();

            this.ble.scan([], 12)
            .subscribe(res => {
                if(res.name && res.name.startsWith('MiniBeacon_')) {
                    this.nearBeacons.push(res);
                    this.nearBeaconsList.push(res.name);
                }
            });

            setTimeout(() => {
                if(!this.nearBeacons.length) {
                    if(undefined !== this.session.id)
                        this.session.terminate();
                    return;
                }

                this.nearBeacons.sort((x, y) => { return y['rssi'] - x['rssi'] });
                var beacon = this.nearBeacons[0];

                if(!this.c_Beacon_Poi.has(beacon['name'])) {
                    this.http.get(Config.API_ENDPOINT + 'api/v2/poiByBeacon/' + beacon['name'])
                    .subscribe(data => {
                        const poi = data.json();
                        if(!poi._id) {
                            if(undefined !== this.session.id) {
                                this.session.terminate();
                                this.interval = this.INTERVAL_CHECK_NOACTIVITY*1000;
                            }
                            return;
                        }

                        this.c_Beacon_Poi.set(beacon['name'], poi._id);
                        if(poi._source.pushNotification && poi._source.pushNotification.trim() != "") {
                            this.notifier.schedule({
                                id: 2,
                                text: poi._source.pushNotification.trim(),
                                data: { secret: 'ds65fb16sfdb' }
                            });
                        }

                        this.takeAction(beacon);
                    });
                } else this.takeAction(beacon);
            }, 12000);
        })
        .catch(() => {
            if(!this.noBluetoothAlertSent) {
                this.notifier.schedule({
                    id: 1,
                    text: 'Pensez à allumer votre Bluetooth pour profiter pleinement des fonctionnalités d\'Enosis',
                    data: { secret: 'ds65fb16sfdb' }
                });
                this.noBluetoothAlertSent = true;
            }
        });

        setTimeout(() => {
            setTimeout(() => { this.scan(); }, this.interval);
        }, 15000)
    }

    takeAction(beacon : Object) {
        if(undefined == this.currentPoi) {
            this.currentPoi = this.c_Beacon_Poi.get(beacon['name']);
            this.interval = this.INTERVAL_CHECK_ACTIVITY_FIRST*1000;
        }

        else if(this.currentPoi != this.c_Beacon_Poi.get(beacon['name'])) {
            this.session.terminate();
            this.currentPoi = this.c_Beacon_Poi.get(beacon['name']);
            this.interval = this.INTERVAL_CHECK_ACTIVITY_FIRST*1000;
        }

        else {
            if(undefined === this.session.id) {
                this.session.init(this.currentPoi);
                this.interval = this.INTERVAL_CHECK_ACTIVITY*1000;
            }
            else
                this.session.sendHearbeat();
        }
    }
}
