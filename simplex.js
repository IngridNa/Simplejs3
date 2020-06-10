function createCopy(tableau) {
    let copy = new Tableau(tableau.m, tableau.n);
    for (let i = 0; i < tableau.tableau.length; i++) {
        copy.tableau[i] = tableau.tableau[i].slice();
    }
    copy.funcaoObjetivo = tableau.funcaoObjetivo.slice();
    copy.restricoes = tableau.restricoes.slice();
    copy.labelColumn = tableau.labelColumn.slice();
    copy.labelRow = tableau.labelRow.slice();
    return copy;
}

function getSensibilityTable(final) {
    var sensibilityTable = {
        labelRow: ["Variável", "Valor Final", "Preço Sombra", "+", "-"],
        labelColumn: final.labelRow.concat(["Z"]),
        table: Matriz(final.labelRow.length + 1, 4)
    };
    // VALOR FINAL
    for (let index = 0; index <= final.labelColumn.length; index++) {
        let i = sensibilityTable.labelColumn.indexOf(final.labelColumn[index]);
        sensibilityTable.table[i >= 0 ? i : (sensibilityTable.labelColumn.length - 1)][0] = (final.tableau[index + 1] || final.tableau[0])[0];
    }
    // PREÇO SOMBRA
    for (let index = 0; index < sensibilityTable.labelColumn.length; index++) {
        sensibilityTable.table[index][1] = "-";
        if (sensibilityTable.labelColumn[index].match(/^f/)) {
            sensibilityTable.table[index][1] = final.tableau[0][(index + 1) % sensibilityTable.labelColumn.length];
        }
    }
    // Calcular + e - 
    let firstColumn = final.labelRow.indexOf("f1") + 1;
    for (let index = 0, total = sensibilityTable.labelColumn.length; index < total; index++) {
        sensibilityTable.table[index][2] = "-";
        sensibilityTable.table[index][3] = "-";

        if (index >= firstColumn && (total) > index) {
            let divide = final.tableau[1][0];
            let maior = (divide) / (final.tableau[1][index]), menor = (divide) / (final.tableau[1][index]);

            for (let l = 1; l <= final.labelColumn.length; l++) {
                let divide = final.tableau[l][0];
                const element = final.tableau[l][index];
                let mn = (divide) / (element), mx = (divide) / (element);
                if (Math.abs(mn) !== Infinity) {
                    if (mn < menor) {
                        menor = mn;
                    }
                    if (mx > maior) {
                        maior = mx;
                    }
                }
            }
            sensibilityTable.table[index - 1][2] = Math.abs(maior);
            sensibilityTable.table[index - 1][3] = Math.abs(menor);
            if (final.labelColumn.indexOf(final.labelRow[index]) >= 0){
                sensibilityTable.table[index - 1][2] = Math.abs(menor);
                sensibilityTable.table[index - 1][3] = Math.abs(maior);
            }
        }

    }
    return sensibilityTable;
}