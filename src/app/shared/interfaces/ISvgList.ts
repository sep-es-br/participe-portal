interface ISvgData {
    htmlText: any;
    url: string;
}

export type ISvgList = {
    [property: string]: ISvgData;
}