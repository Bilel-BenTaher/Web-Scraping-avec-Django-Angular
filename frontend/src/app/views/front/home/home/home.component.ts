import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  featuredQuotes = [
    {
      text: "Life is a mystery to be lived, not a problem to be solved.",
      author: "Gandhi",
      tags: ["Philosophy", "Inspiration"],
      authorImage: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      text: "Success is falling seven times and getting up eight.",
      author: "Japanese Proverb",
      tags: ["Motivation", "Perseverance"],
      authorImage: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      text: "Simplicity is the ultimate sophistication.",
      author: "Leonardo da Vinci",
      tags: ["Creativity", "Design"],
      authorImage: "https://randomuser.me/api/portraits/men/33.jpg"
    }
  ];
  
  recentQuotes = [
    {
      text: "Courage is not the absence of fear, but the ability to overcome it.",
      author: "Nelson Mandela",
      tags: ["Courage", "Inspiration"],
      date: "2 days ago"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      tags: ["Work", "Passion"],
      date: "3 days ago"
    }
  ];
  
}
