import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'form-input',
    template: `
        <label [htmlFor]="Label">{{ Label }}</label>
        <input
            pInputText
            [type]="Type"
            [id]="Label"
            [attr.aria-describedby]="Label + '-help'"
            [autocomplete]="HasAutocomplete"
        />
        <small *ngIf="Hint !== null" id="{{ Label }}-help">{{ Hint }}</small>
    `,
    styles: [
        `
            :host {
                @apply flex flex-col gap-2;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent {
    @Input()
    public Label: string = '';

    @Input()
    public Hint: string | null = null;

    @Input()
    public HasAutocomplete: boolean = true;

    @Input()
    public Type: string = 'text';
}
