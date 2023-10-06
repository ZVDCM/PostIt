import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-post-search-item',
  template: `
    <p>
      post-search works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostSearchComponent {

}
