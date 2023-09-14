import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'form-input-group',
    template: `
        <label [htmlFor]="Label">{{ Label }}</label>
        <div class="p-inputgroup">
            <input
                pInputText
                [id]="Label"
                [attr.aria-describedby]="Label + '-help'"
                [autocomplete]="HasAutocomplete"
            />
            <button
                type="button"
                pButton
                icon="pi {{ Icon }}"
                (click)="onClick($event)"
            ></button>
        </div>
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
export class FormInputGroupComponent {
    @Input()
    public Label: string = '';

    @Input()
    public Hint: string | null = null;

    @Input()
    public HasAutocomplete: boolean = true;

    @Input()
    public Icon: string = '';

    @Output()
    public Do: EventEmitter<any> = new EventEmitter<any>();

    public onClick(event: any): void {
        this.Do.emit(event);
    }
}
