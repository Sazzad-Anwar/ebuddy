const bcrypt = require('bcryptjs');

let pass = '$2a$10$sqrvfNOvLWaNGe/.Sc1NVuEsg3gIem5UXpftfN9iApcf3TtALeJGu'

const match = async () => {
    let isMatch = await bcrypt.compare('s123456', pass);
    return isMatch;
}


console.log(match);