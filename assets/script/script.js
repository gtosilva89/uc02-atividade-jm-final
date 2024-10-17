// MATRIZ COM AS IMAGENS
const images = [
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png',
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png'
];

// VARIÁVEIS DE CARTAS
let primeiraCarta, segundaCarta; // Variáveis para armazenar as cartas selecionadas
let cartaVirada = false; // Controle para verificar se uma carta está virada
let jogoBloqueado = false; // Controle para bloquear cliques durante animações
let paresEncontrado = 0; // Contador de pares encontrados
let tempoInicial, contadorTempo; // Variáveis para controle de tempo
let erroCount = 0; // Contador de erros
let jogoConcluido = false; // Flag para verificar se o jogo foi concluído
let jogoIniciado = false; // Flag para verificar se o jogo foi iniciado

// FUNÇÃO PARA EMBARALHAR AS IMAGENS
function embaralharImagens(imagens) {
    for (let i = imagens.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
        [imagens[i], imagens[j]] = [imagens[j], imagens[i]]; // Troca as imagens
    }
    return imagens; // Retorna as imagens embaralhadas
}

// FUNÇÃO PARA CRIAR O TABULEIRO
function criarTabuleiro() {
    const board = document.getElementById('game');
    const imagensEmbaralhadas = embaralharImagens(images.slice()); // Embaralha as imagens
    board.innerHTML = ''; // Limpa o conteúdo anterior do tabuleiro

    // Cria as cartas no tabuleiro
    imagensEmbaralhadas.forEach((imagem, index) => {
        const carta = document.createElement('div'); // Cria um novo elemento de carta
        carta.classList.add('carta'); // Adiciona a classe 'carta'
        carta.setAttribute('data-id', index); // Define o ID da carta

        // Cria a imagem
        const img = document.createElement('img'); // Cria um novo elemento de imagem
        img.src = `./assets/img/png/${imagem}`; // Define o caminho da imagem
        img.style.display = 'none'; // Esconde a imagem inicialmente
        carta.appendChild(img); // Adiciona a imagem à carta

        // Adiciona evento de clique à carta
        carta.addEventListener('click', () => {
            if (!jogoIniciado) {
                alert('Por favor, clique no botão "Iniciar" para começar o jogo!'); // Alerta se o jogo não foi iniciado
            } else {
                virarCarta.call(carta); // Chama a função para virar a carta
            }
        });

        board.appendChild(carta); // Adiciona a carta ao tabuleiro
    });
}

// FUNÇÃO PARA VIRAR A CARTA
function virarCarta() {
    if (jogoBloqueado || this === primeiraCarta || this.classList.contains('pair-found')) return; // Bloqueia cartas já viradas ou que formaram par

    this.classList.add('flipped'); // Adiciona a classe 'flipped'
    const img = this.querySelector('img'); // Obtém a imagem da carta
    img.style.display = 'block'; // Exibe a imagem da carta

    if (!cartaVirada) {
        primeiraCarta = this; // Armazena a primeira carta
        cartaVirada = true; // Marca que uma carta foi virada
    } else {
        segundaCarta = this; // Armazena a segunda carta
        cartaVirada = false; // Reseta o controle de carta virada
        verificarMatch(); // Verifica se as cartas correspondem
    }
}

// FUNÇÃO PARA VERIFICAR SE AS CARTAS SÃO IGUAIS
function verificarMatch() {
    jogoBloqueado = true; // Bloqueia o jogo para evitar cliques
    const primeiraImagem = primeiraCarta.querySelector('img').src; // Obtém a imagem da primeira carta
    const segundaImagem = segundaCarta.querySelector('img').src; // Obtém a imagem da segunda carta

    if (primeiraImagem === segundaImagem) {
        paresEncontrado++; // Aumenta o contador de pares encontrados
        primeiraCarta.classList.add('certa'); // Marca como par certo
        segundaCarta.classList.add('certa'); // Marca como par certo
        primeiraCarta.classList.add('pair-found'); // Adiciona a classe para cartas que já formaram par
        segundaCarta.classList.add('pair-found'); // Adiciona a classe para cartas que já formaram par
        resetar(); // Reseta as cartas para novas seleções
    } else {
        erroCount++; // Aumenta o contador de erros
        document.getElementById('errorCount').textContent = `Erros: ${erroCount}`; // Atualiza o contador de erros
        setTimeout(() => {
            primeiraCarta.classList.remove('flipped'); // Vira a primeira carta de volta
            segundaCarta.classList.remove('flipped'); // Vira a segunda carta de volta
            primeiraCarta.querySelector('img').style.display = 'none'; // Esconde a imagem da primeira carta
            segundaCarta.querySelector('img').style.display = 'none'; // Esconde a imagem da segunda carta
            resetar(); // Reseta as cartas para novas seleções
        }, 1000); // Tempo de espera antes de virar
    }
}

// FUNÇÃO PARA RESETAR AS CARTAS
function resetar() {
    primeiraCarta = null; // Reseta a primeira carta
    segundaCarta = null; // Reseta a segunda carta
    jogoBloqueado = false; // Libera o bloqueio do jogo

    // Verifica se o jogo foi concluído
    if (paresEncontrado === images.length / 2) {
        // Espera um segundo para garantir que a última carta seja virada
        setTimeout(() => {
            clearInterval(contadorTempo); // Para o contador de tempo
            jogoConcluido = true; // Marca o jogo como concluído
            alert(`Parabéns! Você encontrou todos os pares em ${tempoInicial} segundos! com ${erroCount} erros`); // Exibe alerta de vitória
        }, 500); // Tempo de espera antes de mostrar a mensagem
    }
}

// FUNÇÃO PARA INICIAR O JOGO
function iniciarJogo() {
    // Zera contadores de tempo e erro ao iniciar o jogo
    erroCount = 0; // Reseta o contador de erros
    paresEncontrado = 0; // Reseta o contador de pares encontrados
    clearInterval(contadorTempo); // Para o contador de tempo

    jogoIniciado = true; // Marca o jogo como iniciado
    document.getElementById('restartButton').disabled = false; // Ativa o botão de reiniciar
    criarTabuleiro(); // Cria o tabuleiro
    tempoInicial = 0; // Reseta o tempo inicial
    document.getElementById('errorCount').textContent = `Erros: ${erroCount}`; // Atualiza o contador de erros
    document.getElementById('timer').textContent = `Tempo: ${tempoInicial} Segundos`; // Atualiza o texto do tempo

    // Exibe todas as cartas por 2 segundos
    const todasCartas = document.querySelectorAll('.carta');
    todasCartas.forEach(carta => {
        carta.classList.add('flipped'); // Vira a carta para exibir a imagem
        const img = carta.querySelector('img'); // Obtém a imagem da carta
        img.style.display = 'block'; // Exibe a imagem da carta
    });

    setTimeout(() => {
        todasCartas.forEach(carta => {
            carta.classList.remove('flipped'); // Vira as cartas de volta após 2 segundos
            const img = carta.querySelector('img'); // Obtém a imagem da carta
            img.style.display = 'none'; // Esconde a imagem da carta
        });
        // Inicia o contador de tempo
        contadorTempo = setInterval(() => {
            tempoInicial++; // Incrementa o tempo
            document.getElementById('timer').textContent = `Tempo: ${tempoInicial} Segundos`; // Atualiza o texto do tempo
        }, 1000); // Atualiza a cada segundo
    }, 2000); // Espera 2 segundos antes de virar as cartas de volta
}

// EVENTO PARA O BOTÃO DE REINICIAR
document.getElementById('restartButton').addEventListener('click', () => {
    if (jogoIniciado) { // Apenas permite reiniciar se o jogo já tiver iniciado
        iniciarJogo(); // Inicia o jogo novamente
    }
});

// EVENTO PARA O BOTÃO DE INICIAR
document.getElementById('startButton').addEventListener('click', iniciarJogo); // Adiciona evento de clique no botão de iniciar

// INICIALIZA O JOGO AO CARREGAR A PÁGINA
window.onload = criarTabuleiro; // Cria o tabuleiro ao carregar a página
