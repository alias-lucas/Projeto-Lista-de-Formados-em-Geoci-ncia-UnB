console.log('DOM completamente carregado e analisado anoformatura.js, arquivo anoformatura.js');
fetch('./json/dados.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados JSON carregados:', data);
        const anosOrdenados = ordenarAnosDesc(data.Plan1);
        console.log('Anos Ordenados:', anosOrdenados);
        const cursoSelecionado = sessionStorage.getItem('cursoSelecionado');
        const cursoSelecionadoElement = document.getElementById('cursoSelecionado');

        const h2curso = document.createElement('h2');
        h2curso.className = 'text-center';
        h2curso.id = 'cursoHeader'; // Adiciona um ID para fácil seleção
        h2curso.textContent = `Curso: ${cursoSelecionado}`;
        cursoSelecionadoElement.appendChild(h2curso);

        window.addEventListener('scroll', function() {
        const rect = cursoSelecionadoElement.getBoundingClientRect();
        if (rect.top < 0) {
            cursoSelecionadoElement.classList.add('fixed-left');
        } else {
            cursoSelecionadoElement.classList.remove('fixed-left');
        }});

        criarBotoesAno(anosOrdenados);
        ajustarTamanhoBotoes(); // Ajustar o tamanho dos botões após serem criados

        // Adicionando o botão de "Voltar" flutuante
        criarBotaoVoltar()
    
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

function voltar() {
    window.history.back(); // Isso vai voltar para a página anterior no histórico do navegador
}

function criarBotaoVoltar() {

    // Cria o botão de "Voltar"
    const voltarButton = document.createElement('button');
    voltarButton.className = 'btn btn-secondary'; // Classe Bootstrap para estilização
    voltarButton.textContent = 'Voltar';

    // Adiciona estilo para posicionar o botão como flutuante
    voltarButton.style.position = 'fixed';
    voltarButton.style.bottom = '25px';
    voltarButton.style.left = '25px';
    voltarButton.style.zIndex = '1000';

    // voltarButton.onclick = voltar; // Chama a função voltar quando clicado

    voltarButton.onclick = () => {

        if (sessionStorage.getItem('anoSelecionado') !== null && sessionStorage.getItem('cursoSelecionado') !== null ) {
            sessionStorage.removeItem('anoSelecionado');
            // Exemplo de fetch ao clicar no botão "Voltar"
            fetch('../acaobotao/anoformatura.html')  // Caminho para o arquivo HTML
            .then(response => response.text())  // Converte a resposta para texto
            .then(data => {

                // Limpa o conteúdo existente dentro de #fetching
                document.getElementById('fetching').innerHTML = ''

                // Remove o script anterior, se existir
                const existingScript = document.querySelector('script[src="./js/curso.js"]')

                if (existingScript) {
                    existingScript.remove();
                }

                // Cria e insere dinamicamente um elemento <script> para carregar anoformatura.js
                const script = document.createElement('script');
                script.src = './js/anoformatura.js';
                script.async = true; // Adiciona o atributo defer
                document.body.appendChild(script);
                
                // Insere o conteúdo do anoformatura.html
                document.getElementById('fetching').innerHTML = data;
                
            })
               
        } else {
            sessionStorage.removeItem('cursoSelecionado');

            // Exemplo de fetch ao clicar no botão "Voltar"
            fetch('../index.html')  // Caminho para o arquivo HTML
            .then(response => response.text())  // Converte a resposta para texto
            .then(data => {

                // Remove o script anterior, se existir
                const existingScript = document.querySelector('script[src="./js/anoformatura.js"]')
                if (existingScript) {
                    existingScript.remove()
                }

                // Cria e insere dinamicamente um elemento <script> para carregar anoformatura.js
                const script = document.createElement('script');
                script.src = './js/curso.js';
                script.async = true; // Adiciona o atributo defer
                document.body.appendChild(script);
                
                // Insere o conteúdo do anoformatura.html
                document.documentElement.innerHTML = data;

            })
        }
 
    }

    // Adiciona o botão ao body do documento
    document.body.appendChild(voltarButton);
}

function capitalizeW(str) {
    return str.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
}

function ordenarAnosDesc(dados) {
    const cursoSelecionado = sessionStorage.getItem('cursoSelecionado');

    const anosFiltrados = dados.filter(item => capitalizeW(item.curso.trim()) === cursoSelecionado)
                                .map(item => capitalizeW(item.ano_formatura.trim()));

    // Extrair anos de formatura únicos
    const anosUnicos = Array.from(new Set(anosFiltrados));

    // Ordenar anos de forma decrescente
    anosUnicos.sort((a, b) => b - a);
    console.log('Anos filtrados e ordenados:', anosUnicos);
    return anosUnicos;

}

function criarBotoesAno(anos) {
    const buttonContainer = document.getElementById('buttonContainer');

    anos.forEach(ano => {

        // Cria um botão para cada ano de formatura
        const button = document.createElement('button');
        button.className = 'btn btn-primary m-2'; // Classe Bootstrap para estilização básica
        button.textContent = `${ano}`;  // Texto do botão
        button.id = `${ano}`;

        button.onclick = () => {
            const anoSelecionadoo = ano;
            sessionStorage.setItem('anoSelecionado', anoSelecionadoo);
            console.log(anoSelecionadoo);

            carregarAlunosHTML(ano);
        };

        buttonContainer.appendChild(button);
    });
}

function carregarAlunosHTML(anoSelecionado) {
    fetch('./acaobotao/alunos.html') // Caminho para o arquivo HTML dos alunos
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o HTML dos alunos');
            }
            return response.text(); // Converte a resposta para texto
        })
        .then(html => {
            // Limpa o conteúdo existente dentro de #fetching
            document.getElementById('fetching').innerHTML = '';

            // Remove o script anterior, se existir
            const existingScript = document.querySelector('script[src="./js/anoformatura.js"]');
            if (existingScript) {
                existingScript.remove();
            }

            // Insere o conteúdo do HTML dos alunos
            document.getElementById('fetching').innerHTML = html;

            // Carrega os dados dos alunos do ano selecionado
            carregarAlunos(anoSelecionado);
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo HTML dos alunos:', error);
        });
}

function carregarAlunos(anoSelecionadoo) {
    fetch('./json/dados.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(data => {

            // Pegar o ano selecionado salvo no sessionStorage
            const anoSelecionado = sessionStorage.getItem('anoSelecionado');

            // Pegar o curso selecionado salvo no sessionStorage
            const cursoSelecionado = sessionStorage.getItem('cursoSelecionado');
            
            // Pegar a div cursoeAnoSelecionado
            const cursoAnoSelecionadoElement = document.getElementById('cursoeAnoSelecionado');
            
            // // Criando dinamicamente h3 com o curso e ano selecionado
            // const h3Curso = document.createElement('h3')
            // h3Curso.className = 'text-center';
            // h3Curso.id = 'cursoHeader';
            // h3Curso.textContent = `Curso: ${cursoSelecionado}`
            // cursoAnoSelecionadoElement.appendChild(h3Curso)

            // const h3Ano = document.createElement('h3')
            // h3Ano.className = 'text-center'
            // h3Ano.id = 'anoHeader'
            // h3Ano.textContent = `Ano: ${anoSelecionado}`
            // cursoAnoSelecionadoElement.appendChild(h3Ano)

            // Faz o filtro dos alunos do ano e curso selecionados
            const alunosDoAno = data.Plan1.filter(item => {
                return capitalizeW(item.ano_formatura.trim()) == anoSelecionadoo && capitalizeW(item.curso.trim()) == cursoSelecionado;
            });

            // // Criar lista de alunos formatada
            // let alunosHTML = '<ul class="list-group d-inline-flex">';
            // alunosHTML += `<li class="list-group-item text-center d-inline-flex"> ${anoSelecionado}</li>`
            // alunosDoAno.forEach(aluno => {
            //     alunosHTML += `<li class="list-group-item text-center d-inline-flex">${capitalizeW(aluno.nome.trim())}</li>`;
            // });
            // alunosHTML += '</ul>';


            // // Criar tabela de alunos formatada
            // let alunosHTMLTable = '<table>';
            // alunosHTMLTable += '<tr>';
            // alunosHTMLTable += '<td>';
            // alunosHTMLTable += `<td>${anoSelecionado}</td>`;
            // alunosHTMLTable += '<td>';
            // alunosHTMLTable += '<tr>';

            // alunosDoAno.forEach(aluno => {
            //     alunosHTML += `<td class="list-group-item text-center d-inline-flex">${capitalizeW(aluno.nome.trim())}</td>`;
            // });


            // alunosHTML += '</table>';


            // let alunosHTMLTable = '<table class="list-group-item text-center d-inline-flex">';
            // alunosHTMLTable += '<tr>';
            // alunosHTMLTable += `<td class="list-group-item text-center d-inline-flex">Curso:</td>`;
            // alunosHTMLTable += `<td class="list-group-item text-center d-inline-flex">${cursoSelecionado}</td>`;
            // alunosHTMLTable += `<td class="list-group-item text-center d-inline-flex">Ano:</td>`;
            // alunosHTMLTable += `<td class="list-group-item text-center d-inline-flex">${anoSelecionado}</td>`;
            // alunosHTMLTable += '</tr>';

            // alunosHTMLTable += '<tr>';
            // alunosHTMLTable += `<td class="list-group-item text-center d-inline-flex">Alunos:</td>`;
            // alunosHTMLTable += '</tr>';

            // alunosDoAno.forEach(aluno => {
            //     alunosHTMLTable += '<tr>'; // Adiciona uma linha para cada aluno
            //     alunosHTMLTable += `<td class="list-group-item text-center d-inline-flex">${capitalizeW(aluno.nome.trim())}</td>`;
            //     alunosHTMLTable += '</tr>';
            // });

            // alunosHTMLTable += '</table>';

            // // Inserir lista de alunos no container específico de alunos
            // const alunosContainer = document.getElementById('alunosContainer');
            // alunosContainer.innerHTML = alunosHTMLTable;

            let alunosHTMLTable = '<table class="list-group-item text-center d-inline-flex">';
            alunosHTMLTable += '<thead>';
            alunosHTMLTable += '<tr>';
            alunosHTMLTable += '<td>';
            alunosHTMLTable += '<th class="list-group-item">Curso:</th>';
            alunosHTMLTable += `<td class="list-group-item">${cursoSelecionado}</td>`;
            alunosHTMLTable += '</td>';
            alunosHTMLTable += '<td>';
            alunosHTMLTable += '<th class="list-group-item">Ano:</th>';
            alunosHTMLTable += `<td class="list-group-item">${anoSelecionado}</td>`;
            alunosHTMLTable += '<td>';
            alunosHTMLTable += '</tr>';
            alunosHTMLTable += '</thead>';

            alunosHTMLTable += '<tbody>';
            alunosHTMLTable += '<tr>';
            alunosHTMLTable += '<th class="list-group-item" colspan="4">Alunos:</th>';
            alunosHTMLTable += '</tr>';

            alunosDoAno.forEach(aluno => {
                alunosHTMLTable += '<tr colspan="4">'; // Adiciona uma linha para cada aluno
                alunosHTMLTable += `<td class="list-group-item" colspan="4">${capitalizeW(aluno.nome.trim())}</td>`;
                alunosHTMLTable += '</tr>';
            });

            alunosHTMLTable += '</tbody>';
            alunosHTMLTable += '</table>';

            // Inserir lista de alunos no container específico de alunos
            const alunosContainer = document.getElementById('alunosContainer');
            alunosContainer.innerHTML = alunosHTMLTable;
        })

        .catch(error => {
            console.error('Erro ao carregar o arquivo JSON ou filtrar os alunos:', error);
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
