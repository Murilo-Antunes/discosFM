'use strict'

const TOKEN = 'OSeechwtEXSIKEvoVSyKYbLbXgWAdtLJpZngdQTb';
const BASE_URL = 'https://api.discogs.com';
const pesquisaInput = document.getElementById('search')

let paginaAtual = 1;
let totalPagina;
let resultadoPagina1 = []
let pesquisa = 'a'
const headers = {
    'Authorization': `Discogs token=${TOKEN}`,
    'User-Agent': 'DiscosFM'
};

// estado dos filtros
let filtrosAtivos = {
    genre: null,
    decade: null,
    style: null,
}

const getAlbumPage = async (pagina = 1) => {
    if (pesquisaInput.value != '')
        pesquisa = String(pesquisaInput.value)

    const { genre, decade, style } = filtrosAtivos

    let url = `${BASE_URL}/database/search?q="${pesquisa}"&type=master&sort=want&sort_order=desc&per_page=20&page=${pagina}&token=${TOKEN}`

    if (genre)  url += `&genre=${encodeURIComponent(genre)}`
    if (style)  url += `&style=${encodeURIComponent(style)}`
    if (decade) {
        const anoInicio = parseInt(decade)  
        const anoFim = anoInicio + 9        
        url += `&year=${anoInicio}-${anoFim}`
    }

    const response = await fetch(url)
    const data = await response.json()
    return data
}

const chamarFuncao = async (pagina = 1) => {
    let dados = await getAlbumPage(pagina)

    if (pagina == 1) {
        resultadoPagina1 = dados.results
        renderizarTrending(resultadoPagina1)
    }

    renderizarAlbums(dados.results)
    verificarPagina(dados)
    alterarInformacaoPaginas()
    popularFiltros(dados.results)
    atualizarBadgeFiltro()

    if (pesquisaInput.value != '') {
        document.getElementById('trending-list').scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

// popula as opções do dropdown com base nos resultados
const popularFiltros = (albums) => {
    const generos  = [...new Set(albums.flatMap(a => a.genre  ?? []))]
    const estilos  = [...new Set(albums.flatMap(a => a.style  ?? []))]
    const decadas = [...new Set(albums.map(a => a.year ? Math.floor(a.year / 10) * 10 : null).filter(Boolean))].sort()

    renderizarOpcoesFiltro('filtro-genre',  generos,  'genre')
    renderizarOpcoesFiltro('filtro-decade', decadas,  'decade')
    renderizarOpcoesFiltro('filtro-style',  estilos,  'style')
}

const renderizarOpcoesFiltro = (containerId, opcoes, chave) => {
    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = opcoes.map(opcao => {
        const label = chave === 'decade' ? `${opcao}s` : opcao
        const ativo = chave === 'decade'
            ? filtrosAtivos[chave] === opcao
            : filtrosAtivos[chave] === opcao

        return `
            <li>
                <button 
                    class="filtro-opcao ${ativo ? 'ativo' : ''}"
                    onclick="selecionarFiltro('${chave}', '${String(opcao).replace(/'/g, "\\'")}', this)"
                >
                    ${label}
                </button>
            </li>
        `
    }).join('')
}

window.selecionarFiltro = (chave, valor, btn) => {
    // toggle: clicou no ativo → remove
    if (filtrosAtivos[chave] === valor) {
        filtrosAtivos[chave] = null
    } else {
        filtrosAtivos[chave] = valor
    }
    chamarFuncao(1)
}

const atualizarBadgeFiltro = () => {
    const total = Object.values(filtrosAtivos).filter(Boolean).length
    const badge = document.getElementById('filtro-badge')
    if (!badge) return
    badge.textContent = total
    badge.style.display = total > 0 ? 'flex' : 'none'
}

// abre/fecha dropdown
window.toggleFiltroDropdown = () => {
    const dropdown = document.getElementById('filtro-dropdown')
    dropdown.classList.toggle('aberto')
}

// fecha ao clicar fora
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('filtro-wrapper')
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('filtro-dropdown')?.classList.remove('aberto')
    }
})

window.limparFiltros = () => {
    filtrosAtivos = { genre: null, decade: null, style: null }
    chamarFuncao(1)
}

const renderizarTrending = (albums) => {
    const trendigContainer = document.getElementById('trending-list')
    const top5 = ordenarAlbums(albums)

    trendigContainer.innerHTML = top5.map(album => `
        <div class="card" onclick="selecionarCard(&quot;${encodeURIComponent(album.title)}&quot;)">
            <div class="img" style="background-image: url('${album.cover_image}');">
                <div class="card-information">
                    <div class="format"><p>${album.format[1] ?? album.format[0]}</p></div>
                    <button class="wantlist">
                        <i class="fa-regular fa-heart unliked"></i>
                    </button>
                </div>
            </div>
            <div class="album-information">
                <div class="name-year">
                    <p class="nome">${album.title.split('-')[1]?.trim() ?? album.title}</p>
                    <p class="ano">${album.year ?? '-'}</p>
                </div>
                <p class="artitas-nome">${album.title.split('-')[0].trim()}</p>
            </div>
            <div class="card-marketplace">
                <p class="classificacao">REFERENCES</p>
                <div class="preco">
                    <p class="preco_card_numero">${album.style?.[0] ?? '—'}</p>
                    <div class="movimentacao"><p>${album.type}</p></div>
                </div>
            </div>
        </div>
    `).join('')
}

const ordenarAlbums = (albums) => {
    return [...albums].sort((a, b) => b.community['want'] - a.community['want']).slice(0, 5)
}

function verificarPagina(data) {
    paginaAtual = data.pagination.page
    totalPagina = data.pagination.pages
    document.getElementById('btn-prev').disabled = paginaAtual <= 1;
    document.getElementById('btn-next').disabled = paginaAtual >= totalPagina;
}

const alterarInformacaoPaginas = () => {
    document.getElementById('info').textContent = `Página ${paginaAtual} de ${totalPagina}`;
}

const renderizarAlbums = (albums) => {
    const container = document.getElementById('explorer-list')

    container.innerHTML = albums.map(album => `
        <div class="card" onclick="selecionarCard(&quot;${encodeURIComponent(album.title)}&quot;)">
            <div class="img" style="background-image: url('${album.cover_image}');">
                <div class="card-information">
                    <div class="format"><p>${album.format[1] ?? album.format[0]}</p></div>
                    <button class="wantlist">
                        <i class="fa-regular fa-heart unliked"></i>
                    </button>
                </div>
            </div>
            <div class="album-information">
                <div class="name-year">
                    <p class="nome">${album.title.split('-')[1]?.trim() ?? album.title}</p>
                    <p class="ano">${album.year ?? '-'}</p>
                </div>
                <p class="artitas-nome">${album.title.split('-')[0].trim()}</p>
            </div>
            <div class="card-marketplace">
                <p class="classificacao">REFERENCES</p>
                <div class="preco">
                    <p class="preco_card_numero">${album.style?.[0] ?? '—'}</p>
                    <div class="movimentacao"><p>${album.type}</p></div>
                </div>
            </div>
        </div>
    `).join('')
}

document.querySelector('form.searchbox').addEventListener('submit', (e) => {
    e.preventDefault()
    chamarFuncao(1)
})

document.getElementById('btn-prev').addEventListener('click', () => chamarFuncao(paginaAtual - 1))
document.getElementById('btn-next').addEventListener('click', () => chamarFuncao(paginaAtual + 1))

chamarFuncao(1)