document.addEventListener("DOMContentLoaded", (event) => {
    let flash = document.querySelector(".error-message");
    if(flash !== null){
        flash.addEventListener("click", function(){
            flash.classList.remove("ani-fadein");
            flash.classList.add("ani-fadeout");
            setTimeout(() => {
                flash.remove();
            }, 800);
        })
    }
  });