let categoriaAtual = 'filmes';
let dados = {};

function carregarSecao(categoria) {
  categoriaAtual = categoria;
  dados[categoriaAtual] = JSON.parse(localStorage.getItem(`meus_${categoriaAtual}`)) || [];
  document.getElementById("url").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("mensagemErro").textContent = "";
  listarItens();
}

function adicionarItem() {
  const url = document.getElementById("url").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const msgErro = document.getElementById("mensagemErro");
  msgErro.textContent = "";

  const extensaoValida = /\.(jpg|jpeg|png)$/i;

  if (!url.match(extensaoValida)) {
    msgErro.textContent = "URL inválida. Use .jpg, .jpeg ou .png.";
    return;
  }

  if (!nome) {
    msgErro.textContent = "Por favor, insira o nome.";
    return;
  }

  if (dados[categoriaAtual].some(item => item.url === url)) {
    msgErro.textContent = "Este item já foi adicionado.";
    return;
  }

  const novoItem = { url, nome, nota: 0 };
  dados[categoriaAtual].push(novoItem);
  salvarDados();
  listarItens();
}

function listarItens() {
  const lista = document.getElementById("listaItens");
  lista.innerHTML = "";

  dados[categoriaAtual].forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("filme-card");

    card.innerHTML = `
      <img src="${item.url}" alt="${item.nome}">
      <p>${item.nome}</p>
      <div class="estrelas" id="estrelas-${index}">
        ${gerarEstrelas(item.nota, index)}
      </div>
      <button onclick="removerItem(${index})">Remover</button>
    `;

    lista.appendChild(card);
    adicionarListenersEstrelas(index);
  });
}

function gerarEstrelas(nota, index) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const classe = i <= nota ? "estrela selecionada" : "estrela";
    html += `<span class="${classe}" data-nota="${i}" data-index="${index}">&#9733;</span>`;
  }
  return html;
}

function adicionarListenersEstrelas(index) {
  const estrelas = document.querySelectorAll(`#estrelas-${index} .estrela`);
  estrelas.forEach(estrela => {
    estrela.addEventListener("click", () => {
      const nota = parseInt(estrela.dataset.nota);
      dados[categoriaAtual][index].nota = nota;
      salvarDados();
      listarItens();
    });
  });
}

function removerItem(index) {
  dados[categoriaAtual].splice(index, 1);
  salvarDados();
  listarItens();
}

function salvarDados() {
  localStorage.setItem(`meus_${categoriaAtual}`, JSON.stringify(dados[categoriaAtual]));
}
