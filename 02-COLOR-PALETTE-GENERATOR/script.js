const generateBtn=document.getElementById("generateBtn");
const paletteSection=document.querySelector(".paletteSection");

generateBtn.addEventListener("click", genPalette);

function genPalette(){
    const colors = [];
    for(let i=0; i<5; i++){
        colors.push(generateRandomColor());
    }
    updatePaletteDisplay(colors);
}

generateRandomColor = () =>{
    const letter ="0123456789ABCDEF"
    let color = "#"
    for(let i=0; i<6; i++){
        color += letter[Math.floor(Math.random()*16)];
    }
    return color;
}

updatePaletteDisplay = (colors) =>{
  const colorBoxes = document.querySelectorAll(".colorBox");

  colorBoxes.forEach((box, index) => {
      const color = colors[index];
      const colorDiv = box.querySelector(".color");
      const hexValue = box.querySelector(".hexValue");

      colorDiv.style.backgroundColor = color;
      hexValue.textContent = color;
  })
}

paletteSection.addEventListener("click", (e) =>{
    if(e.target.classList.contains("copy-btn")){
        const hexValue = e.target.previousElementSibling;
        navigator.clipboard.writeText(hexValue.textContent)
            .then(()=>showCopySuccess(e.target))
            .catch((err)=>console.error(err))
    }
    else if (e.target.classList.contains("color")) {
        const hexValue = e.target.nextElementSibling.querySelector(".hexValue").textContent;
        navigator.clipboard
            .writeText(hexValue)
            .then(() => showCopySuccess(e.target.nextElementSibling.querySelector(".copy-btn")))
            .catch((err) => console.log(err));
    }
})
function showCopySuccess(element) {
    element.classList.remove("far", "fa-copy");
    element.classList.add("fas", "fa-check");

    element.style.color = "#48bb78";

    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-copy");
        element.style.color = "";
    }, 1500);
}
 // genPalette();