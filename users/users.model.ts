const users = [
    {name: 'Peter Parjk', email: 'peter@marvel.com'},
    {name: 'Bruce Wayne', email: 'bruce@dc.com'},
]

export class User {
    static findAll(): Promise<any[]>{
        return Promise.resolve(users)
    }
}