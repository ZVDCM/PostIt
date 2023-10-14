type nameType = { fileName: string; fileType: string };
export interface IImage {
    name: nameType;
    url: string;
    file: File;
}

export interface IPost {
    body: string;
    image: string;
    file: File;
}
