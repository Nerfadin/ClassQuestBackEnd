export interface AlertDto {
    hasImage: boolean,
    imgSrc?: string,
    title: string,
    message: string,   
}
export interface AlertConfigDto {
    alertCount: number,
    hasAlert: false,
    requiredAlert: boolean    
}