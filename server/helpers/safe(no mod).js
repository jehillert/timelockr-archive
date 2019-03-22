/*
  source: https://www.thepolyglotdeveloper.com/2018/01/encrypt-decrypt-data-nodejs-crypto-library/
  published: 1/22/2018
*/
const fs = require('fs');
const Crypto = require('crypto');

class Safe {
  constructor(filePath, password) {
    this.filePath = filePath;
    this.password = password;
  }

  encryptAsync(data) {
    return new Promise((resolve, reject) => {
      try {
        var cipher = Crypto.createCipher('aes-256-cbc', this.password);
        var encrypted = Buffer.concat([
          cipher.update(new Buffer(JSON.stringify(data), 'utf8')),
          cipher.final()
        ]);
      } catch (exception) {
        reject({ message: exception.message });
      }
      fs.writeFile(this.filePath, encrypted, error => {
        if (error) {
          reject(error);
        }
        resolve({ message: 'Encrypted!' });
      });
    });
  }

  encrypt(data) {
    try {
      var cipher = Crypto.createCipher('aes-256-cbc', this.password);
      var encrypted = Buffer.concat([
        cipher.update(new Buffer(JSON.stringify(data), 'utf8')),
        cipher.final()
      ]);
      fs.writeFileSync(this.filePath, encrypted);
      return { message: 'Encrypted!' };
    } catch (exception) {
      throw new Error(exception.message);
    }
  }

  decryptAsync() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, (error, data) => {
        if (error) {
          reject(error);
        }
        try {
          var decipher = Crypto.createDecipher('aes-256-cbc', this.password);
          var decrypted = Buffer.concat([
            decipher.update(data),
            decipher.final()
          ]);
          resolve(JSON.parse(decrypted.toString()));
        } catch (exception) {
          reject({ message: exception.message });
        }
      });
    });
  }

  decrypt() {
    try {
      var data = fs.readFileSync(this.filePath);
      var decipher = Crypto.createDecipher('aes-256-cbc', this.password);
      var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
      return JSON.parse(decrypted.toString());
    } catch (exception) {
      throw new Error(exception.message);
    }
  }
}

module.exports.Safe = Safe;