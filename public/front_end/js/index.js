var chatButton = document.querySelector('.chat-widget--button');
var chatBubble = document.querySelector('.chat-widget--bubble');


window.onload = function() {
  Array.prototype.slice.call(document.getElementsByClassName("k-input")).forEach(function(currentValue, index) {
    currentValue.setAttribute("placeholder", "Digite sua mensagem ou dúvida... ");
  });


  document.querySelectorAll('.k-bubble').forEach(function(a) {
    if(a.innerText.indexOf("http") !== -1){
      console.log("POSSUO URL", a);
    }
  });
 
  console.log(document.querySelectorAll('k-message-list k-avatars .k-bubble'));

  // Chat
  chatBubble.classList.add('-hide');
  chatButton.addEventListener('click', function() {
    void chatBubble.offsetWidth;
    chatBubble.classList.toggle('-hide');
  }, false);

  }


  // Deixar funcional o chatbot apenas após as 18h
  function GetTimer() {
    var d = new Date();
    var horario = d.getHours();
    
    console.log("HORÁRIO AGORA: ", horario)
}