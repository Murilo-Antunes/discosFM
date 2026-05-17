
const selecionarCard = async (titulo) =>{
    let card_selected = document.getElementById('card-selected')
    let home = document.getElementById('home-container')

    home.classList.add('desativado')
    card_selected.classList.add('ativado')

    let objetoID = await buscarID(titulo)
    let id = objetoID.results[0].master_id
    let pais = objetoID.results[0].country
    let label = objetoID.results[0].label[0]
    let format = objetoID.results[0].format[0]

    let album =  await buscarMaster(id)

    if (!document.startViewTransition) {
        renderizarAlbum(album, pais, label, format); // Fallback caso não suporte
        return;
    }

    document.startViewTransition(() => {
    // Atualize o DOM ou mude a rota da sua SPA aqui
    renderizarAlbum(album, pais, label, format); 
    });

}

const selecionarHome = () =>{
    let card_selected = document.getElementById('card-selected')
    let home = document.getElementById('home-container')

    home.classList.remove('desativado')
    card_selected.classList.remove('ativado')
    card_selected.innerHTML = ""
    
}

const buscarID = async (titulo) =>{
    const response = await fetch(`https://api.discogs.com/database/search?q=${titulo}&token=${TOKEN}`)

    const data = await response.json()

    return data
}

const buscarMaster = async (id) =>{
    const response = await fetch(`https://api.discogs.com/masters/${id}`)

    const data = await response.json()

    return data
}

const renderizarAlbum = (album, pais, label, format) => {
    const card_selected = document.getElementById('card-selected')
    let contador = 1


    card_selected.innerHTML = `
        <header onclick="selecionarHome()">
                <i class="fa-solid fa-arrow-left" ></i> 
                <p class="voltar" >Voltar</p>
        </header>

         <main>
                <div class="top">
                    <section class="capa">
                        <img src="${album.images[0].resource_url}" alt="">
                    </section>

                    <section class="informacoes">
                        <div class="introducao">
                            <p class="artista">// ${album['artists'][0].name}</p>
                            <h1 class="nome-album">${album.title}</h1>

                            <div class="status">
                                <p class="ano">${album.year}</p>
                                <p class="ponto">.</p>
                                <p class="pais">${pais}</p>
                                <p class="ponto">.</p>
                                <p class="rating"><span class="estrela">&#9733</span> 4.7</p>
                            </div>
                        </div>

                        <div class="especificacoes">
                            <div class="label">
                                <h2>Label</h2>
                                <h1>${label}</h1>
                            </div>
                            <div class="genero">
                                <h2>genero</h2>
                                <h1>${album.genres[0]}</h1>
                            </div>
                            <div class="formato">
                                <h2>formato</h2>
                                <h1>${format}</h1>
                            </div>
                            <div class="qualidade">
                                <h2>Qualidade disco</h2>
                                <h1>${album.data_quality}</h1>
                            </div>
                        </div>

                        <h2>estilos</h2>
                        <div class="estilos">
                            ${album.styles.map(estilo => `<div class="estilo-container"> <p>${estilo}</p> </div>`).join('')} 
                        </div>

                        <div class="marketplace-card">
                            <div class="top">
                                <div class="copias">
                                    <p> ● MARKETPLACE</p>
                                    <p class="venda">${album.num_for_sale} Cópias à Venda</p>
                                </div>

                                <div class="sacola">
                                    <i class="fa-solid fa-bag-shopping"></i>
                                </div>
                            </div>

                            <div class="bottom">
                                <div class="preco-info">
                                    <div class="low">
                                        <p>low</p>
                                        <p class="preco">$${album.lowest_price ?? '0'}</p>
                                    </div>
                                    <div class="median">
                                        <p>median</p>
                                        <p class="preco">$${album.lowest_price+30.50 ?? '0'}</p>
                                    </div>
                                    <div class="high">
                                        <p>high</p>
                                        <p class="preco">$${album.lowest_price+100.14 ?? '0'}</p>
                                    </div>
                                </div>

                                <div class="comprar">
                                    <div class="ver-copias"><p>Ver ${album.num_for_sale} copias</p></div>
                                    <div class="icon"><i class="fa-regular fa-heart"></i></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section class="tracklist">
                    <h1>Tracklist</h1>
                    <div class="tabela">
                        <table>
                            <tbody>
                                ${album.tracklist.map(musica => 
                                    `
                                    <tr>
                                        <td class="numero">#${contador++}</td>
                                        <td class="play"><div class="icon-container"><i class="fa-solid fa-play"></i></div></td>
                                        <td class="nome">${musica.title}</td>
                                        <td class="tempo">${musica.duration ?? '-'}</td>
                                    </tr>
                                    `
                                ).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
    `

}

