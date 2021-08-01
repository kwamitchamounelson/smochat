import { MessageEntity } from "./MessageEntity";

export class ChatEntity {
    id = ''
    members: string[] = []
    lastMessage: MessageEntity | null = new MessageEntity('', '', '', '', new Date());

    constructor(id: string, members: string[], lastMessage: MessageEntity | null) {
        this.id = id;
        this.members = members;
        this.lastMessage = lastMessage;
    }
}