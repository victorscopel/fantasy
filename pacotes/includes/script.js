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
function itemid(itemVar, quantidade, tipo = "", cutin = false, container = "") {
    if (container === "") {
        container = $('.items'); 
    } else {
        container = $(container);
    }

    // Converte a string do item em um elemento HTML
    var itemElement = $(itemVar);

    // Atualiza a quantidade do item
    itemElement.find('.quantidade').text(quantidade);
    var dataitemid = itemElement.data('iditem');

    // Adiciona o item ao container
    container.append(itemElement);

    // Verifica se o item é um baú
    if (tipo === "bau") {
		itemElement.addClass('tembau');
        // Associa o clique ao item de baú para abrir o diálogo
        itemElement.on('click', function() {
            openBauDialog(dataitemid); // Exemplo: usando o baú item2394100_bau como dados
        });
    }

    // Se cutin for verdadeiro, associa um evento de clique no item para mostrar a animação
    if (cutin) {
        itemElement.on('click', function() {
            // Verifica se a cutin já está sendo exibida
            if ($('.cutin-image').length > 0) {
                return; // Se a imagem já está em exibição, não faz nada
            }

            // Supondo que o item tenha uma imagem dentro dele
            var itemImageSrc = itemElement.find('img').attr('src'); // Pega a imagem do item

            // Cria um novo elemento de imagem para o "cutin"
            var cutinElement = $('<img>', {
                src: itemImageSrc, // Atribui a imagem do item
                class: 'cutin-image', // Classe para estilizar
                css: {
                    position: 'absolute',
                    left: '-100%',  // Começa fora da tela à esquerda
                    bottom: '0px',     // Centraliza verticalmente                    
                    opacity: 0,
                    zIndex: 9999 // Garante que o elemento apareça na frente
                }
            });

            // Adiciona o elemento de cutin ao #corpo
            $('#corpo').append(cutinElement);

            // Aplica o efeito de slide da esquerda para a direita
            cutinElement.animate({
                left: '0',      // Move para a posição visível
                opacity: 1
            }, 600, function() {
                // Após um tempo, some com fade
                setTimeout(function() {
                    cutinElement.animate({
                        opacity: 0
                    }, 500, function() {
                        // Remove o elemento após o efeito de fade
                        cutinElement.remove();
                    });
                }, 1500); // Exibe a imagem por 2 segundos antes de desaparecer
            });
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
        <h2>Você pode obter os itens abaixo.</h2>
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
const video = document.getElementById('video');

// Função para aumentar a velocidade do vídeo
function increasePlaybackSpeed() {
	video.playbackRate = 3; // Define a taxa de reprodução para 2x
}

// Função para retornar à velocidade normal
function resetPlaybackSpeed() {
	video.playbackRate = 1; // Define a taxa de reprodução para 1x
}

// Adiciona eventos de mouse
video.addEventListener('mousedown', increasePlaybackSpeed);
video.addEventListener('mouseup', resetPlaybackSpeed);
video.addEventListener('mouseleave', resetPlaybackSpeed); // Reseta se o mouse sair do vídeo

$(document).ready(function() {
    $('#videoSelect').select2({
		closeOnSelect: true,
		minimumResultsForSearch: 12,
        templateResult: formatOption,  // Função para customizar as opções
        templateSelection: formatOptionSelection  // Customiza a seleção
    });

    // Carrega a versão feminina por padrão ao iniciar
    var initialVideo = $('#videoSelect').val();
    changeVideo(initialVideo);

    $('#videoSelect').on('change', function() {
        var videoUrl = $(this).val();
        if (videoUrl) {
            changeVideo(videoUrl);
        }
    });
});

// Customiza as opções para exibir imagem
function formatOption(option) {
    if (!option.id) {
        return option.text;  // Retorna o texto padrão para as opções sem id (como o placeholder)
    }

    var imgSrc = $(option.element).data('image');  // Pega a imagem a partir do atributo data-image
    if (imgSrc) {
        var $option = $(
            '<span class="imagemselectdropdown"><img src="' + imgSrc + '" /> ' + option.text + '</span>'
        );
        return $option;
    }

    return option.text;
}

// Customiza a visualização da opção selecionada
function formatOptionSelection(option) {
    var imgSrc = $(option.element).data('image');
    if (imgSrc) {
        return $('<span class="imagemselect"><img src="' + imgSrc + '" /> ' + option.text + '</span>');
    }
    return option.text;
}