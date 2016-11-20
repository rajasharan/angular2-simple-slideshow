import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Http, Response } from '@angular/http';

import * as marked from 'marked';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, DoCheck {
  renderer: MarkedRenderer;
  html: string;
  opacity: number = 0;
  currentSlide = 0;

  constructor(private http: Http) {}

  ngOnInit(): void {
    this.renderer = new marked.Renderer;
    this.renderer.heading = (text, level) => {
      let title: string = level === 1? 'title':'subtitle';
      let linebreak: string = level === 1? '':'';
      return `<h${level} class="${title}">${text}</h${level}>${linebreak}`
    }

    this.http.get(`slides/slide_${this.currentSlide + 1}.md`).subscribe(this.renderSlide(() => { this.currentSlide++ }));
  }

  private renderSlide(slideCalculator: Function): (Response) => void {
    return (res: Response) => {
      this.html = marked(res.text(), {
        gfm: true, renderer: this.renderer,
        highlight: (code, lang) => {
          console.log(`hljs(${lang}):\n${code}`);
          return hljs.highlightAuto(code, [lang]).value;
        }
      });
      slideCalculator();
    }
  }

  nextSlide(): void {
    this.http.get(`slides/slide_${this.currentSlide + 1}.md`).subscribe(this.renderSlide(() => { this.currentSlide++ }));
  }

  prevSlide(): void {
    this.http.get(`slides/slide_${this.currentSlide - 1}.md`).subscribe(this.renderSlide(() => { this.currentSlide-- }));
  }

  increaseOpacity(): void {
    this.opacity = 0.3;
  }

  decreaseOpacity(): void {
    this.opacity = 0;
  }

  ngDoCheck(): void {
    //console.log('ngDoCheck');
  }

  ngOnChanges(): void {
    //console.log('ngOnChanges');
  }
}
