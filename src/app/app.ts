import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { SeoService } from './core/seo/seo.service';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  /** Field injection, not just DI registration — this is what actually
   * constructs the singleton `SeoService` (and its `Router.events`
   * subscription) as the app boots, so it's live before the first
   * navigation resolves. */
  private readonly seo = inject(SeoService);
}
