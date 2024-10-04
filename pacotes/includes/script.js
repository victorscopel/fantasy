// TOOLTIP
var tooltips = document.getElementsByClassName('maintooltip');
window.onmousemove = function (e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var tooltipOffset = 10; // Offset to ensure the tooltip doesn't touch the boundary

    for (var i = 0; i < tooltips.length; i++) {
        var tooltip = tooltips[i];
        // Check if the tooltip is visible
        if (window.getComputedStyle(tooltip).visibility === 'visible') {
            var tooltipWidth = tooltip.offsetWidth;
            var tooltipHeight = tooltip.offsetHeight;
            var x, y;
            // Calculate x and y based on cursor position and tooltip size
            if (mouseX + tooltipWidth + tooltipOffset < viewportWidth) {
                // Tooltip can be to the right of the cursor
                x = mouseX + tooltipOffset;
            } else {
                // Tooltip should be to the left of the cursor
                x = mouseX - tooltipWidth - tooltipOffset;
                // Make sure tooltip stays within the left boundary
                if (x < 0) {
                    x = 0;
                }
            }

            if (mouseY + tooltipHeight + tooltipOffset < viewportHeight) {
                // Tooltip can be below the cursor
                y = mouseY + tooltipOffset;
            } else {
                // Tooltip should be above the cursor
                y = mouseY - tooltipHeight - tooltipOffset;
                // Make sure tooltip stays within the top boundary
                if (y < 0) {
                    y = 0;
                }
            }

            // Make sure tooltip stays within the right boundary
            if (x + tooltipWidth > viewportWidth) {
                x = viewportWidth - tooltipWidth - tooltipOffset;
            }

            // Make sure tooltip stays within the bottom boundary
            if (y + tooltipHeight > viewportHeight) {
                y = viewportHeight - tooltipHeight - tooltipOffset;
            }

            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';            
        }
    }
};

// Função para adicionar um item ao HTML e abrir o baú quando for clicado
function itemid(itemVar, quantidade, tipo = "") {		
    var container = $('.items'); // O container onde os itens serão adicionados

    // Converte a string do item em um elemento HTML
    var itemElement = $(itemVar);

    // Atualiza a quantidade do item
    itemElement.find('.quantidade').text(quantidade);
	var dataitemid = itemElement.data('iditem');	
	
    // Adiciona o item ao container
    container.append(itemElement);

    // Verifica se o item é um baú
    if (tipo === "bau") {
        // Associa o clique ao item de baú para abrir o diálogo
        itemElement.on('click', function() {
            // Chama a função que irá gerar o conteúdo do baú	
            openBauDialog(dataitemid);  // Exemplo: usando o baú item2394100_bau como dados
        });
    }
}

// Função para abrir o diálogo do baú e carregar os itens dinamicamente
function openBauDialog(itemVar) {
    var bauData = window[itemVar];	
    if (!bauData) {
        console.error('Dados do baú não encontrados:', itemVar);
        return;
    }

    // Limpa o conteúdo anterior do baú
    $(".bauaberto .itens").empty();

    // Estrutura fixa do baú
    var dialogContent = `
        <h2>Você receberá os itens abaixo.</h2>
        <div class="itens"><div class="clearboth"></div></div>
    `;
    $(".bauaberto").html(dialogContent);

    // Mapeia os IDs e as quantidades dos itens do baú
    var ids = bauData.bau_ids.split(',');
    var qtds = bauData.bau_qtd.split(',');

    // Loop para adicionar cada item ao baú
    ids.forEach(function(id, index) {
        var itemHtml = window['item' + id];
        var quantidade = qtds[index];
        var $itemElement = $(itemHtml);

        // Atualiza a quantidade no elemento do item
        $itemElement.find('.quantidade').text(quantidade);

        // Adiciona o item à estrutura do baú
        $(".bauaberto .itens").prepend($itemElement);
    });

    // Abre o diálogo do baú
    $(".bauaberto").dialog({
        autoOpen: true,
		modal: true,
        width: '528',
        closeText: "X"
    });
	
}


// TRADUÇÃO
const translations = {};

// Function to update translations with new data
function addTranslations(newTranslations) {
    Object.keys(newTranslations).forEach(language => {
        if (!translations[language]) {
            translations[language] = {};
        }
        Object.assign(translations[language], newTranslations[language]);
    });
}

// Function to get the translation for a given key and language with fallbacks
function getTranslation(key, language) {
    if (translations[language] && translations[language][key]) {
        return translations[language][key];
    } else if (language !== 'en' && translations['en'] && translations['en'][key]) {
        return translations['en'][key];
    } else {
        return translations['pt'][key]; // Fallback to 'pt'
    }
}

// Function to update the language of the elements with appropriate fallbacks
function updateLanguage(language) {
    const elements = $('[data-translate]');
    elements.each(function() {
        const key = $(this).data('translate');
        const translation = getTranslation(key, language);
        $(this).html(translation);
    });
}

function changeVideo(src) {
	const videoElement = document.getElementById('video');
	videoElement.src = src;
	videoElement.load();
}
