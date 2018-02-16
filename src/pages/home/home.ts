import { BackgroundTaskService } from '../../BackgroundTaskService';
import { Component, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { IonicPage, AlertController, NavParams, NavController, FabContainer, Platform } from 'ionic-angular';
import 'leaflet';
import { DomSanitizer } from '@angular/platform-browser';
import { Config } from '../../config';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { BLE } from '@ionic-native/ble';

@IonicPage({
  name: 'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('animFilter', [
      state('noFilterModal', style({
        display: 'none',
        opacity: 0,
      })),
      transition('noFilterModal => bounce-in', animate('300ms ease-in', keyframes([
        style({opacity: 0, display: 'inline-block', transform: 'scale(0.3) translate3d(0,0,0)', offset: 0}),
        style({opacity: 0.9, transform: 'scale(1.1)', offset: .5}),
        style({opacity: 1, transform: 'scale(0.89)', offset: .8}),
        style({opacity: 1, transform: 'scale(1) translate3d(0,0,0)', offset: 1})
      ]))),
      transition('bounce-in => noFilterModal', animate('250ms ease-out', keyframes([
        style({opacity: 1, display: 'none', transform: 'scale(1) translate3d(0,0,0)', offset: 0}),
        style({opacity: 1, transform: 'scale(0.89)', offset: .5}),
        style({opacity: 0.9, transform: 'scale(1.1)', offset: .8}),
        style({opacity: 0, transform: 'scale(0.3) translate3d(0,0,0)', offset: 1})
      ]))),
    ]),
    trigger('animPoi', [
      state('noPoiModal', style({
        display: 'none',
        opacity: 0,
      })),
      transition('noPoiModal => bounce-in-poi', animate('250ms ease-in', keyframes([
        style({opacity: 0, display: 'inline-block', transform: 'scale(0.3) translate3d(0,0,0)', offset: 0}),
        style({opacity: 1, transform: 'scale(0.89)', offset: .5}),
        style({opacity: 1, transform: 'scale(1) translate3d(0,0,0)', offset: 1})
      ]))),
      transition('bounce-in-poi => noPoiModal', animate('250ms ease-out', keyframes([
        style({opacity: 1, display: 'none', transform: 'scale(1) translate3d(0,0,0)', offset: 0}),
        style({opacity: 0, transform: 'scale(0.3) translate3d(0,0,0)', offset: 1})
      ]))),
    ]),
    trigger('animBle', [
      state('noBleModal', style({
        display: 'none',
        opacity: 0,
      })),
      transition('noBleModal => bounce-in-ble', animate('250ms ease-in', keyframes([
        style({opacity: 0, display: 'inline-block', transform: 'scale(0.3) translate3d(0,0,0)', offset: 0}),
        style({opacity: 1, transform: 'scale(0.89)', offset: .5}),
        style({opacity: 1, transform: 'scale(1) translate3d(0,0,0)', offset: 1})
      ]))),
      transition('bounce-in-ble => noBleModal', animate('250ms ease-out', keyframes([
        style({opacity: 1, display: 'none', transform: 'scale(1) translate3d(0,0,0)', offset: 0}),
        style({opacity: 0, transform: 'scale(0.3) translate3d(0,0,0)', offset: 1})
      ]))),
    ]),
  ]
})
export class HomePage {
  map : L.Map;
  markers: any;
  markersList: any = [];
  lat: number;
  lon: number;
  coord: any;
  zoom: number;
  position: any;
  profilFull: boolean;
  prec_info: Array<{lat: number, lng: number, zoom: number}> = [];
  filterModal: boolean = false;

  // Param filters
  filters: Array<{title: string, filterName: string, activeFilter: boolean}>;
  poi: Array<{caption: string, address: string, type: string}> = [{caption: 'caption', address: 'address', type: 'cafe'}];
  isValid: boolean = false;
  noClear: boolean = false;
  accessiblePoi: boolean = false;
  categoriesPoi: Array<{}> = [];
  nbrResults: number = 0;
  filterChoice: boolean = false;
  activeFilter: boolean;
  modalResults: boolean = false;

  // Modal POI
  categModal: Array<{title: string, categName: string, activeCateg: boolean}>;
  currentPoisInfos: any;
  currentPois: Array<{}> = [];
  currentAge: string;
  currentInfos: Array<{}>;
  currentLang: Array<{}>;
  langData: any;
  noDataPoi: boolean = false;

  stateFilter: string = 'noFilterModal';
  statePoi: string = 'noPoiModal';
  stateModalBle: string = 'noBleModal';
  stateModalFull: boolean = false;

  public unregisterBackButtonAction: any;
  bluetoothActive: boolean = true;

  bleModal: boolean = false;
  noBluetoothAlertSent: boolean = false;

  showErrorConnexion: boolean = false;

  constructor(private _sanitizer: DomSanitizer, public platform: Platform, public navCtrl: NavController, public http: Http, public storage: Storage, private alertCtrl: AlertController, public navParams: NavParams, private network: Network, public toastCtrl: ToastController, public backgroundTask : BackgroundTaskService, private ble : BLE) {
    this.http = http;

    // Profil full ?
    this.profilFull = navParams.get('profilFull');

    // Filters
    this.filters = [
      { title: 'Asso', filterName: 'asso', activeFilter: false},
      { title: 'Bar', filterName: 'bar', activeFilter: false},
      { title: 'Biblio', filterName: 'library', activeFilter: false},
      { title: 'Café', filterName: 'cofee', activeFilter: false},
      { title: 'Défibrillateur', filterName: 'defibri', activeFilter: false},
      { title: 'Distributeur', filterName: 'dab', activeFilter: false},
      { title: 'Culturel', filterName: 'cultural-place', activeFilter: false},
      { title: 'Détente', filterName: 'relaxation-place', activeFilter: false},
      { title: 'Pôle santé', filterName: 'health', activeFilter: false},
      { title: 'Restaurant', filterName: 'restaurant', activeFilter: false},
      { title: 'Restau-U', filterName: 'restaurant-u', activeFilter: false},
      { title: 'Impression', filterName: 'printing', activeFilter: false}
    ];

    // Filters
    this.categModal = [
      { title: 'Musique', categName: 'music', activeCateg: false},
      { title: 'Sport', categName: 'sport', activeCateg: false},
      { title: 'Activités', categName: 'crea', activeCateg: false},
      { title: 'Langue', categName: 'langue', activeCateg: false}
    ];
  }

  refreshPointsOnMap(isMoved: boolean) : void {
    this.ble.isEnabled()
      .then(() => {
        console.log("ble enabled");
        this.bluetoothActive = true;
      })
      .catch(() => {
        console.log("ble disabled");
        this.bluetoothActive = false;
    });

    // Si la map a déjà été chargée => filtre, on clear la map
    if(this.markers) {
      this.map.removeLayer(this.markers);
    }
    this.markersList = [];
    // Save new map position in local storage
    this.position = this.map.getCenter();
    this.zoom = this.map.getZoom();

    this.prec_info = [];
    this.prec_info.push({
        lat: this.position['lat'],
        lng: this.position['lng'],
        zoom: this.zoom
    });

    this.http.post(Config.API_ENDPOINT + 'api/v2/getPois', {
      bounds: {
        northwest: this.map.getBounds().getNorthWest(),
        southeast: this.map.getBounds().getSouthEast()
      },
      accessible: this.accessiblePoi,
      categories: this.categoriesPoi
    }).subscribe(data => {
      const pois = data.json();

      // Filter initialize span number of results
      this.nbrResults = Object.keys(pois).length;

      pois.forEach(poi => {
        var icon = (poi.type == 'city') ? 'city/' + poi.count + '.png' : 'marker_' + String(poi.type) + '.svg';
        var iconMarker = L.icon({
            iconUrl:  './assets/markers/' + icon,
            iconSize: [38, 95] // taille de l'icone
        });
        var marker = L.marker([poi.lat, poi.lon], {icon: iconMarker});

        marker.on('click', (ev)=> {
          // map.setView(ev.latlng, 13);
          this.poi = [];
          this.onMarkerClicked(poi, ev);
          // Array formation about informations
          this.poi.push({
              caption: poi.caption,
              address: poi.address,
              type: poi.type
          });
          this.isValid = true;
          this.statePoi = 'bounce-in-poi';

          this.http.get('./assets/data.json').subscribe(data => {
            const lang = data.json();
            this.langData = lang['lang'];
          });

          this.http.get(Config.API_ENDPOINT + 'api/v2/getPoi/' + poi.id)
            .subscribe(data => {
              var ageData = ['16 - 20 ans', '21 - 30 ans', '31 - 40 ans', '41 - 50 ans', 'Plus de 60 ans'];

              this.currentPoisInfos = data.json();
              this.currentAge = ageData[Object.keys(this.currentPoisInfos['age'])[0]];

              if( !(this.currentAge) ) {
                this.noDataPoi = true;
              } else {
                this.noDataPoi = false;
                this.currentPois = new Array(6);
                this.currentLang = new Array(2);

                var max = Object.keys(this.currentPoisInfos.infos.activities)[0];
                this.currentPois[0] = max;
                var max1 = Object.keys(this.currentPoisInfos.infos.activities)[1];
                this.currentPois[1] = max1;
                var max2 = Object.keys(this.currentPoisInfos.infos.music)[0];
                this.currentPois[2] = max2;
                var max3 = Object.keys(this.currentPoisInfos.infos.music)[1];
                this.currentPois[3] = max3;
                var max4 = Object.keys(this.currentPoisInfos.infos.sport)[0];
                this.currentPois[4] = max4;
                var max5 = Object.keys(this.currentPoisInfos.infos.sport)[1];
                this.currentPois[5] = max5;

                for(var y = 0; y < 2; y++) {
                  var lang = Object.keys(this.currentPoisInfos.infos.lang)[y];
                  for(var i in this.langData) {
                    if(this.langData[i]['abrev'] == lang) {
                      this.currentLang[y] = this.langData[i]['text'].toLowerCase();
                      break;
                    }
                  }
                }
              }
          });
        });

        // Ici je stock les markers dans un tableau
        this.markersList.push(marker);
      });

      // // On créé le layer seulement si les items on été supprimés.
      // if(isMoved == false) {
        // Là je créé un layerGroup, obligé pour supprimer tous les markers
        this.markers = L.layerGroup(this.markersList);
        this.markers.addTo(this.map);
      // }
    });
  }

  onMarkerClicked(poi, ev) {
    var zoomT = this.map.getZoom();
    var latlng = L.latLng(poi.lat, poi.lon);
    // Manip
    var size = this.map.getSize();
    var targetPoint = this.map.project(latlng, zoomT).add([0, (size.y / 3)]),
        targetLatLng = this.map.unproject(targetPoint, zoomT);

    this.map.panTo(new L.LatLng(targetLatLng.lat, poi.lon));
  }

  ionViewDidLoad() : void {
    // watch network for a disconnect
    this.network.onDisconnect().subscribe(() => {
      this.showErrorConnexion = true;
    });
    // Watch reconnexion
    this.network.onConnect().subscribe(() => {
      console.log("RECO OK");
      this.showErrorConnexion = false;
      this.refreshPointsOnMap(true);
    });

    this.backgroundTask.init();
    //Back button Android
    this.initializeBackButtonCustomHandler();

    // If profil full
    if(this.profilFull) {
      let alert = this.alertCtrl.create({
        title: 'Merci d’avoir complété votre profil !',
        subTitle: 'Vous pouvez maintenant utiliser la carte d\’Enosis pour trouver les lieux qui vous correspondent',
        buttons: ['Continuer']
      });
      alert.present();
    }
    // If old position is find
    this.storage.get('precedent-position').then((position) => {
      if(position !== null) {
        this.coord = JSON.parse(position);
        this.lat = this.coord[0]['lat'];
        this.lon = this.coord[0]['lng'];
        this.zoom = this.coord[0]['zoom'];
      } else {
        // Bordeaux
        this.lat = 44.8310017;
        this.lon = -0.5854803;
        this.zoom = 12;
      }
      var latlng = L.latLng(this.lat, this.lon);
      this.map = L.map('map', { zoomControl: false }).setView(latlng, this.zoom);
      L.tileLayer('https://api.mapbox.com/styles/v1/enosis/cj2wh6brx001a2rodbuc31ulj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW5vc2lzIiwiYSI6ImNqMndlc2I4YjAwN2szM211b2N2YjFyOXkifQ.psO667JK0nFGUhf03ZVQ0g', {
        maxZoom: 21,
        detectRetina: true
      }).addTo(this.map);

      this.map.on('click', ev => {
        this.isValid = false;
        this.stateModalFull = false;
        this.statePoi = 'noPoiModal';
      });

      this.map.on('moveend', ev => {
        this.refreshPointsOnMap(true);
      });
      this.refreshPointsOnMap(false);
    });
  }

  // Modal POI goTo map
  goToDestination(addr) {
    this.storage.get('userGoTo').then((result) => {
        if(result) {
          this.redirectionToMap(addr);
        } else {
          this.alertGoTo(addr);
        }
    });
  }

  alertGoTo(addr) {
    let alert = this.alertCtrl.create({
      title: 'Redirection',
      message: 'Voulez-vous être redirigé vers une application map ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            console.log('Non pas de map');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.redirectionToMap(addr);
            console.log('Yes');
          }
        },
        {
          text: 'Oui, sauvegarder mon choix',
          handler: () => {
            this.storage.set('userGoTo', true);
            this.redirectionToMap(addr);
            console.log('Yes saved');
          }
        }
      ]
    });
  alert.present();
  }

  redirectionToMap(addr) {
    if(this.platform.is('ios')){
      window.open('maps://?q=' + addr, '_system');
    } else {
      window.open('geo:0,0?q=' + addr, '_system');
    }
  }

  ///////// MODAL BLE /////////
  modalBleActive() {
    if(this.bleModal) {
      this.stateModalBle = 'noBleModal';
      this.bleModal = false;
    } else {
      this.stateModalBle = 'bounce-in-ble';
      this.bleModal = true;
    }
  }

  bleCloseModal() {
    this.stateModalBle = 'noBleModal';
    this.bleModal = false;
  }

  //////// FILTERS ///////
  modalActive(fab?: FabContainer) {
    if(fab) {
      fab.close();
    }
    this.stateFilter = 'bounce-in';
  }

  closeModal() {
    this.stateFilter = 'noFilterModal';
  }

  // Gestion du filtre, add or remove
  filterAction(filterName: string, x: number) {
    var test = Object.keys(this.categoriesPoi).length;
    for (let i = 0; i < test; i++) {
      if(this.categoriesPoi[i] == filterName) {
        return this.remove(filterName, x);
      }
    }
    return this.add(filterName, x);
  }

  remove(filterName, x) {
    this.filters[x]['activeFilter'] = false;
    this.categoriesPoi.splice( this.categoriesPoi.indexOf(filterName), 1);
    this.refreshPointsOnMap(false);
    if (this.categoriesPoi.length == 0) {
      this.filterChoice = false;
    }
  }

  add(filterName, x) {
    this.filters[x]['activeFilter'] = true;
    this.categoriesPoi.push(filterName);
    this.refreshPointsOnMap(false);
    this.filterChoice = true;
  }

  // When filters are activated (click Rechercher button)
  filterActive() {
    this.filterModal = false;
    if(this.categoriesPoi.length > 0) {
      this.modalResults = true;
    } else {
      this.modalResults = false;
    }
    this.stateFilter = 'noFilterModal';
  }

  // Event when click remove modal filter
  removeFilters() {
    // On supprime tous les filtres
    this.categoriesPoi = [];
    // On désactive les SVG des filtres
    this.filters.forEach(filter => {
      filter.activeFilter = false;
    });
    this.refreshPointsOnMap(false);
    this.modalResults = false;
  }

  accessibleFilter() {
    if(this.accessiblePoi == true) {
      this.accessiblePoi = false;
    } else {
      this.accessiblePoi = true;
    }
    // Refresh map
    this.refreshPointsOnMap(false);
  }

  openModalPoi() {
    this.stateModalFull = true;
  }

  // Gestion backButton Android
  public initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
          this.customHandleBackButton();
      }, 10);
  }

  // When backbutton on Android device
  private customHandleBackButton(): void {
    if(this.statePoi = 'bounce-in-poi') {
      this.statePoi = 'noPoiModal';
    }
    this.closeModal();
  }

  // Get url modal picture
  getImg(imgName: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl('./assets/markers/modal/modal_'+imgName+'.svg');
  }
}
