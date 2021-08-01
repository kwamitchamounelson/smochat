export class UserEntity {
    id = ''
    phoneNumber = ''
    name = ''
    imageUrl = ''

    constructor(id: string, phoneNumber: string, name: string, imageUrl: string) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}