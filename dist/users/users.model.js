"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { name: 'Peter Parjk', email: 'peter@marvel.com' },
    { name: 'Bruce Wayne', email: 'bruce@dc.com' },
];
class User {
    static findAll() {
        return Promise.resolve(users);
    }
}
exports.User = User;
