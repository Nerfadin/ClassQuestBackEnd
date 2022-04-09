
export interface GetMessageDto {
    title: string,
    message: string,
}
export interface SendMessageToGroupDto{
    title: string,
    message: string,
    visualizedBy: string[]
    teacherId: string
}
export type MessageInGroup = {
    title: string,
    message: string,
    group: string[]
}
export interface MessageInfo {
    title: string
    createdAt: Date
}