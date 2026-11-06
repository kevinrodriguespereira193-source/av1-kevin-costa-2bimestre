const precos = {
  Arquibancada: 60,
  "Cadeira inferior": 120,
  "Cadeira superior": 90,
  Camarote: 350,
};

let pedido = [];
let proximoItem = 1;

const selSetor = document.getElementById("setorIngresso");
const inpQtd = document.getElementById("qtdIngresso");
const chkMeia = document.getElementById("meiaIngresso");
const btnAdicionar = document.getElementById("btnAdicionarIngresso");
const feedbackIng = document.getElementById("feedbackIngresso");
const listaIng = document.getElementById("listaIngressos");
const totalIng = document.getElementById("totalIngressos");

function mostrarAlertaIngresso(mensagem, tipo) {
  feedbackIng.innerHTML = `<div class="alert alert-${tipo} mt-3 mb-0" role="alert">${mensagem}</div>`;
}

function calcularSubtotal(setor, quantidade, meia) {
  const valorUnitario = meia ? precos[setor] / 2 : precos[setor];
  return valorUnitario * quantidade;
}

function formatarReal(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function adicionarItem() {
  const setor = selSetor.value;
  const quantidade = Number(inpQtd.value);

  if (setor === "") {
    mostrarAlertaIngresso("Escolha um setor.", "danger");
    return;
  }
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10) {
    mostrarAlertaIngresso(
      "A quantidade deve ser um número de 1 a 10.",
      "danger",
    );
    return;
  }

  const meia = chkMeia.checked;
  pedido.push({
    id: proximoItem++,
    setor: setor,
    quantidade: quantidade,
    meia: meia,
    subtotal: calcularSubtotal(setor, quantidade, meia),
  });

  renderizarPedido();
  mostrarAlertaIngresso("Ingresso adicionado ao pedido.", "success");
  inpQtd.value = 1;
  chkMeia.checked = false;
}

function removerItem(id) {
  pedido = pedido.filter((item) => item.id !== id);
  renderizarPedido();
  mostrarAlertaIngresso("Item removido do pedido.", "warning");
}

function renderizarPedido() {
  listaIng.innerHTML = "";

  if (pedido.length === 0) {
    listaIng.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Nenhum ingresso no pedido.</td></tr>`;
  } else {
    pedido.forEach((item) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${item.setor}</td>
        <td>${item.quantidade}</td>
        <td>${item.meia ? "Meia" : "Inteira"}</td>
        <td>${formatarReal(item.subtotal)}</td>
        <td class="text-end"><button class="btn btn-outline-danger btn-sm">Remover</button></td>`;
      linha
        .querySelector("button")
        .addEventListener("click", () => removerItem(item.id));
      listaIng.appendChild(linha);
    });
  }

  const total = pedido.reduce((soma, item) => soma + item.subtotal, 0);
  totalIng.textContent = formatarReal(total);
}

btnAdicionar.addEventListener("click", adicionarItem);
renderizarPedido();
