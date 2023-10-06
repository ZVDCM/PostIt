import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-search-item',
  template: `
    <p>
      user-search works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSearchItemComponent {

}
