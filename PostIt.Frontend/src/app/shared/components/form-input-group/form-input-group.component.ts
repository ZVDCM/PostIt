import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'form-input-group',
    template: `
        <label [htmlFor]="label">{{ label }}</label>
        <div class="p-inputgroup">
            <input
                pInputText
                [value]="value"
                [type]="type"
                [id]="label"
                [attr.aria-describedby]="label + '-help'"
                [autocomplete]="hasAutocomplete"
                #inputElement
                (input)="onChange(inputElement.value)"
                (blur)="onTouched()"
            />
            <button
                type="button"
                pButton
                icon="pi {{ icon }}"
                (click)="onClick($event)"
            ></button>
        </div>
        <small *ngIf="hint !== null" id="{{ label }}-help">{{ hint }}</small>
    `,
    styles: [
        `
            :host {
                @apply flex flex-col gap-2;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormInputGroupComponent),
            multi: true,
        },
    ],
})
export class FormInputGroupComponent implements ControlValueAccessor {
    @Input()
    public label: string = '';

    @Input()
    public hint: string | null = null;

    @Input()
    public hasAutocomplete: boolean = true;

    @Input()
    public icon: string = '';

    @Input()
    public type: string = 'text';

    @Output()
    public onButtonClick: EventEmitter<any> = new EventEmitter<any>();

    public value: string = '';
    public onChange: any = () => {};
    public onTouched: any = () => {};

    public onClick(event: any): void {
        this.onButtonClick.emit(event);
    }

    public writeValue(obj: any): void {
        this.value = obj;
    }
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
