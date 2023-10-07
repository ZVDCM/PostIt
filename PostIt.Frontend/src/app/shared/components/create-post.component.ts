import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-create-post',
    template: `
        <section
            class="flex justify-between items-center gap-4 p-[2.45rem] bg-[var(--surface-card)]"
        >
            <i
                class="pi pi-at text-[var(--primary-color)]"
                style="font-size: 2rem"
            ></i>
            <input
                [readOnly]="true"
                (click)="onInputClick()"
                pInputText
                id="create-post"
                placeholder="Got something on your mind? Post It!"
                type="text"
                class="w-full cursor-pointer"
                style="border: none"
            />
        </section>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
    @Output()
    public onClick: EventEmitter<true> = new EventEmitter<true>();

    public onInputClick(): void {
        this.onClick.emit(true);
    }
}
