const tokenBlacklist = new Set();

function add(token) {
    tokenBlacklist.add(token);
}

function has(token) {
    return tokenBlacklist.has(token);
}

function remove(token) {
    tokenBlacklist.delete(token);
}

module.exports = {
    add,
    has,
    remove
};
