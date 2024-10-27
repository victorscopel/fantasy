$(document).ready(function() {
    // Abrir o popup e iniciar o vídeo
    $('.botaopet button').on('click', function() {
        $('#videoPopup').fadeIn();
        $('#popupOverlay').fadeIn();
        $('#videoPlayer')[0].play();
    });

    // Fechar o popup e pausar o vídeo
    $('#closePopupButton').on('click', function() {
        fecharPopup();
    });

    // Fechar o popup ao clicar na sobreposição
    $('#popupOverlay').on('click', function() {
        fecharPopup();
    });

    // Função para fechar o popup
    function fecharPopup() {
        $('#videoPopup').fadeOut();
        $('#popupOverlay').fadeOut();
        $('#videoPlayer')[0].pause();
        $('#videoPlayer')[0].currentTime = 0;
    }
});
