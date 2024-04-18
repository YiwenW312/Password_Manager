const jwt = require('jsonwebtoken');

function cookieDecryptor(request) {
    const token = request.cookies.token;  
    if (!token) {
        return false;
    } else {
        try {
            return jwt.verify(token, 'POKEMON_SECRET').username;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
}

module.exports = {
    cookieDecryptor
}