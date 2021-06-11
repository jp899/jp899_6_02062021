# Jean-PaulNavailles_6_02062021
Project n°6 of OpenClassrooms Web Developer training : Building a secure REST API

## Getting started

### Back-end : Install and launch the back-end server

This project has been developped/tested with node version v16.2.0.

#### Configure environment variables

Create a .env file in the root directory of the repository. 
The required variables are listed in the file .env.example .

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
