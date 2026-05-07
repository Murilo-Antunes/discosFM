'use strict'

const home = document.getElementById("home");
home.addEventListener('click', function() {
    wantlist.classList.remove("ativo")
    marketplace.classList.remove("ativo")
    settings.classList.remove("ativo")
    colecao.classList.remove("ativo");
    home.classList.add("ativo");
});

const colecao = document.getElementById("colecao");
colecao.addEventListener('click', function() {
    home.classList.remove("ativo")
    wantlist.classList.remove("ativo")
    marketplace.classList.remove("ativo")
    settings.classList.remove("ativo")
    colecao.classList.add("ativo");
});

const wantlist = document.getElementById("wantlist");
wantlist.addEventListener('click', function() {
    home.classList.remove("ativo")
    marketplace.classList.remove("ativo")
    settings.classList.remove("ativo")
    colecao.classList.remove("ativo");
    wantlist.classList.add("ativo");
});

const marketplace = document.getElementById("marketplace");
marketplace.addEventListener('click', function() {
    home.classList.remove("ativo")
    wantlist.classList.remove("ativo")
    settings.classList.remove("ativo")
    colecao.classList.remove("ativo");
    marketplace.classList.add("ativo");
});

const settings = document.getElementById("settings");
settings.addEventListener('click', function() {
    home.classList.remove("ativo")
    wantlist.classList.remove("ativo")
    colecao.classList.remove("ativo");
    marketplace.classList.remove("ativo");
    settings.classList.add("ativo");
});



//pega todos os elementos html com a classe card em coloca em uma NodeList
const card = document.querySelectorAll('.card');

//para cada elemento card em card ele retorna no callback card
card.forEach(card =>{

    //para cada card ele pega o elemento card e acha o filho de classe img dentro dele
    const alvo = card.querySelector('.img');

    card.addEventListener('mouseenter', () => alvo.classList.add('hover'));

    card.addEventListener('mouseleave', () => alvo.classList.remove('hover'));
})