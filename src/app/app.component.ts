import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/sampleTime';

import { MapsAPILoader } from 'angular2-google-maps/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, DoCheck {
  title = 'app works!';
  address: string = '';
  addressControl: FormControl = new FormControl();
  geocoder: any;
  lat: string;
  lng: string;
  sampler: Observable<number>;
  addressObservable: Observable<string>;

  constructor(private mapLoader: MapsAPILoader) {
    this.sampler = new Observable<number>((sub: Subscriber<number>) => {
      let i = 0;
      setInterval(() => sub.next(i++), 800)
    }).sampleTime(4000);
  }

  ngOnInit(): void {
    this.mapLoader.load().then(() => {
      console.log('google maps loaded', google);
      this.geocoder = new google.maps.Geocoder();
    }).catch((r) => console.log(r));

    this.addressObservable = this.addressControl.valueChanges.debounceTime(1000);
    this.addressObservable.subscribe(newVal => this.setLocation(newVal));
    //this.addressControl.valueChanges.debounceTime(1000).subscribe(newVal => this.setLocation(newVal));
  }

  setLocation(address: string): void {
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

  ngDoCheck(): void {
    //console.log('ngDoCheck');
  }

  ngOnChanges(): void {
    //console.log('ngOnChanges');
  }
}
