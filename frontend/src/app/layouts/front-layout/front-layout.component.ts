import { Component,HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-front-layout',
  templateUrl: './front-layout.component.html',
  styleUrls: ['./front-layout.component.css']
})
export class FrontLayoutComponent implements OnInit {
  isTransparent = false;
  constructor() {}

  ngOnInit(): void {this.checkScroll(); }
  @HostListener('window:scroll', [])
  checkScroll(): void {
    if (window.scrollY > 50) {
      this.isTransparent = true;
    } else {
      this.isTransparent = false;
    }
  }

}
