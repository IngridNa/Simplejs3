var variaveis, restricoes, iteracoes, tbody, resultado, header, objetivo, restricoesOperadores = [], simplexTabela; // Variáveis com a referência dos elementos da página
function gerarTabela() {
    
    tbody = document.getElementById("tabela_restricoes");
    tbody.innerHTML = "";
    var linha = document.getElementById("linha_funcao");
    objetivo = $("#objetivo > input:checked").first().val();
    var inner = "";
    var linhatexto = "<tr><th>" + (objetivo.toUpperCase()) + " Z = </th>";
    variaveis = document.getElementById("variaveis").value;
    restricoes = document.getElementById("restricoes").value;
    iteracoes = document.getElementById("iteracoes").value;
    restricoesOperadores = [];
    if (!restricoes || !variaveis || isNaN(restricoes) || isNaN(restricoes)) {
        alert('Número de variáveis ou restrições inválidos.')
        variaveis.value = null;
        restricoes.value = null;
        $("#parametros").hide();
        $("#reiniciar").hide();
        return null;
    }
    for (let index = 0; index < restricoes; index++) {
        restricoesOperadores.push("<=");
        inner += "<tr>"
        for (let variavel = 0; variavel < variaveis; variavel++) {
            
            var id = index + "_" + variavel;
            
            if (!index) {
                
                linhatexto += '<td>\
                <div class="input-group-prepend"  style="max-width: 150px">\
                    <input type="number" step="1" id="'+ linha + variavel + '" class="input_linha" style="width: 50px"  min="0" ><div class="input-group-text">x' + (variavel + 1) + '</div>\
                </div></td>';

            }
          
            inner += '<td>\
                <div class="input-group-prepend"  style="max-width: 150px">\
                    <input type="number" step="1" id="'+ id + '" class="input_simplex" style="width: 50px"  min="0" ><div class="input-group-text">x' + (variavel + 1) + '</div>\
                </div></td>';
        }
        inner += '<td><div class="input-group-prepend" style="max-width: 150px">\
            <div class="input-group-text">&ange;</div><input id="resultado_'+ index + '" class="input_simplex" type="number" step="1" style="width: 50px"  min="0" maxlength="1000">\
                </div></td></tr>';
                

    }
    linhatexto += "</tr>";
    
    tbody.innerHTML = inner;

    linha.innerHTML = linhatexto;
    $("#inicio").hide();
    $("#parametros").show();
}

function adicionarRestricao() {
    tbody = document.getElementById("tabela_restricoes");
    tbody.innerHTML = "";
    var linha = document.getElementById("linha_funcao");
    objetivo = $("#objetivo > input:checked").first().val();
    var inner = "";
    var linhatexto = "<tr><th>" + (objetivo.toUpperCase()) + " Z = </th>";
    variaveis = variaveis
    restricoes = restricoes
    restricoes=parseInt(restricoes)+parseInt(1);
    iteracoes = document.getElementById("iteracoes").value;
    restricoesOperadores = [];
    if (!restricoes || !variaveis || isNaN(restricoes) || isNaN(restricoes)) {
        alert('Número de variáveis ou restrições inválidos.')
        variaveis.value = null;
        restricoes.value = null;
        $("#parametros").hide();
        $("#reiniciar").hide();
        return null;
    }
    for (let index = 0; index < restricoes; index++) {
        restricoesOperadores.push("<=");
        inner += "<tr>"
        for (let variavel = 0; variavel < variaveis; variavel++) {
            var id = index + "_" + variavel;
            if (!index) {
                linhatexto += '<td>\
                <div class="input-group-prepend"  style="max-width: 150px">\
                    <input type="number" step="1" id="'+ linha + variavel + '" class="input_linha" style="width: 50px"  min="0" ><div class="input-group-text">x' + (variavel + 1) + '</div>\
                </div></td>';
            }
            inner += '<td>\
                <div class="input-group-prepend"  style="max-width: 150px">\
                    <input type="number" step="1" id="'+ id + '" class="input_simplex" style="width: 50px"  min="0" ><div class="input-group-text">x' + (variavel + 1) + '</div>\
                </div></td>';
        }
        inner += '<td><div class="input-group-prepend" style="max-width: 150px">\
            <div class="input-group-text">&ange;</div><input id="resultado_'+ index + '" class="input_simplex" type="number" step="1" style="width: 50px"  min="0" maxlength="1000">\
                </div></td></tr>';
    }
    linhatexto += "</tr>";
    tbody.innerHTML = inner;

    linha.innerHTML = linhatexto;
}


function reiniciar() {
    $("#parametros").hide();
    $("#solucao").hide();
    $("#analise").hide();
    $("#passoapasso").hide();
    $("#reiniciar").hide();
    $("#menufinal").hide();
    $("#inicio").show();
    

    document.getElementById("variaveis").value = null;
    document.getElementById("restricoes").value = null;
    document.getElementById("iteracoes").value = 100;

}

function resolverSimplex() { //RESOLUÇÃO DIRETA
    
    var inputs = document.getElementsByClassName("input_simplex");
    var linha = document.getElementsByClassName("input_linha");
    var matriz = [];
    var cabecalho = [0];
    var radioSelecionado =  $('input[name="tipo"]:checked').val(); //eeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    var quantidadeNegativaMinimizacao = 0;
    for (let i = 0; i < inputs.length; i++) {
        
        if (!inputs[i].value || isNaN(inputs[i].value)) {
            alert('Variáveis inválidas.')
            $("#solucao").hide();
            $("#reiniciar").hide();
            return null
        }
        var indices = inputs[i].id.split("_");
        
        matriz[indices[0]] = matriz[indices[0]] || [];
        matriz[indices[0]][indices[1]] = Number(inputs[i].value);
        
    }

    for (let i = 0; i < linha.length; i++) {
        
        if (!linha[i].value || isNaN(inputs[i].value)) {
            alert('Função inválida.')
            $("#solucao").hide();
            $("#reiniciar").hide();
            return null
        }
        //////////////////////////////////////////////////////////////////////////////
        if(radioSelecionado=="max") {
            cabecalho.push(Number(linha[i].value) * -1);  //MAXIMIZAÇÃO
            }else{
            cabecalho.push(Number(linha[i].value) );      //MINIMIZAÇÃO
        }
        /////////////////////////////////////////////////////////////////////////////
        if(linha[i].value < 0)
        quantidadeNegativaMinimizacao++;
        }

        if(radioSelecionado == "min" && quantidadeNegativaMinimizacao == 0)
        return alert("Não há solução para esse problema.");

    var tabelaSimplex = [];
    tabelaSimplex.push(cabecalho);

    for (let i = 0; i < matriz.length; i++) {
        var x = [matriz["resultado"][i]].concat(matriz[i]);
        tabelaSimplex.push(x);
    }

    //console.log(tabelaSimplex);

    simplexTabela = {
        m: tabelaSimplex.length,
        n: tabelaSimplex[0].length,
        tableau: tabelaSimplex,
        restricoes: restricoesOperadores,
        max: objetivo == "max"
    };

    if (!simplex(simplexTabela, iteracoes)) {
        return alert("Não foi possível achar uma solução.");
    }

    //console.log(simplexTabela);

    resultado = document.getElementById("resultado_simplex");
    header = document.getElementById("resultado_header");

    var resultTabela = gerarTabelaSolucao(simplexTabela);

    resultado.innerHTML = resultTabela.resultado;
    header.innerHTML = resultTabela.header;
    $("#passoapassotitle").html("Passo a Passo" );
    avancar();
    $("#solucao").show();
    analise()
    $("#analise").show();
    $("#solucaoHeader").show();
    $("#menufinal").show();
    $("#parametros").hide();
    $("html, body").animate({
        scrollTop: 1000
    }, 1000);
}

function resolverpassoapasso() {
    var inputs = document.getElementsByClassName("input_simplex");
    var linha = document.getElementsByClassName("input_linha");
    var matriz = [];
    var cabecalho = [0];
    var radioSelecionado =  $('input[name="tipo"]:checked').val(); //eeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    var quantidadeNegativaMinimizacao = 0;
    for (let i = 0; i < inputs.length; i++) {
        
        if (!inputs[i].value || isNaN(inputs[i].value)) {
            alert('Variáveis inválidas.')
            $("#solucao").hide();
            $("#reiniciar").hide();
            return null
        }
        var indices = inputs[i].id.split("_");
        matriz[indices[0]] = matriz[indices[0]] || [];
        matriz[indices[0]][indices[1]] = Number(inputs[i].value);
    }

    for (let i = 0; i < linha.length; i++) {
        if (!linha[i].value || isNaN(inputs[i].value)) {
            alert('Função inválida.')
            $("#solucao").hide();
            $("#reiniciar").hide();
            return null
        }
        ////////////////////////////////////////////////////////////////////////
        if(radioSelecionado=="max") {
            cabecalho.push(Number(linha[i].value) * -1);  //MAXIMIZAÇÃO
            }else{
            cabecalho.push(Number(linha[i].value) );      //MINIMIZAÇÃO
        }
        /////////////////////////////////////////////////////////////////////////////

        if(linha[i].value < 0)
            quantidadeNegativaMinimizacao++;
    }

    if(radioSelecionado == "min" && quantidadeNegativaMinimizacao == 0)
        return alert("Não há solução para esse problema.");

    var tabelaSimplex = [];
    tabelaSimplex.push(cabecalho);

    for (let i = 0; i < matriz.length; i++) {
        var x = [matriz["resultado"][i]].concat(matriz[i]);
        tabelaSimplex.push(x);
    }

    //console.log(tabelaSimplex);

    simplexTabela = {
        m: tabelaSimplex.length,
        n: tabelaSimplex[0].length,
        tableau: tabelaSimplex,
        restricoes: restricoesOperadores,
        max: objetivo == "max"
    };

    if (!simplex(simplexTabela, iteracoes)) {
        return alert("Não foi possível achar uma solução.");
    }

    //console.log(simplexTabela);

    resultado = document.getElementById("resultado_simplex");
    header = document.getElementById("resultado_header");

    var resultTabela = gerarTabelaSolucao(simplexTabela);

    resultado.innerHTML = resultTabela.resultado;
    header.innerHTML = resultTabela.header;
    $("#passoapassotitle").html("Passo a Passo" );
    avancar();
    $("#passoapasso").show();
    $("#parametros").hide();
    $("#reiniciar").show();
    $("html, body").animate({
        scrollTop: 1000
    }, 1000);
}



var pag = 0;

function avancar(i) {
    var tabelaPassoAPasso = $("#passoapasso");
    pag += i ? i : 0;
    if (!pag) {
        $("#anterior").hide();
        $("#proximo").show();
    } else {
        $("#anterior").show();
        if (pag == (simplexTabela.passoapasso.length - 1)) {
            $("#proximo").hide();
        $("#solucao").show();
        $("#menufinal").show();
        $("#solucaoHeader").hide();
        analise()
        $("#analise").show();
        } else {
            
            $("#proximo").show();
        }
    }
    var saiforapass = returnsaifora()
    if (pag < saiforapass.length  ){
        $("#saiufora").html(saiforapass[pag].toUpperCase() + "-" + " sai da iteração");
        }else{
            $("#saiufora").html(" Fim das iterações, quantidade de iteração: "+saiforapass.length);
    };
    $("#passoapassotitle").html("Passo a Passo");
    var htmlTabela = gerarTabelaSolucao(simplexTabela.passoapasso[pag]);//dgfdfgdgfdfgdgfdfgdfgdfg
    tabelaPassoAPasso.find("thead").html(htmlTabela.header);
    tabelaPassoAPasso.find("tbody").html(htmlTabela.resultado);
}

function gerarTabelaSolucao(tabela) {
    var inner = "";
    var linhatexto = "<tr><th></th>";

    var Z = "<tr><th>Z</th>";
    for (let index = 1; index < tabela.m; index++) {
        inner += "<tr><td>" + tabela.labelColumn[index - 1] + "</td>";
        for (let variavel = 0; variavel < tabela.n; variavel++) {
            let id = index + "_" + variavel;
            let value = Number.isInteger(tabela.tableau[index][variavel]) ? tabela.tableau[index][variavel] : tabela.tableau[index][variavel].toFixed(3);
            inner += '<td>' + value + '</td>';
        }
        inner += '</tr>';
    }
    for (let variavel = 0; variavel < tabela.n; variavel++) {
        var nome;
        Z += '<th>' + Number(tabela.tableau[0][variavel]).toFixed(3) + '</th>';
        linhatexto += '<th>' + (variavel ? tabela.labelRow[variavel - 1] : "b") + '</th>';
    }
    Z += "</tr>";
    linhatexto += "</tr>";


    return { resultado: inner + Z, header: linhatexto };
}

function analise() {
    var x = getSensibilityTable(simplexTabela);
    var tabela = $("#table-analise");
    var thead = "<thead><tr>"
    for (let index = 0; index < x.labelRow.length; index++) {
        const element = x.labelRow[index];
        thead += "<th>" + element + "</th>";
    }
    thead += "</tr></thead>";
    var tbody = "<tbody>";
    for (let index = 0; index < x.labelColumn.length; index++) {
        tbody += "<tr><th>" + x.labelColumn[index] + "</th>";
        for (let variavel = 0; variavel < 4; variavel++) {
            tbody += "<td>" + (isNaN(Number(x.table[index][variavel])) ? x.table[index][variavel] : x.table[index][variavel].toFixed(3)) + "</td>";
        }
        tbody += '</tr>';
    }

    tbody += "</tbody>";
    tabela.html(thead + tbody);

    $("#analise").show();
}
$(document).ready(function(){
    $("#fechar").on('click', function () { 
        $("#analise").hide(); 
    });
})