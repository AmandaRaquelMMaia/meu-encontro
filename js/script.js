document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const numeroUrl = urlParams.get('id'); 

    if (numeroUrl) {
        localStorage.setItem("contato_destino", numeroUrl);
    }

    const btnSim = document.getElementById("btnSim");
    const btnNao = document.getElementById("btnNao");

    if (btnSim) {
        btnSim.addEventListener("click", () => {
            window.location.href = `disseSIM.html${obterParametroAtual()}`;
        });
    }

    if (btnNao) {
        btnNao.addEventListener("click", () => {
            window.location.href = `disseNao.html${obterParametroAtual()}`;
        });
    }

    const form = document.getElementById("meuForm");
    if (!form) return;

    const paginaAtual = window.location.pathname.split("/").pop();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (paginaAtual === "disseSIM.html") {
            const selecionado = form.querySelector('input[name="escolha_unica"]:checked');
            if (selecionado) {
                localStorage.setItem("categoria_encontro", selecionado.value);
                
                const sufixoParam = obterParametroAtual();
                if (selecionado.value === "restaurante") window.location.href = `restaurante.html${sufixoParam}`;
                else if (selecionado.value === "feira") window.location.href = `feira.html${sufixoParam}`;
                else window.location.href = `data.html${sufixoParam}`;
            } else {
                alert("Por favor, selecione uma opção para continuar!");
            }
        } 

        else if (paginaAtual === "restaurante.html" || paginaAtual === "feira.html") {

            const checkboxes = form.querySelectorAll('input[name="opcoes_selecionadas"]:checked, input[name="escolha_unica"]:checked');
            const escolhas = Array.from(checkboxes).map(cb => cb.value);
            
            if (escolhas.length === 0) {
                alert("Por favor, selecione pelo menos uma opção antes de continuar!");
                return;
            }
            
            localStorage.setItem("detalhes_encontro", JSON.stringify(escolhas));
            window.location.href = `data.html${obterParametroAtual()}`;
        } 

        else if (paginaAtual === "data.html") {
            const dataInput = document.getElementById("data_livre").value;

            let dataFormatada = "Não informada";
            if (dataInput) {
                const partes = dataInput.split("-");
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            localStorage.setItem("data_encontro", dataFormatada);
            window.location.href = `Encerrar.html${obterParametroAtual()}`;
        } 

        else if (paginaAtual === "Encerrar.html") {
            enviarParaWhatsApp();
        }
    });
});

function obterParametroAtual() {
    const numeroSalvo = localStorage.getItem("contato_destino");
    return numeroSalvo ? `?id=${numeroSalvo}` : "";
}

function enviarParaWhatsApp() {
    const meuNumero = localStorage.getItem("contato_destino"); 

    if (!meuNumero) {
        alert("Ops! O número de destino não foi configurado na URL. Envie o link contendo o '?id=seu_numero'.");
        return;
    }

    const categoria = localStorage.getItem("categoria_encontro") || "Não definida";
    
    let detalhes = "Geral";
    const detalhesSalvos = localStorage.getItem("detalhes_encontro");
    if (detalhesSalvos) {
        detalhes = JSON.parse(detalhesSalvos).join(", ");
    }
    
    const dataEncontro = localStorage.getItem("data_encontro") || "Não informada";

    const textoMensagem = `*Eba! Encontro Marcado!* 🎉\n\n` +
                          `• *Tipo:* ${categoria.toUpperCase()}\n` +
                          `• *Opções:* ${detalhes}\n` +
                          `• *Data Sugerida:* ${dataEncontro}\n\n` +
                          `Estou ansioso(a)! 😉`;

    const urlLink = `https://api.whatsapp.com/send?phone=${meuNumero}&text=${encodeURIComponent(textoMensagem)}`;

    localStorage.clear();

    window.location.href = urlLink;
}
