import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { from } from 'rxjs/observable/from';
import 'rxjs/add/operator/sample';

import { MapsAPILoader } from 'angular2-google-maps/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  geocoder: any;
  lat: string;
  lng: string;
  sampler: Observable<number>;
  addressObservable: Observable<string>;

  constructor(private mapLoader: MapsAPILoader) {
    this.sampler = new Observable<number>((sub: Subscriber<number>) => {
      let i = 0;
      setInterval(() => sub.next(i++), 800)
    });
  }

  ngOnInit(): void {
    this.mapLoader.load().then(() => {
      console.log('google maps loaded', google);
      this.geocoder = new google.maps.Geocoder();
    }).catch((r) => console.log(r));
  }

  setLocation(address: string): void {
    //this.addressObservable = from(address.split('')).sample(this.sampler);
    console.log(address);
    this.geocoder.geocode({address}, (result, status) => {
      if (status === 'OK') {
        this.lat = result[0].geometry.location.lat();
        this.lng = result[0].geometry.location.lng();

        console.log(`lat: ${this.lat}, lng: ${this.lng}`);
      } else {
        console.log(result, status);
      }
    });
  }
}
