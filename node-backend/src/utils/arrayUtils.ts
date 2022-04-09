export function cleanEmptyElements( arr: Array<any>){

    var newArray = arr.filter((value: {}) => Object.keys(value).length !== 0);
    return newArray;
}