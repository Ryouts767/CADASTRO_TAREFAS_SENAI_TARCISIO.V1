const campoTarefa = document.getElementById('campo-tarefa');
const seletorPrioridade = document.getElementById('seletor-prioridade');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const contadorFoguinho = document.getElementById('contador-foguinho');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const iconeTema = botaoAlternarTema.querySelector('i');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let dadosOfensiva = JSON.parse(localStorage.getItem('dadosOfensiva')) || {
    sequencia: 0,
    ultimaData: null
};

function salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('dadosOfensiva', JSON.stringify(dadosOfensiva));
}

function obterDataHoje() {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
}

function verificarEAtualizarOfensiva() {
    const hoje = obterDataHoje();

    if (!dadosOfensiva.ultimaData) {
        contadorFoguinho.textContent = dadosOfensiva.sequencia;
        return;
    }

    const dataUltima = new Date(dadosOfensiva.ultimaData);
    const dataAtual = new Date(hoje);
    
    // Diferença em dias
    const diffTempo = dataAtual - dataUltima;
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

    // Se passou mais de 1 dia sem concluir nenhuma tarefa, zera a sequência
    if (diffDias > 1) {
        dadosOfensiva.sequencia = 0;
        salvarDados();
    }

    contadorFoguinho.textContent = dadosOfensiva.sequencia;
}

function registrarConclusaoHoje() {
    const hoje = obterDataHoje();

    if (dadosOfensiva.ultimaData === hoje) {
        // Já registrou a ofensiva de hoje
        return;
    }

    if (!dadosOfensiva.ultimaData) {
        dadosOfensiva.sequencia = 1;
    } else {
        const dataUltima = new Date(dadosOfensiva.ultimaData);
        const dataAtual = new Date(hoje);
        const diffTempo = dataAtual - dataUltima;
        const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

        if (diffDias === 1) {
            // Concluiu no dia seguinte consecutivo
            dadosOfensiva.sequencia += 1;
        } else if (diffDias > 1) {
            // Quebrou a sequência
            dadosOfensiva.sequencia = 1;
        }
    }

    dadosOfensiva.ultimaData = hoje;
    salvarDados();
    verificarEAtualizarOfensiva();
}

function atualizarContador() {
    const total = tarefas.length;
    contadorTarefas.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
}

function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const itemLista = document.createElement('li');
        const prioridade = tarefa.prioridade || 'media';

        itemLista.className = `item-tarefa ${tarefa.concluida ? 'concluido' : ''}`;

        itemLista.innerHTML = `
            <div class="conteudo-tarefa">
                <span class="etiqueta-prioridade prioridade-${prioridade}">
                    ${prioridade.toUpperCase()}
                </span>
                <span>${tarefa.texto}</span>
            </div>
            <div class="acoes-tarefa">
                <button class="botao-acao concluir" onclick="alternarConcluido(${index})" title="${tarefa.concluida ? 'Desmarcar' : 'Concluir'}">
                    <i class="${tarefa.concluida ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                </button>
                <button class="botao-acao excluir" onclick="excluirTarefa(${index})" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        listaTarefas.appendChild(itemLista);
    });

    atualizarContador();
    verificarEAtualizarOfensiva();
}

window.alternarConcluido = function(index) {
    tarefas[index].concluida = !tarefas[index].concluida;

    // Se a tarefa foi concluída, verifica/atualiza o foguinho de hoje
    if (tarefas[index].concluida) {
        registrarConclusaoHoje();
    }

    salvarDados();
    renderizarTarefas();
};

window.excluirTarefa = function(index) {
    tarefas.splice(index, 1);
    salvarDados();
    renderizarTarefas();
};

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();
    const prioridadeTarefa = seletorPrioridade.value;

    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    tarefas.push({
        texto: textoTarefa,
        concluida: false,
        prioridade: prioridadeTarefa
    });

    campoTarefa.value = '';
    salvarDados();
    renderizarTarefas();
}

botaoAlternarTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');

    if (document.body.classList.contains('modo-escuro')) {
        iconeTema.classList.remove('fa-moon');
        iconeTema.classList.add('fa-sun');
    } else {
        iconeTema.classList.remove('fa-sun');
        iconeTema.classList.add('fa-moon');
    }
});

botaoAdicionar.addEventListener('click', adicionarTarefa);

campoTarefa.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});

// Inicialização
verificarEAtualizarOfensiva();
renderizarTarefas();