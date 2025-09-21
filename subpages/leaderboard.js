//leaderboard.js
console.log("Iniciando aplicación...");

function addDebugMessage(message) {
    console.log(message);
}

const originalLeaderboardData = {
    '6to': {
        labels: ['Salón A', 'Salón B', 'Salón C', 'Salón D'],
        values: [25, 18, 30, 22]
    },
    '7mo': {
        labels: ['Salón A', 'Salón B', 'Salón C', 'Salón D'],
        values: [45, 38, 41, 35]
    },
    '8vo': {
        labels: ['Salón A', 'Salón B', 'Salón C', 'Salón D'],
        values: [100, 60, 12, 17]
    },
    '9no': {
        labels: ['Salón A', 'Salón B', 'Salón C', 'Salón D'], 
        values: [48, 35, 44, 39]
    },
    '10mo': {
        labels: ['Salón A', 'Salón B', 'Salón C', 'Salón D'],
        values: [42, 47, 38, 45]
    },
    '11vo': {
        labels: ['Salón A', 'Salón B', 'Salón C', 'Salón D'],
        values: [51, 43, 49, 46]
    },
    'promociones': {
        labels: ['6to Grado', '7mo Grado', '8vo Grado', '9no Grado', '10mo Grado', '11vo Grado'],
        values: [95, 159, 189, 166, 172, 189]
    }
};

// Función para obtener los datos del leaderboard (prioriza datos personalizados)
function getLeaderboardData() {
    const customData = localStorage.getItem('customLeaderboardData');
    
    if (customData) {
        try {
            const parsedData = JSON.parse(customData);
            addDebugMessage("Usando datos personalizados del localStorage");
            return parsedData;
        } catch (error) {
            addDebugMessage("Error al parsear datos personalizados, usando datos originales");
            console.error("Error parsing custom data:", error);
            return originalLeaderboardData;
        }
    }
    
    addDebugMessage("Usando datos originales");
    return originalLeaderboardData;
}

const barColors = ['#4a7c4a', '#5a8c5a', '#6a9c6a', '#7aac7a', '#8abc8a', '#9acc9a'];

function createChart(category) {
    addDebugMessage(`=== CREANDO GRÁFICO PARA: ${category} ===`);
    
    // Usar la función getLeaderboardData() en lugar de la variable directa
    const leaderboardData = getLeaderboardData();
    const data = leaderboardData[category];
    
    if (!data) {
        addDebugMessage(`ERROR: No datos para ${category}`);
        return;
    }

    const yAxisContainer = document.getElementById('yAxisContainer');
    const gridContainer = document.getElementById('gridContainer');
    const barsWrapper = document.getElementById('barsWrapper');

    if (!yAxisContainer || !gridContainer || !barsWrapper) {
        addDebugMessage('ERROR: No se encontraron los contenedores');
        return;
    }

    // Limpiar contenido anterior
    yAxisContainer.innerHTML = '';
    gridContainer.innerHTML = '';
    barsWrapper.innerHTML = '';

    // Calcular escala del eje Y
    const maxValue = Math.max(...data.values);
    let yMax;
    
    if (maxValue <= 50) {
        yMax = Math.ceil(maxValue / 10) * 10;
    } else if (maxValue <= 100) {
        yMax = Math.ceil(maxValue / 20) * 20;
    } else {
        yMax = Math.ceil(maxValue / 50) * 50;
    }

    // Asegurar un mínimo razonable para el eje Y
    if (yMax < 20) yMax = 20;

    addDebugMessage(`Máximo: ${maxValue}kg, Eje Y: 0-${yMax}kg`);

    // Crear etiquetas del eje Y (6 niveles)
    const numLevels = 6;
    const step = yMax / (numLevels - 1);
    
    for (let i = numLevels - 1; i >= 0; i--) {
        const value = Math.round(i * step);
        const label = document.createElement('div');
        label.className = 'y-label-text';
        label.textContent = value;
        yAxisContainer.appendChild(label);
    }

    // Crear líneas de grilla
    for (let i = 0; i < numLevels; i++) {
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line';
        gridLine.style.top = `${(i / (numLevels - 1)) * 100}%`;
        gridContainer.appendChild(gridLine);
    }

    // Crear barras
    data.values.forEach((value, index) => {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';

        const barColumn = document.createElement('div');
        barColumn.className = 'bar-column';

        const actualBar = document.createElement('div');
        actualBar.className = 'actual-bar';
        actualBar.style.backgroundColor = barColors[index % barColors.length];
        
        // CÁLCULO CORRECTO DE ALTURA
        const heightPercent = (value / yMax) * 100;
        actualBar.style.height = `${heightPercent}%`;

        const valueLabel = document.createElement('div');
        valueLabel.className = 'value-label';
        valueLabel.textContent = `${value} kg`;

        const xLabel = document.createElement('div');
        xLabel.className = 'x-label';
        xLabel.textContent = data.labels[index];

        actualBar.appendChild(valueLabel);
        barColumn.appendChild(actualBar);
        barItem.appendChild(barColumn);
        barItem.appendChild(xLabel);
        barsWrapper.appendChild(barItem);

        addDebugMessage(`Barra ${index}: ${value}kg = ${heightPercent.toFixed(1)}% de altura`);
    });

    addDebugMessage(`Gráfico completado para ${category}`);
}

// Función para verificar si hay cambios en los datos y actualizar el gráfico automáticamente
function watchDataChanges() {
    let lastDataString = localStorage.getItem('customLeaderboardData');
    
    setInterval(() => {
        const currentDataString = localStorage.getItem('customLeaderboardData');
        if (currentDataString !== lastDataString) {
            lastDataString = currentDataString;
            const currentCategory = document.getElementById('gradeSelector').value;
            addDebugMessage('Datos actualizados, refrescando gráfico...');
            createChart(currentCategory);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    addDebugMessage('DOM cargado');
    
    const selector = document.getElementById('gradeSelector');
    if (!selector) {
        addDebugMessage('ERROR: Selector no encontrado');
        return;
    }

    addDebugMessage('Iniciando con 6to grado...');
    createChart('6to');

    selector.addEventListener('change', function(e) {
        addDebugMessage(`Cambiando a: ${e.target.value}`);
        createChart(e.target.value);
    });

    // Iniciar el monitor de cambios de datos
    watchDataChanges();

    addDebugMessage('Sistema inicializado correctamente');
});

// Función adicional para exportar datos (útil para debugging)
function exportLeaderboardData() {
    const data = getLeaderboardData();
    const dataStr = JSON.stringify(data, null, 2);
    console.log("Datos actuales del leaderboard:", dataStr);
    return data;
}

// Función adicional para importar datos desde un objeto (útil para debugging)
function importLeaderboardData(newData) {
    try {
        localStorage.setItem('customLeaderboardData', JSON.stringify(newData));
        addDebugMessage('Datos importados correctamente');
        const currentCategory = document.getElementById('gradeSelector').value;
        createChart(currentCategory);
        return true;
    } catch (error) {
        addDebugMessage('Error al importar datos: ' + error.message);
        return false;
    }
}

// Hacer estas funciones disponibles globalmente para debugging
window.exportLeaderboardData = exportLeaderboardData;
window.importLeaderboardData = importLeaderboardData;