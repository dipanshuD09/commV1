import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Dipanshu',
        email: 'dipanshud146@gmail.com',
        password: bcrypt.hashSync('12456', 10),
    },
    {
        name: 'Kartikey',
        email: 'kartikey@abc.com',
        password: bcrypt.hashSync('12456', 10),
    },
    {
        name: 'Tarun Pal',
        email: 'tarun@abc.com',
        password: bcrypt.hashSync('12456', 10),
    }
];

export default users;