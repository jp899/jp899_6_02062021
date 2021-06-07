# Jean-PaulNavailles_6_02062021
Project n°6 of OpenClassrooms Web Developer training : Building a secure REST API

## Getting started

### Back-end : Install and launch the back-end server

This project has been developped/tested with node version v16.2.0.

#### Configure environment variables

Create a .env file in the root directory of the repository. 
Add these lines to use my database :
```
DB_CLUSTER='cluster0.p3gpt'
DB_USER='user1'
DB_PASSWORD='POMM8Hg2Cz1LuLzU'
SESSION_TOKEN_SECRET='RANDOM_TOKEN_SECRET'
SESSION_TOKEN_EXPIRATION_DELAY='24h'
PASSWORD_SALT_DATA='MonGrainDeSel'
EMAIL_ENCRYPTION_KEY='bf015203d405068708a9ea0b0c0d0ecf'
```

#### Install and launch the server
```
cd Jean-PaulNavailles_6_02062021
npm install
npm start
```

### Front-end

The Front-end part is not included in this repository. 
You need to clone [this repository](https://github.com/OpenClassrooms-Student-Center/dwj-projet6) and follow its installation and launch instructions.


## Modules used
- **express**, to build the HTTP API server.
- **mongoose**, to interact with the mongoDB Database.
- **dotenv**, to manage environment variables.
- **winston**, to manage logs.
- **multer**, to handle file uploading.
- **jsonwebtoken**, to secure authentification on requests.
- **bcrypt**,  to hash passwords.
- **crypto-js**,  to encrypt email adresses.
- **mongoose-unique-validator**, to ckeck unicity of email addresses.
- **express-mongo-sanitize**, to validate the entries, by replacing the characters that can be used for mongoDB injection attacks.
