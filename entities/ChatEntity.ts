import { MessageEntity } from "./MessageEntity";

export class ChatEntity {
    id = ''
    members: string[] = []

    /**
     * this attribute is for firebase firstore filter, concerning array-contain filter issue
     */
    membersFilter: string[] = []
    lastMessage: MessageEntity | null = new MessageEntity('', '', '', '', new Date());

    constructor(id: string, members: string[], membersFilter: string[], lastMessage: MessageEntity | null) {
        this.id = id;
        this.members = members;
        this.membersFilter = membersFilter;
        this.lastMessage = lastMessage;
    }
}