'use strict'

const TOKEN = 'OSeechwtEXSIKEvoVSyKYbLbXgWAdtLJpZngdQTb';
const BASE_URL = 'https://api.discogs.com';
const pesquisaInput = document.getElementById('search')

let paginaAtual = 1;
let totalPagina;
let resultadoPagina1 = []
let statusPagina = 'home'
let pesquisa = 'a'
const headers = {
  'Authorization': `Discogs token=${TOKEN}`,
  'User-Agent': 'DiscosFM'
};



const getAlbumPage = async (pagina = 1) =>{
    if(pesquisaInput.value != "")
        pesquisa = String(pesquisaInput.value)

    console.log(pesquisa)
    
    const response = await fetch(`${BASE_URL}/database/search?q="${pesquisa}"&type=master&sort=want&sort_order=desc&per_page=20&page=${String(pagina)}&token=${TOKEN}`, headers)

    const data = await response.json()
    

    return data
}

const chamarFuncao = async (pagina) =>{ //provisório
    let dados = await getAlbumPage(pagina)


    if(pagina == 1){
        resultadoPagina1 = dados.results
        renderizarTrending(resultadoPagina1)
    }

    renderizarAlbums(dados.results)
    verificarPagina(dados)
    alterarInformacaoPaginas()
}

const renderizarTrending = (albums) =>{
    const trendigContainer = document.getElementById('trending-list')
    const top5 = ordenarAlbums(albums)

    trendigContainer.innerHTML = top5.map(album => `
        <div class="card" onclick="selecionarCard(&quot;${encodeURIComponent(album.title)}&quot;)">
            <div class="img" style="
                background-image: url('${album.cover_image}');  
            ">
                <div class="card-information">
                    <div class="format"> <p>${album.format[1] ?? album.format[0]}</p> </div>
                        <button class="wantlist">
                            <i id="coracao" class="fa-regular fa-heart unliked"></i>
                        </button>
                    </div>
                    </div>
                        <div class="album-information">
                            <div class="name-year">
                                <p class="nome">${album.title.split('-')[1].trim()}</p>
                                <p class="ano">${album.year ?? '-'}</p>
                            </div>
                            <p class="artitas-nome">${album.title.split('-')[0].trim()}</p>
                        </div>
                        <div class="card-marketplace">
                            <p class="classificacao">REFERENCES</p>
                            <div class="preco">
                                <p class="preco_card_numero">${album.style[0] ?? '—'}</p>
                                <div class="movimentacao">
                                    <p>${album.type}</p>
                                </div>
                            </div>        
                        </div>
                    </div>
                </div>
            </div>
    `).join('')
}

const ordenarAlbums = (albums) =>{
    return [...albums].sort((a,b) => b.community['want'] - a.community['want']).slice(0,5)
}

//desabilita modificação de páginas inválida
function verificarPagina(data) {
    paginaAtual = data.pagination.page
    totalPagina = data.pagination.pages
    document.getElementById('btn-prev').disabled = paginaAtual <= 1;
    document.getElementById('btn-next').disabled = paginaAtual >= totalPagina;
}

const alterarInformacaoPaginas = () =>{
    document.getElementById('info').textContent = `Página ${paginaAtual} de ${totalPagina}`;
}

//cria os cards com innerHTML
const renderizarAlbums = (albums) =>{
    const container = document.getElementById('explorer-list')

    container.innerHTML = albums.map(album => `
        <div class="card" onclick="selecionarCard(&quot;${encodeURIComponent(album.title)}&quot;)">
            <div class="img" style="
                background-image: url('${album.cover_image}');  
            ">
                <div class="card-information">
                    <div class="format"> <p>${album.format[1] ?? album.format[0]}</p> </div>
                        <button class="wantlist">
                            <i id="coracao" class="fa-regular fa-heart unliked"></i>
                        </button>
                    </div>
                    </div>
                        <div class="album-information">
                            <div class="name-year">
                                <p class="nome">${album.title.split('-')[1].trim()}</p>
                                <p class="ano">${album.year ?? '-'}</p>
                            </div>
                            <p class="artitas-nome">${album.title.split('-')[0].trim()}</p>
                        </div>
                        <div class="card-marketplace">
                            <p class="classificacao">REFERENCES</p>
                            <div class="preco">
                                <p class="preco_card_numero">${album.style[0] ?? '—'}</p>
                                <div class="movimentacao">
                                    <p>${album.type}</p>
                                </div>
                            </div>        
                        </div>
                    </div>
                </div>
            </div>
    `).join('')
}

//altera a página atual ao clicar nos botões de página
document.getElementById('btn-prev').addEventListener('click', () => {
    chamarFuncao(paginaAtual - 1);
        
});



document.getElementById('btn-next').addEventListener('click', () => {
    chamarFuncao(paginaAtual + 1);
});

const escaparTitulo = (titulo) => {
    return titulo.replace(/'/g, "\\'").replace(/"/g, '&quot;')
}

chamarFuncao(1)