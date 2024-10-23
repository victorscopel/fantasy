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

$('.setvisual').on('click', function() {
    // Verifica se o elemento clicado já possui a classe 'ativo'
    if ($(this).hasClass('ativo')) {
        return;
    }   
    $('.setvisual.ativo').removeClass('ativo');    
    $(this).addClass('ativo');

    // Obtém os dados do elemento clicado
    var videoFeminino = $(this).data('f');	
    var videoMasculino = $(this).data('m');
    var videoPet = $(this).data('petvideo');	
	var nomePet = $(this).data('petnome');	

    // Atualiza os valores das opções no #videoSelect
    $('#videoSelect .feminino').val(videoFeminino);	
    $('#videoSelect .masculino').val(videoMasculino);	
	//$('#videoSelect .botaopet .raridade').text(nomePet);
	var videoElement = $('#videoPlayer');
	videoElement.find('source').attr('src', videoPet);
	videoElement[0].load(); // Carrega a nova fonte	

    // Troca o vídeo para o feminino ou masculino baseado no valor atual do select
    var currentVideo = $('#videoSelect .ativo').val(); // Pega o valor atual do select
    changeVideo(currentVideo); // Troca o vídeo para o selecionado
});



document.addEventListener("DOMContentLoaded", function() {
	const scrollContainer = document.querySelector(".listaitens");
	const scrollUpButton = document.querySelector(".scroll-up");
	const scrollDownButton = document.querySelector(".scroll-down");
	const scrollTrack = document.querySelector(".scroll-track");
	const scrollThumb = document.querySelector(".scroll-thumb");
	const scrollAmount = 50; // Ajuste para a quantidade de rolagem
	const thumbHeight = 47; // Altura fixa do scroll-thumb

	// Define onde o thumb começa e termina
	const thumbStart = scrollUpButton.clientHeight; // Posição inicial após o botão de cima
	const thumbEnd = scrollTrack.clientHeight - scrollDownButton.clientHeight - thumbHeight; // Posição final antes do botão de baixo

	// Sincroniza a posição do thumb com a rolagem
	function syncThumb() {
		const contentHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
		const thumbMaxTop = thumbEnd - thumbStart;
		const thumbTop = thumbStart + (scrollContainer.scrollTop / contentHeight) * thumbMaxTop;
		scrollThumb.style.top = `${thumbTop}px`;
	}

	// Função para rolar o conteúdo
	function scrollContent(amount) {
		scrollContainer.scrollBy({
			top: amount,
			behavior: "smooth"
		});
	}

	// Funções de clique nos botões
	scrollUpButton.addEventListener("click", () => scrollContent(-scrollAmount));
	scrollDownButton.addEventListener("click", () => scrollContent(scrollAmount));

	// Atualiza a posição do thumb quando o conteúdo muda
	scrollContainer.addEventListener("scroll", syncThumb);
	window.addEventListener("resize", syncThumb);
	syncThumb(); // Sincroniza ao carregar a página

	// Implementa o arraste do thumb
	let isDragging = false;
	let startY;
	let startTop;

	scrollThumb.addEventListener("mousedown", (e) => {
		isDragging = true;
		startY = e.clientY;
		startTop = parseFloat(scrollThumb.style.top) || thumbStart;
		document.body.style.userSelect = "none"; // Impede a seleção de texto durante o arraste
	});

	document.addEventListener("mouseup", () => {
		isDragging = false;
		document.body.style.userSelect = ""; // Restaura a seleção de texto
	});

	document.addEventListener("mousemove", (e) => {
		if (isDragging) {
			const deltaY = e.clientY - startY;
			const thumbMaxTop = thumbEnd - thumbStart;
			let newTop = startTop + deltaY;
			newTop = Math.max(thumbStart, Math.min(newTop, thumbEnd));
			scrollThumb.style.top = `${newTop}px`;

			// Sincroniza a rolagem do conteúdo com a posição do thumb
			const contentHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
			scrollContainer.scrollTop = ((newTop - thumbStart) / thumbMaxTop) * contentHeight;
		}
	});
});

$(function() {			
	// Inicializa as tabs
	$(".sistemasvisual").tabs();

	// Define a aba ativa
	$(".sistemasvisual").tabs("option", "active", 1);			
});
		
function changeVideo(src) {
    const videoElement = document.getElementById('video');
    // Primeiro, esconde o vídeo atual
    $(videoElement).fadeOut(150, function() {
        // Quando a animação de desvanecimento terminar, troque a fonte do vídeo
        videoElement.src = src;
        videoElement.load(); // Carrega o novo vídeo
        $(videoElement).fadeIn(150); // Faz o novo vídeo aparecer
    });
}

$('#videoSelect .botaovideo').on('click', function() {
    var videoUrl = $(this).val();		
	var currentSrc = $('#video').attr('src'); // Obtém o URL atual do vídeo
    if (videoUrl && videoUrl !== currentSrc) { // Verifica se o novo URL é diferente do atual
        changeVideo(videoUrl);
    }
	if ($(this).hasClass('ativo')) {
        return;
    }
	$('#videoSelect .ativo').removeClass('ativo');    
    $(this).addClass('ativo');
});

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
    // Abrir o popup e iniciar o vídeo
    $('.botaopet button').on('click', function() {
        $('#videoPopup').fadeIn();
        $('#videoPlayer')[0].play();
    });

    // Fechar o popup e pausar o vídeo
    $('#closePopupButton').on('click', function() {
        $('#videoPopup').fadeOut();
        $('#videoPlayer')[0].pause();
        $('#videoPlayer')[0].currentTime = 0;
    });
});
