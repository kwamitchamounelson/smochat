export class MessageEntity {
    id = ''
    senderId = ''
    receiverId = ''
    message = ''
    date: any = new Date()

    constructor(id: string, senderId: string, receiverId: string, message: string, date: any) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.date = date;
    }
}