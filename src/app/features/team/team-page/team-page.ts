import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  linkedin: string;
}

@Component({
  imports: [],
  selector: 'app-team-page',
  styleUrl: './team-page.scss',
  templateUrl: './team-page.html',
})
export class TeamPage {
  protected readonly members: readonly TeamMember[] = [
    { name: 'Tarikul Islam Soikot', linkedin: 'https://www.linkedin.com/in/tarikul-islam-soikot/' },
    { name: 'Fahima Nizam Nova', linkedin: 'https://www.linkedin.com/in/fahima-nizam-nova/' },
    { name: 'Fariha Nizam', linkedin: 'https://www.linkedin.com/in/fariha-nizam-9bb86b23a/' },
  ];
}
