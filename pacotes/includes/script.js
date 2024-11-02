var tooltips = document.getElementsByClassName('maintooltip');
window.onmousemove = function (e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var tooltipOffset = 10; // Offset to ensure the tooltip doesn't touch the boundary

    for (var i = 0; i < tooltips.length; i++) {
        var tooltip = tooltips[i];
        var tooltipConstruir = tooltip.nextElementSibling; // Assumindo que .tooltipconstruir é o próximo elemento

        // Verifica se o tooltip está visível
        if (window.getComputedStyle(tooltip).visibility === 'visible') {
            var tooltipWidth = tooltip.offsetWidth;
            var tooltipHeight = tooltip.offsetHeight;
            var x, y;

            // Calcula x e y com base na posição do cursor e tamanho do tooltip
            if (mouseX + tooltipWidth + tooltipOffset < viewportWidth) {
                x = mouseX + tooltipOffset;
            } else {
                x = mouseX - tooltipWidth - tooltipOffset;
                if (x < 0) x = 0;
            }

            if (mouseY + tooltipHeight + tooltipOffset < viewportHeight) {
                y = mouseY + tooltipOffset;
            } else {
                y = mouseY - tooltipHeight - tooltipOffset;
                if (y < 0) y = 0;
            }

            // Garante que o tooltip permanece dentro das bordas
            if (x + tooltipWidth > viewportWidth) {
                x = viewportWidth - tooltipWidth - tooltipOffset;
            }
            if (y + tooltipHeight > viewportHeight) {
                y = viewportHeight - tooltipHeight - tooltipOffset;
            }

            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';

            // Posiciona .tooltipconstruir ao lado do .maintooltip se não houver espaço em cima ou embaixo
            if (tooltipConstruir && tooltipConstruir.classList.contains('tooltipconstruir')) {
                var construirHeight = tooltipConstruir.offsetHeight;
                var construirWidth = tooltipConstruir.offsetWidth;
                var construirX, construirY;

                // Tenta posicionar abaixo do .maintooltip
                if (y + tooltipHeight + construirHeight + tooltipOffset < viewportHeight) {
                    construirX = x;
                    construirY = y + tooltipHeight + tooltipOffset;
                }
                // Caso não caiba abaixo, tenta posicionar acima do .maintooltip
                else if (y - construirHeight - tooltipOffset > 0) {
                    construirX = x;
                    construirY = y - construirHeight - tooltipOffset;
                }
                // Caso não haja espaço suficiente em cima ou embaixo, posiciona ao lado direito ou esquerdo
                else if (mouseX + tooltipWidth + construirWidth + tooltipOffset < viewportWidth) {
                    construirX = x + tooltipWidth + tooltipOffset;
                    construirY = y;
                } else {
                    construirX = x - construirWidth - tooltipOffset;
                    construirY = y;
                    if (construirX < 0) construirX = 0;
                }

                tooltipConstruir.style.left = construirX + 'px';
                tooltipConstruir.style.top = construirY + 'px';
            }
        }
    }
};


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

    // Divide o tipo em um array, separando por vírgula
    var tipos = tipo.split(',');

    // Verifica se o item é um baú
    if (tipos.includes("bau")) {
        itemElement.addClass('tembau');
        // Associa o clique ao item de baú para abrir o diálogo
        itemElement.on('click', function() {
            openBauDialog(dataitemid);
        });
    }
    
    // Verifica se o item é um baú maior
    if (tipos.includes("baumaior")) {
        itemElement.addClass('tembau');
        // Associa o clique ao item de baú para abrir o diálogo de baú maior
        itemElement.on('click', function() {
            openBauDialog(dataitemid, "maior");
        });
    }

    // Verifica se o item possui construção
		if (tipos.includes("construir")) {
			// Cria e insere o elemento tooltipconstruir dentro do item correspondente
			var tooltipHtml = `
				<div class="tooltipconstruir">
					<h1></h1>
					<div class="containeritens"></div>
					<div class="containercusto">
						<div class="currency moedaepica">0</div>
						<div class="currency gp">0</div>
					</div>
				</div>
			`;

			// Anexa o tooltip ao itemElement
			itemElement.append(tooltipHtml);			

			// Mapeia os IDs e as quantidades dos itens do tooltip e os adiciona ao HTML
			var tpcData = window[dataitemid.replace('_bau', '_tpc')];
			if (tpcData) {
				var texto = tpcData.tpc_texto;
				var qtdGP = tpcData.tpc_gp;
				var qtdMoeda = tpcData.tpc_moeda;
				var mdcoin = tpcData.tpc_md;
				if (texto) {
					itemElement.find('.tooltipconstruir h1').text(texto);
				}
				if (qtdGP) {
					itemElement.find('.currency.gp').text(qtdGP);
				}
				if (qtdMoeda) {
					itemElement.find('.currency.moedaepica').text(qtdMoeda);
				}
				if (mdcoin) {
					itemElement.find('.currency.moedaepica').addClass("md");
				}
				var qtds = tpcData.tpc_qtd.split(',');
				var ids = tpcData.tpc_ids.split(',');

				ids.forEach(function(id, index) {
					var itemHtml = window['item' + id];
					var quantidade = qtds[index];
					var $itemElement = $(itemHtml).clone();

					// Remove o .maintooltip do item clonado
					$itemElement.find('.maintooltip').remove();

					// Atualiza a quantidade no elemento do item
					$itemElement.find('.quantidade').text(quantidade);

					// Adiciona o item limpo à estrutura do tooltipconstruir dentro do itemElement
					itemElement.find('.tooltipconstruir .containeritens').prepend($itemElement);
				});
			} else {
				console.error('Dados do tooltip não encontrados:', dataitemid);
			}
		}    

    // Se cutin for verdadeiro, associa um evento de clique no item para mostrar a animação
    if (cutin) {
        itemElement.on('click', function() {
            if ($('.cutin-image').length > 0) {
                return; // Se a imagem já está em exibição, não faz nada
            }

            // Supondo que o item tenha uma imagem dentro dele
            var itemImageSrc = itemElement.find('img').attr('src'); // Pega a imagem do item

            // Cria um novo elemento de imagem para o "cutin"
            var cutinElement = $('<img>', {
                src: itemImageSrc,
                class: 'cutin-image',
                css: {
                    position: 'absolute',
                    left: '-100%',
                    bottom: '0px',
                    opacity: 0,
                    zIndex: 9999
                }
            });

            $('#corpo').append(cutinElement);

            cutinElement.animate({
                left: '0',
                opacity: 1
            }, 600, function() {
                setTimeout(function() {
                    cutinElement.animate({
                        opacity: 0
                    }, 500, function() {
                        cutinElement.remove();
                    });
                }, 1500);
            });
        });
    }
}



function openBauDialog(itemVar, maior) {
    var bauData = window[itemVar];	
    if (!bauData) {
        console.error('Dados do baú não encontrados:', itemVar);
        return;
    }

    // Cria a div .bauaberto se não existir
    if ($(".bauaberto").length === 0) {
        $("body").append('<div class="bauaberto' + (maior ? ' maior' : '') + '"></div>');
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

    // Define a largura do diálogo com base na opção maior
    var dialogWidth = maior ? '808' : '528'; // largura padrão é 528, se 'maior' é passado, usa 700

    // Abre o diálogo do baú
    $(".bauaberto").dialog({
        autoOpen: true,
		modal: true,
        width: dialogWidth,
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

$(document).ready(function() {
    const params = new URLSearchParams(window.location.search);
    const pacoteNome = params.get('pacote');

    if (pacoteNome && window.Pacotes[pacoteNome]) {
        try {
            const pacote = window.Pacotes[pacoteNome];

            if (pacote.classe) {
                $("#corpo").addClass(pacote.classe);
            }
            if (pacote.descricao) {
                $('.descricaovip').html(pacote.descricao).show();
            }
            if (pacote.itens) {
                pacote.itens.forEach(itemCommand => {
                    try {
                        eval(itemCommand);
                    } catch (evalError) {
                        console.error("Erro ao executar itemCommand:", evalError);
                    }
                });
            }

            // Adicionar vídeo com seleção para masculino e feminino
            if (pacote.video) {
			const videoSelectHTML = pacote.video.useOptgroup ? `
				<video id="video" autoplay muted loop>
					<source src="${pacote.video.initialSrc}" type="video/mp4">
				</video>
				<div class="botoes-versao">
					<select id="videoSelect"  ${pacote.video.selectwidth ? `style="width:${pacote.video.selectwidth};"` : ''}>
						<optgroup label="Feminino">
							${pacote.video.feminino.map(opcao => `
								<option value="${opcao.src}" data-image="../imagens/feminino.png">${opcao.texto}</option>
							`).join('')}
						</optgroup>
						<optgroup label="Masculino">
							${pacote.video.masculino.map(opcao => `
								<option value="${opcao.src}" data-image="../imagens/masculino.png">${opcao.texto}</option>
							`).join('')}
						</optgroup>
					</select>
				</div>` : `
        <video id="video" autoplay muted loop>
            <source src="${pacote.video.initialSrc}" type="video/mp4">
        </video>
        <div class="botoes-versao">
            <select id="videoSelect" ${pacote.video.selectwidth ? `style="width:${pacote.video.selectwidth};"` : ''}>
                ${pacote.video.videos ? 
                    pacote.video.videos.map(opcao => `
                        <option value="${opcao.src}" data-image="${opcao.imagem}">${opcao.texto}</option>
                    `).join('') :
                    `
                        <option value="${pacote.video.feminino[0].src}" data-image="../imagens/feminino.png">Feminino</option>
                        <option value="${pacote.video.masculino[0].src}" data-image="../imagens/masculino.png">Masculino</option>
                    `}
            </select>
        </div>`;
                
                $('.videovisual').html(videoSelectHTML).show();
               
            }
          
        } catch (error) {
            console.error("Erro ao processar o pacote:", error);
        }
    } else {
        
    }
});


$(document).ready(function() {
    if ($(".colecaovip").length) {
        setTimeout(function() {                
            var items = document.querySelectorAll('.item');                                    
            if (items.length === 0) {                    
                return;
            }                
            var vipCount = 2;

            items.forEach(function(item, index) {                    
                var vipDiv = document.createElement('div');
                vipDiv.className = 'vip-info';
                vipDiv.textContent = vipCount + ' VIPs';
                            
                if (index !== 5) {
                    vipCount += 2;
                }
                
                item.appendChild(vipDiv);
            });
        }, 100);
        $(".colecaovip .videovisual").prepend("<div class='vip-info'>8 VIPs</div>");
		$(".colecaovip .botoes-versao").css("left", "5px").css("right", "unset");
    }	
    if ($('#videoSelect').length && $('#video').length && $('#video').is(':visible')) {
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
    }
// Função para trocar o vídeo com verificação se o elemento existe
function changeVideo(src) {
    var videoElement = document.getElementById('video');
    if (videoElement) {
        videoElement.src = src;
        videoElement.load();
    }
}
const video1 = document.getElementById('video');
const video2 = document.getElementById('video2');

// Função para aumentar a velocidade do vídeo
function increasePlaybackSpeed(video) {
	video.playbackRate = 3; // Define a taxa de reprodução para 3x
}

// Função para retornar à velocidade normal
function resetPlaybackSpeed(video) {
	video.playbackRate = 1; // Define a taxa de reprodução para 1x
}

// Função para adicionar eventos a um vídeo específico
function addPlaybackEvents(video) {
	video.addEventListener('mousedown', () => increasePlaybackSpeed(video));
	video.addEventListener('mouseup', () => resetPlaybackSpeed(video));
	video.addEventListener('mouseleave', () => resetPlaybackSpeed(video)); // Reseta se o mouse sair do vídeo
}

// Verifica se os vídeos existem antes de adicionar os eventos
if (video1) {
	addPlaybackEvents(video1);
}

if (video2) {
	addPlaybackEvents(video2);
}	
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

// Função para customizar a visualização da opção selecionada
function formatOptionSelection(option) {
    var imgSrc = $(option.element).data('image');
    if (imgSrc) {
        return $('<span class="imagemselect"><img src="' + imgSrc + '" /> ' + option.text + '</span>');
    }
    return option.text;
}