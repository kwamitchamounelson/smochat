export class ChatEntity {
    id = ''
    name = 'toto'
    imageUrl = ''

    constructor(id: string, name: string, imageUrl: string) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}