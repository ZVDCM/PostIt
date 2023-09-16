export interface IFormItem {
    id: string;
    label: string;
    hint: string | null;
}

export interface IForm {
    [key: string]: IFormItem;
}
