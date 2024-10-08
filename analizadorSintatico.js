// Lista de palavras-chave da linguagem C
const palavrasChave = [
    "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else",
    "enum", "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict",
    "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned",
    "void", "volatile", "while"
];

// Lista de operadores e delimitadores
const operadores = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '>=', '<=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', "%"];
const delimitadores = ['(', ')', '{', '}', '[', ']', ';', ',', '"', "'"];

// Códigos dos tokens para a tabela de saída
const codigoTokens = {
    "PALAVRACHAVE": 1,
    "IDENTIFICADOR": 2,
    "OPERADOR": 3,
    "DELIMITADOR": 4,
    "NUMERO": 5,
    "STRING": 6,
    "CHAR": 7
};

// Função para identificar o tipo de token
function identificarToken(token) {
    if (palavrasChave.includes(token)) {
        return ["PALAVRACHAVE", codigoTokens.PALAVRACHAVE];
    }
    if (operadores.includes(token)) {
        return ["OPERADOR", codigoTokens.OPERADOR];
    }
    if (delimitadores.includes(token)) {
        return ["DELIMITADOR", codigoTokens.DELIMITADOR];
    }
    if (/^\d+$/.test(token)) {
        return ["NUMERO", codigoTokens.NUMERO];
    }
    if (/^".*"$/.test(token)) {
        return ["STRING", codigoTokens.STRING];
    }
    if (/^'.*'$/.test(token)) {
        return ["CHAR", codigoTokens.CHAR];
    }
    return ["IDENTIFICADOR", codigoTokens.IDENTIFICADOR];
}

// Função para gerar tokens do código-fonte e identificar a linha em que estão
function gerarTokens(codigo) {
    const linhas = codigo.split('\n');
    const regex = /\"[^\"]*\"|\w+|==|!=|<=|%|>=|&&|\|\||[+\-*/=<>;,\(\)\{\}\[\]\"']/g;
    const tokensComLinha = [];

    linhas.forEach((linha, index) => {
        const tokens = linha.match(regex);
        if (tokens) {
            tokens.forEach(token => {
                tokensComLinha.push({ token, linha: index + 1 });
            });
        }
    });

    return tokensComLinha;
}

// Função para validar a gramática com base nos tokens gerados
function validarGramatica(tokens) {
    let resultadoSintaxe = "";
    let balanceamentoParenteses = 0;
    let balanceamentoChaves = 0;
    let dentroStringOuChar = false;

    tokens.forEach((token, i) => {
        if (palavrasChave.includes(token)) {
            if (token === "int" || token === "float" || token === "char" || token === "double") {
                const proximoToken = tokens[i + 1];
                if (/^[a-zA-Z_]\w*$/.test(proximoToken)) {
                    const depoisProximo = tokens[i + 2];
                    if (depoisProximo === "(") {
                        resultadoSintaxe += "Declaração de função válida.\n";
                    } else if (depoisProximo === ";") {
                        resultadoSintaxe += "Declaração de variável válida.\n";
                    } else {
                        resultadoSintaxe += "Erro: Declaração de variável incompleta.\n";
                    }
                }
            }
        }

        // Verificar se está dentro de uma string ou char para não contar parênteses e chaves dentro delas
        if (token === '"' || token === "'") {
            dentroStringOuChar = !dentroStringOuChar;
        }

        if (!dentroStringOuChar) {
            // Verificar balanceamento de parênteses e chaves
            if (token === "(") balanceamentoParenteses++;
            if (token === ")") balanceamentoParenteses--;
            if (token === "{") balanceamentoChaves++;
            if (token === "}") balanceamentoChaves--;
        }
    });

    if (balanceamentoParenteses !== 0) {
        resultadoSintaxe += "Erro: Parênteses desbalanceados.\n";
    }
    if (balanceamentoChaves !== 0) {
        resultadoSintaxe += "Erro: Chaves desbalanceadas.\n";
    }

    return resultadoSintaxe;
}

// Função para processar o código e gerar a saída no segundo textarea
function processarCodigo() {
    const codigoFonte = document.getElementById('codigoFonte').value;
    const tokensComLinha = gerarTokens(codigoFonte);
    const tokens = tokensComLinha.map(t => t.token);
    const resultadoSintaxe = validarGramatica(tokens);

    // Limpar a tabela anterior
    const tabelaResultado = document.getElementById('resultadoTabela');
    tabelaResultado.innerHTML = '';

    // Adicionar os tokens à tabela
    let contador = 1; // Contador para identificar o número do token
    tokensComLinha.forEach(({ token, linha }) => {
        const [tipoToken, codigoToken] = identificarToken(token);
        const novaLinha = `
            <tr>
                <td>${contador}</td>
                <td>${token}</td>
                <td>${tipoToken}</td>
                <td>${codigoToken}</td>
                <td>${linha}</td>
            </tr>
        `;
        tabelaResultado.innerHTML += novaLinha;
        contador++;
    });

    // Exibir o resultado da análise sintática
    document.getElementById('resultadoAnalise').innerText = resultadoSintaxe;
}



