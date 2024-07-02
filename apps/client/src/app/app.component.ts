import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';

@Component({
  standalone: true,
  imports: [RouterModule, NavComponent],
  selector: 'fse-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
