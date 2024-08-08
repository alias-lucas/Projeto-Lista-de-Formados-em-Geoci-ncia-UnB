console.log('DOM completamente carregado e analisado, arquivo curso.js');
fetch('./json/dados.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados JSON carregados:', data);
        const dadosOrdenados = ordenarPorCurso(data.Plan1);
        console.log(dadosOrdenados)
        criarBotoes(dadosOrdenados)
        ajustarTamanhoBotoes() // Chama a função para ajustar o tamanho dos botões após serem criados
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

function ordenarPorCurso(dados) {
return dados.sort((a, b) => {
    if (a.curso < b.curso) {
        return -1;
    }
    if (a.curso > b.curso) {
        return 1;
    }
    return 0;
});
}

function capitalizeW(str) {
    return str.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
}

function criarBotoes(dados) {
const buttonContainer = document.getElementById('buttonContainer');
const cursosUnicos = new Set();

dados.forEach(item => {

    // Adiciona o curso ao Set e verifica se já existe
    if (!cursosUnicos.has(capitalizeW(item.curso.trim()))) {
        cursosUnicos.add(capitalizeW(item.curso.trim()))
        const curso = capitalizeW(item.curso.trim())

        // Cria um botão para cada item do JSON
        const button = document.createElement('button');
        button.className = 'btn btn-primary m-2'; // Classe Bootstrap para estilização básica
        button.textContent = capitalizeW(item.curso.trim());  // Aplicando a função de capitalização
        button.id = curso;

        button.onclick = () => {
            const cursoSelecionado = capitalizeW(curso.trim());
            sessionStorage.setItem('cursoSelecionado', cursoSelecionado);
            console.log(cursoSelecionado);

            fetch('../acaobotao/anoformatura.html')  // Caminho para o arquivo HTML
            .then(response => response.text())  // Converte a resposta para texto
            .then(data => {

                // Limpa o conteúdo existente dentro de #fetching
                document.getElementById('fetching').innerHTML = ''

                // Remove o script anterior, se existir
                const existingScript = document.querySelector('script[src="./js/curso.js"]')
                if (existingScript) {
                    existingScript.remove()
                }

                // Cria e insere dinamicamente um elemento <script> para carregar anoformatura.js
                const script = document.createElement('script');
                script.src = './js/anoformatura.js';
                script.async = true; // Adiciona o atributo defer
                document.body.appendChild(script);

                // Insere o conteúdo do anoformatura.html
                document.getElementById('fetching').innerHTML = data;

            })
            .catch(error => console.error('Error fetching the HTML:', error));  // Trata erros
        };
        buttonContainer.appendChild(button);
    }
    
});
}

function ajustarTamanhoBotoes() {
const buttons = document.querySelectorAll('#buttonContainer button');
if (buttons.length > 0) {
    let maxWidth = 0;

    // Encontra a largura máxima entre os botões
    buttons.forEach(button => {
        const width = button.offsetWidth;
        if (width > maxWidth) {
            maxWidth = width;
        }
    });

    // Define a largura máxima para todos os botões
    buttons.forEach(button => {
        button.style.width = `${maxWidth}px`;
    });
}
}
