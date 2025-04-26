let filmes = JSON.parse(localStorage.getItem("meusFilmes")) || [];

function adicionarFilme() {
  const url = document.getElementById("filme").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const msgErro = document.getElementById("mensagemErro");
  msgErro.textContent = "";

  const extensaoValida = /\.(jpg|jpeg|png)$/i;

  if (!url.match(extensaoValida)) {
    msgErro.textContent = "URL inválida. Use uma imagem .jpg, .jpeg ou .png.";
    return;
  }

  if (!nome) {
    msgErro.textContent = "Por favor, insira o nome do filme.";
    return;
  }

  if (filmes.some((f) => f.url === url)) {
    msgErro.textContent = "Este filme já foi adicionado.";
    return;
  }

  const novoFilme = { url, nome, nota: 0 };
  filmes.push(novoFilme);
  salvarFilmes();
  listarFilmesNaTela();
  document.getElementById("filme").value = "";
  document.getElementById("nome").value = "";
}

function listarFilmesNaTela() {
  const elementoLista = document.getElementById("listaFilmes");
  elementoLista.innerHTML = "";

  filmes.forEach((filme, index) => {
    const filmeCard = document.createElement("div");
    filmeCard.classList.add("filme-card");

    const estrelasHTML = gerarEstrelas(filme.nota, index);

    filmeCard.innerHTML = `
      <img src="${filme.url}" alt="${filme.nome}">
      <p>${filme.nome}</p>
      <div class="estrelas" id="estrelas-${index}">${estrelasHTML}</div>
      <button onclick="removerFilme(${index})">Remover</button>
    `;

    elementoLista.appendChild(filmeCard);
    adicionarListenersEstrelas(index);
  });
}

function gerarEstrelas(nota, index) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const classe = i <= nota ? "estrela selecionada" : "estrela";
    html += `<span class="${classe}" data-index="${index}" data-nota="${i}">&#9733;</span>`;
  }
  return html;
}

function adicionarListenersEstrelas(index) {
  const estrelas = document.querySelectorAll(`#estrelas-${index} .estrela`);
  estrelas.forEach((estrela) => {
    estrela.addEventListener("click", () => {
      const nota = parseInt(estrela.dataset.nota);
      filmes[index].nota = nota;
      salvarFilmes();
      listarFilmesNaTela();
    });
  });
}

function salvarFilmes() {
  localStorage.setItem("meusFilmes", JSON.stringify(filmes));
}

function carregarFilmes() {
  listarFilmesNaTela();
}

function removerFilme(index) {
  filmes.splice(index, 1);
  salvarFilmes();
  listarFilmesNaTela();
}
