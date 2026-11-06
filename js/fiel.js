let torcedores = [];
let proximoId = 1;

const form = document.getElementById("formFiel");
const campos = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email"),
  cidade: document.getElementById("cidade"),
  idade: document.getElementById("idade"),
  setor: document.getElementById("setor"),
};
const feedback = document.getElementById("feedback");
const lista = document.getElementById("listaTorcedores");
const contador = document.getElementById("contador");
const estatistica = document.getElementById("estatistica");
const filtroSetor = document.getElementById("filtroSetor");

function validarFormulario() {
  const nome = campos.nome.value.trim();
  const email = campos.email.value.trim();
  const cidade = campos.cidade.value.trim();
  const idade = Number(campos.idade.value);
  const setor = campos.setor.value;

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return {
    nome: nome.length >= 3,
    email: emailValido,
    cidade: cidade.length >= 2,
    idade: Number.isInteger(idade) && idade >= 5 && idade <= 120,
    setor: setor !== "",
  };
}

function mostrarValidacao(resultado) {
  for (const nomeCampo in resultado) {
    campos[nomeCampo].classList.toggle("is-valid", resultado[nomeCampo]);
    campos[nomeCampo].classList.toggle("is-invalid", !resultado[nomeCampo]);
  }
}

function limparValidacao() {
  for (const nomeCampo in campos) {
    campos[nomeCampo].classList.remove("is-valid", "is-invalid");
  }
}

function mostrarAlerta(mensagem, tipo) {
  feedback.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>`;
}

function adicionarTorcedor() {
  const novo = {
    id: proximoId++,
    nome: campos.nome.value.trim(),
    email: campos.email.value.trim(),
    cidade: campos.cidade.value.trim(),
    idade: Number(campos.idade.value),
    setor: campos.setor.value,
  };
  torcedores.push(novo);
  return novo;
}

function removerTorcedor(id) {
  const removido = torcedores.find((t) => t.id === id);
  torcedores = torcedores.filter((t) => t.id !== id);
  renderizarLista();
  if (removido) {
    mostrarAlerta(`${removido.nome} foi removido do mural.`, "warning");
  }
}

function calcularEstatisticas(lista) {
  if (lista.length === 0) return "";

  const soma = lista.reduce((total, t) => total + t.idade, 0);
  const media = (soma / lista.length).toFixed(1);

  const porCidade = {};
  lista.forEach((t) => {
    const chave = t.cidade.toLowerCase();
    porCidade[chave] = (porCidade[chave] || 0) + 1;
  });
  const cidadeTop = Object.keys(porCidade).reduce((a, b) =>
    porCidade[a] >= porCidade[b] ? a : b,
  );
  const nomeCidade = lista.find(
    (t) => t.cidade.toLowerCase() === cidadeTop,
  ).cidade;

  return `Média de idade: <strong>${media} anos</strong> | Cidade com mais torcedores: <strong>${nomeCidade}</strong> (${porCidade[cidadeTop]})`;
}

function renderizarLista() {
  const filtro = filtroSetor.value;
  const visiveis = filtro
    ? torcedores.filter((t) => t.setor === filtro)
    : torcedores;

  lista.innerHTML = "";

  if (visiveis.length === 0) {
    lista.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Nenhum torcedor para mostrar. Faça o primeiro cadastro acima.</td></tr>`;
  } else {
    visiveis.forEach((t) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${t.nome}</td>
        <td>${t.cidade}</td>
        <td>${t.idade}</td>
        <td>${t.setor}</td>
        <td class="text-end">
          <button class="btn btn-outline-danger btn-sm btn-remover">Remover</button>
        </td>`;
      linha
        .querySelector("button")
        .addEventListener("click", () => removerTorcedor(t.id));
      lista.appendChild(linha);
    });
  }

  contador.textContent = torcedores.length;
  estatistica.innerHTML = calcularEstatisticas(visiveis);
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const resultado = validarFormulario();
  mostrarValidacao(resultado);

  const tudoCerto = Object.values(resultado).every((ok) => ok);

  if (!tudoCerto) {
    mostrarAlerta("Corrija os campos em vermelho e tente de novo.", "danger");
    return;
  }

  const novo = adicionarTorcedor();
  renderizarLista();
  form.reset();
  limparValidacao();
  mostrarAlerta(
    `Cadastro realizado, ${novo.nome}! Bem-vindo à Fiel.`,
    "success",
  );
});

filtroSetor.addEventListener("change", renderizarLista);

// Primeira renderização
renderizarLista();
