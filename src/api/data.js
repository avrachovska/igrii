import * as api from './api.js'

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getAllGames() {
    return api.get('/data/games?sortBy=_createdOn%20desc');
}

export async function getRecentGames(userId){
    return api.get('/data/games?sortBy=_createdOn%20desc&distinct=category');
}

export async function getGameById(id) {
    return api.get('/data/games/' + id);
}
export async function getMyGames(userId) {
    return api.get(`/data/games?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}
export async function createGame(game) {
    return api.post('/data/games', game);
}

export async function editGame(id, game) {
    return api.put('/data/games/' + id, game);
}

export async function deleteById(id) {
    return api.del('/data/games/' + id);
}

export async function getAllComments(gameId) {
    return api.get(`/data/comments?where=gameId%3D%22${gameId}%22`);
}

export async function createComment(body) {
    return api.post('/data/comments', body);
}
