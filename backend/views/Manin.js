const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('Navbar');
if (bar) {
    bar.addEventListener('click', () =>{
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () =>{
        nav.classList.remove('active');
    })
}






document.addEventListener("DOMContentLoaded", function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slider img");
    const totalSlides = slides.length;

    function showSlide(index) {
        const offset = -index * 100;
        document.querySelector(".slider").style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 3000); // Change slide every 3 seconds
});
















