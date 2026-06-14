document.addEventListener("DOMContentLoaded", () => {
    // 1. CAPTURA O NÚMERO DA URL (Apenas se ele existir na barra de endereço)
    const urlParams = new URLSearchParams(window.location.search);
    const numeroUrl = urlParams.get('id'); // Pegará o valor após '?id='

    // Se encontrou o número na URL, salva no localStorage para não perder de página em página
    if (numeroUrl) {
        localStorage.setItem("contato_destino", numeroUrl);
    }

    const form = document.getElementById("meuForm");
    if (!form) return;

    // Descobre qual página está aberta atualmente
    const paginaAtual = window.location.pathname.split("/").pop();

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento padrão da página

        if (paginaAtual === "disseSIM.html") {
            const selecionado = form.querySelector('input[name="escolha_unica"]:checked');
            if (selecionado) {
                localStorage.setItem("categoria_encontro", selecionado.value);
                
                // Redireciona mantendo o ID na URL para garantir a transição local se necessário
                const sufixoParam = obterParametroAtual();
                if (selecionado.value === "restaurante") window.location.href = `restaurante.html${sufixoParam}`;
                else if (selecionado.value === "feira") window.location.href = `feira.html${sufixoParam}`;
                else window.location.href = `data.html${sufixoParam}`;
            }
        } 
        
        else if (paginaAtual === "restaurante.html" || paginaAtual === "feira.html") {
            const checkboxes = form.querySelectorAll('input[name="opcoes_selecionadas"]:checked');
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
            localStorage.setItem("data_encontro", dataInput ? dataInput : "Não informada");
            window.location.href = `Encerrar.html${obterParametroAtual()}`;
        } 
        
        else if (paginaAtual === "Encerrar.html") {
            enviarParaWhatsApp();
        }
    });
});

// Função auxiliar para propagar o parâmetro na URL caso o localStorage falhe
function obterParametroAtual() {
    const numeroSalvo = localStorage.getItem("contato_destino");
    return numeroSalvo ? `?id=${numeroSalvo}` : "";
}

// Função que junta todas as informações e envia para o WhatsApp
function enviarParaWhatsApp() {
    // Busca o número que ficou guardado de forma segura no navegador
    const meuNumero = localStorage.getItem("contato_destino"); 

    if (!meuNumero) {
        alert("Ops! O número de destino não foi configurado na URL. Envie o link contendo o '?id=seu_numero'.");
        return;
    }

    const categoria = localStorage.getItem("categoria_encontro") || "Não definida";
    
    // Recupera os checkboxes selecionados
    let detalhes = "Geral";
    const detalhesSalvos = localStorage.getItem("detalhes_encontro");
    if (detalhesSalvos) {
        detalhes = JSON.parse(detalhesSalvos).join(", ");
    }
    
    const dataEncontro = localStorage.getItem("data_encontro") || "Não informada";

    // MONTA A SUA MENSAGEM TOTALMENTE PERSONALIZADA!
    const textoMensagem = `*Eba! Encontro Marcado!* 🎉\n\n` +
                          `• *Tipo:* ${categoria.toUpperCase()}\n` +
                          `• *Opções:* ${detalhes}\n` +
                          `• *Data Sugerida:* ${dataEncontro}\n\n` +
                          `Estou ansioso(a)! 😉`;

    // Cria a URL da API do WhatsApp
    const urlLink = `https://api.whatsapp.com/send?phone=${meuNumero}&text=${encodeURIComponent(textoMensagem)}`;

    // Limpa o armazenamento para não acumular lixo no navegador
    localStorage.clear();

    // Redireciona para o WhatsApp com tudo pronto
    window.location.href = urlLink;
}