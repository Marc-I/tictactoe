import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UuidService {

  constructor() { }

  static Create() {
    let a, b, c, d;
    let time = Math.round(new Date().getTime() / 1000);
    let version = window.navigator.appVersion;
    let href = window.location.href;

    // a - unix timestamp
    a = time.toString(16).substring(0, 8);

    // b - browser
    let match = version.match(/\d+/g);
    if (!match) {
      throw 'Invalid browser version string';
    }
    let sum = 0;
    for (let i = 0, ii = match.length; i < ii; ++i) {
      sum += parseInt(match[i], 10);
    }
    b = (sum * sum * sum).toString(16).substring(0, 6);

    // c - url
    c = (href.length * href.length * href.length).toString(16).substring(0, 4);

    // d - random
    d = Math.random().toString().substring(2);
    d = parseInt(d, 10);
    d = d.toString(16).substring(0, 6);

    return [a, b, c, d].join('-');
  }
}
