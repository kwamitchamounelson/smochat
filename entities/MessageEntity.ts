export class MessageEntity {
    id = ''
    senderId = ''
    receiverId = ''
    message = ''
    date = new Date()

    constructor(id: string, senderId: string, receiverId: string, message: string, date: Date) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.date = date;
    }
}