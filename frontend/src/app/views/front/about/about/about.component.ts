import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  team = [
    {
      name: 'Bilel BEN TAHER',
      role: 'Founder & CEO',
      bio: 'Passionate about literature and positive psychology',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      social: [
        { icon: 'fab fa-github', url: '#' },
        { icon: 'fab fa-medium', url: '#' }
      ]
    },
    {
      name: 'Élodie Martin',
      role: 'Chief Technical Officer',
      bio: ' Expert in user experience and design thinking ',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      social: [
        { icon: 'fab fa-twitter', url: '#' },
        { icon: 'fab fa-linkedin-in', url: '#' }
      ]
    },
    {
      name: 'Sophie Nguyen',
      role: 'Lead Designer',
      bio: 'Turns ideas into memorable interfaces',
      photo: 'https://randomuser.me/api/portraits/women/68.jpg',
      social: [
        { icon: 'fab fa-dribbble', url: '#' },
        { icon: 'fab fa-behance', url: '#' }
      ]
    },
    {
      name: 'Mehdi Khelifi',
      role: 'Full-Stack Developer',
      bio: 'Architect of innovative features',
      photo: 'https://randomuser.me/api/portraits/men/75.jpg',
      social: [
        { icon: 'fab fa-stack-overflow', url: '#' },
        { icon: 'fab fa-dev', url: '#' }
      ]
    },
    {
      name: 'Amélie Dubois',
      role: 'Community Manager',
      bio: 'Builds connections among quote lovers',
      photo: 'https://randomuser.me/api/portraits/women/63.jpg',
      social: [
        { icon: 'fab fa-instagram', url: '#' },
        { icon: 'fab fa-tiktok', url: '#' }
      ]
    },
    {
      name: 'Nicolas Bernard',
      role: 'Editor-in-Chief',
      bio: 'Ensures the quality and authenticity of the content',
      photo: 'https://randomuser.me/api/portraits/men/81.jpg',
      social: [
        { icon: 'fab fa-goodreads', url: '#' },
        { icon: 'fab fa-quora', url: '#' }
      ]
    }
  ];
  
}
