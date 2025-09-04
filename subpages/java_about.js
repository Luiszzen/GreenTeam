let cards = document.querySelectorAll(".card");

function rotateCards() {
    let angle = 0;
    cards.forEach((card, index) =>{
        if (card.classList.contains("away")) {
            card.style.transform = 
            `translateY(-120vh) rotate(-48deg)`;
        } else {
            card.style.transform = `
            rotate(${angle}deg)`;
            angle = angle - 10;
            card.style.zIndex = cards.length - index;
        }
        
    });
}

rotateCards();

let mainContainer = document.querySelector(".main_container");
window.addEventListener("scroll", () => {
    let distance = window.innerHeight/2;
    let topVal = mainContainer.getBoundingClientRect().top;
    let index = -1 * (topVal/distance + 1);
    index = Math.floor(index);
    for (i = 0; i<cards.length; i++) {
        if (i <= index) {
            cards[i].classList.add("away");
        } else {
            cards[i].classList.remove("away");
        }}
        rotateCards();
});