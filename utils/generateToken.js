
const generateToken = (user) => {
    return jwt.sign({ id: user }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

module.exports = generateToken;