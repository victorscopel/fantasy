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

        // Check if the tooltip is visible
        if (window.getComputedStyle(tooltip).visibility === 'visible') {
            var tooltipWidth = tooltip.offsetWidth;
            var tooltipHeight = tooltip.offsetHeight;
            var x, y;

            // Calculate x and y based on cursor position and tooltip size
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

            // Ensure tooltip stays within the boundaries
            if (x + tooltipWidth > viewportWidth) {
                x = viewportWidth - tooltipWidth - tooltipOffset;
            }
            if (y + tooltipHeight > viewportHeight) {
                y = viewportHeight - tooltipHeight - tooltipOffset;
            }

            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';

            // Position .tooltipconstruir directly below .maintooltip
            if (tooltipConstruir && tooltipConstruir.classList.contains('tooltipconstruir')) {
                tooltipConstruir.style.left = x + 'px';
                tooltipConstruir.style.top = (y + tooltipHeight + tooltipOffset) + 'px';

                // Ensure .tooltipconstruir stays within the bottom boundary
                if (y + tooltipHeight + tooltipConstruir.offsetHeight + tooltipOffset > viewportHeight) {
                    tooltipConstruir.style.top = (y - tooltipConstruir.offsetHeight - tooltipOffset) + 'px';
                }
            }
        }
    }
};


// ABAS
$(function() {
    $('.containerdrops').tabs();
});

// ESCREVE ITEM NO HTML PUXANDO DA "DATABASE"
function itemid(itemVar, quantidade, itemType) {
    var itemElement = $(itemVar);
    // Set the quantity
    itemElement.find('.quantidade').text(quantidade);
    // Find the container where the item should be inserted
    var container;
    if (itemType === 'normal') {
        container = $('.itensnormais');
    } else if (itemType === 'heroico') {
        container = $('.itensheroicos');
    } else if (itemType === 'construido') {
        container = $('.itensconstruidos');
    } else if (itemType === 'aleatorio') {
        container = $('.dropsaleatorios');
    } else {
        console.error('Invalid item type');
        return;
    }
    // Append the item to the container
    container.append(itemElement);
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

function setLanguageFromStorage() {
	var lang = localStorage.getItem('language');
	if (lang) {
		// Atualiza o idioma principal no botão dropdown
		var selectedButton = $('.language-button[data-lang="' + lang + '"]');
		var imgSrc = selectedButton.find('img').attr('src');
		var text = selectedButton.find('p').text();
		$('.dropbtn img').attr('src', imgSrc);
		$('.dropbtn p').text(text);

		// Atualiza o conteúdo da página com o idioma selecionado
		updateLanguage(lang);
	}
}

$(document).ready(function() {
    // Ao clicar em um botão de idioma
    $('.language-button').click(function() {
        var lang = $(this).attr('data-lang');
        localStorage.setItem('language', lang); // Define o idioma no localStorage
        setLanguageFromStorage(); // Atualiza o idioma principal no botão dropdown
    });    

    // Obtém o país do usuário usando a API
    fetch("https://api.country.is/")
        .then(response => response.json())
        .then(data => {
            var userLanguage = setUserLanguage(data.country);
            if (!localStorage.getItem('language')) {
                localStorage.setItem('language', userLanguage);
                setLanguageFromStorage();
            }
        })
        .catch(error => {
            console.error('Erro ao obter informações do país:', error);
        });
});

// Função para definir o idioma da página com base no país do usuário
function setUserLanguage(countryCode) {
    switch (countryCode) {
        case "BR": // Brasil
        case "PT": // Portugal
        case "AO": // Angola
        case "MZ": // Moçambique
        case "GW": // Guiné-Bissau
        case "TL": // Timor-Leste
        case "CV": // Cabo Verde
        case "ST": // São Tomé e Príncipe
            return "pt";
        case "ES": // Espanha
        case "MX": // México
        case "AR": // Argentina
        case "CO": // Colômbia
        case "CL": // Chile
        case "PE": // Peru
        case "VE": // Venezuela
        case "EC": // Equador
        case "GT": // Guatemala
        case "CU": // Cuba
        case "BO": // Bolívia
        case "DO": // República Dominicana
        case "HN": // Honduras
        case "PY": // Paraguai
        case "NI": // Nicarágua
        case "SV": // El Salvador
        case "CR": // Costa Rica
        case "PA": // Panamá
        case "UY": // Uruguai
            return "es";
        case "ID": // Indonésia        
            return "id";
        case "TH": // Tailândia
            return "th";
        case "CN": // China
        case "HK": // Hong Kong
        case "MO": // Macau
        case "TW": // Taiwan
            return "cn";
        case "US": // Estados Unidos
        case "GB": // Reino Unido
        case "CA": // Canadá
        case "AU": // Austrália
        case "NZ": // Nova Zelândia
        case "IE": // Irlanda
        case "ZA": // África do Sul
        case "SG": // Singapura
            return "en";
        case "PH": // Filipinas
            return "ph";
        default:
            return "en"; // Idioma padrão para outros países não listados
    }
}

document.addEventListener('DOMContentLoaded', () => {		
    const dropdown = document.getElementById('language-buttons');
    const dropbtn = dropdown.querySelector('.dropbtn');
    const options = dropdown.querySelectorAll('.dropdown-content .language-button');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            const imgSrc = option.querySelector('img').getAttribute('src');
            const text = option.querySelector('p').textContent;

            dropbtn.querySelector('img').setAttribute('src', imgSrc);
            dropbtn.querySelector('p').textContent = text;

            // Atualiza o conteúdo da página com o idioma selecionado
            updateLanguage(lang);

            console.log(`Language selected: ${lang}`);
        });
    });
});
