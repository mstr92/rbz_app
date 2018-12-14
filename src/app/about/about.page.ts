import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(public http: Http) { }

  ngOnInit() {
  }
  test() {
      const id = 'tt1345836';
      this.http.get('http://127.0.0.1:5000/movie/details/' + id).subscribe(data => {
          const response = JSON.parse(data.text());
          console.log(response.poster)
      });

  }
}
