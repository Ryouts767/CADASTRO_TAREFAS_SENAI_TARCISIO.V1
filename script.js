const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const iconeTema = botaoAlternarTema.querySelector('i');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function atualizarContador() {
    const total = tarefas.length;
    contadorTarefas.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
}

function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const itemLista = document.createElement('li');

        itemLista.className = `item-tarefa ${tarefa.concluida ? 'concluido' : ''}`;

        itemLista.innerHTML = `
            <span>${tarefa.texto}</span>
            <div class="acoes-tarefa">
                <button class="botao-acao concluir" onclick="alternarConcluido(${index})">
                    <i class="fa-regular fa-circle-check"></i>
                </button>
                <button class="botao-acao excluir" onclick="excluirTarefa(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        listaTarefas.appendChild(itemLista);
    });

    atualizarContador();
}

window.alternarConcluido = function(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarTarefas();
    renderizarTarefas();
};

window.excluirTarefa = function(index) {
    tarefas.splice(index, 1);
    salvarTarefas();
    renderizarTarefas();
};

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    tarefas.push({ texto: textoTarefa, concluida: false });

    campoTarefa.value = '';
    salvarTarefas();
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

renderizarTarefas();
