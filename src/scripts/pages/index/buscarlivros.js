const input = document.getElementById("buscadorLivros");
const sugestaoBox = document.getElementById("sugestoesLivros");
const detalhesLivro = document.getElementById("detalhesLivro");
const tituloLivro = document.getElementById("tituloLivro");
const autorLivro = document.getElementById("autorLivro");
const downloadLivro = document.getElementById("downloadLivro");
const capaLivro = document.getElementById("capaLivro");

let debounceTimer;

async function buscarLivros(termo) {
  const response = await fetch(
    `https://gutendex.com/books/?languages=pt&search=${encodeURIComponent(
      termo
    )}`
  );
  const data = await response.json();
  return data.results;
}

function mostrarSugestoes(livros) {
  const maxSugestoes = 5;
  sugestaoBox.innerHTML = "";

  livros.slice(0, maxSugestoes).forEach((livro) => {
    const div = document.createElement("div");
    div.textContent = livro.title;
    div.addEventListener("click", () => {
      input.value = livro.title;
      sugestaoBox.innerHTML = "";
      exibirDetalhesLivro(livro);
    });
    sugestaoBox.appendChild(div);
  });
}

function exibirDetalhesLivro(livro) {
  tituloLivro.textContent = livro.title;
  autorLivro.textContent =
    livro.authors.map((a) => a.name).join(", ") || "Autor desconhecido";

  const formatos = livro.formats;

  // Limpa os containers específicos
  const downloadEPUB = document.getElementById("downloadEPUB");
  const lerOnline = document.getElementById("lerOnline");
  downloadEPUB.innerHTML = "";
  lerOnline.innerHTML = "";

  let epubAdicionado = false;
  let lerOnlineAdicionado = false;

  for (const tipo in formatos) {
    if (tipo.includes("application/epub") && !epubAdicionado) {
      const link = document.createElement("a");
      link.href = formatos[tipo];
      link.textContent = "Download EPUB";
      link.target = "_blank";
      downloadEPUB.appendChild(link);
      epubAdicionado = true;
    } else if (tipo.startsWith("text/html") && !lerOnlineAdicionado) {
      const link = document.createElement("a");
      link.href = formatos[tipo];
      link.textContent = "Ler online";
      link.target = "_blank";
      lerOnline.appendChild(link);
      lerOnlineAdicionado = true;
    }
  }

  const imagem = formatos["image/jpeg"];
  capaLivro.innerHTML = imagem
    ? `<img src="${imagem}" alt="Capa do livro">`
    : "";

  detalhesLivro.classList.remove("hidden");
}

input.addEventListener("input", () => {
  const termo = input.value.trim();

  clearTimeout(debounceTimer);
  if (termo.length === 0) {
    sugestaoBox.innerHTML = "";
    detalhesLivro.classList.add("hidden");
    return;
  }

  debounceTimer = setTimeout(async () => {
    const livros = await buscarLivros(termo);
    mostrarSugestoes(livros);
  }, 400);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".sugestoes")) {
    sugestaoBox.innerHTML = "";
  }
});
