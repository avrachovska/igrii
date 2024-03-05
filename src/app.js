import {page, render} from './lib.js';
import { registerPage } from './views/register.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { getUserData } from './util.js';
import { logout } from './api/api.js';
import {allGamesPage} from './views/allGamesPage.js';
import { editPage } from './views/edit.js';
import * as api from './api/data.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';

window.api = api;

const root = document.getElementById('main-content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/allGames', allGamesPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);

updateUserNav();
page.start();

function decorateContext(ctx,next){
    ctx.updateUserNav = updateUserNav;
    ctx.render = (content) => render(content, root);

    next();
}
function updateUserNav() {
    const userData = getUserData();

    if (userData) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
    }else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}

function onLogout() {
    logout();
    updateUserNav();
    page.redirect('/');
}