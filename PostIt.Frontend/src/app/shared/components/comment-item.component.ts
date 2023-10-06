import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-comment-item',
    template: ` <p>comment works!</p> `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent {}
