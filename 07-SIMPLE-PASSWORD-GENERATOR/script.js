const copyBtn = document.getElementById("copyBtn");
const passwordInput = document.getElementById("password");
const passwordContainer = document.querySelector(".passwordContainer");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generateBtn");
const strengthBar = document.querySelector(".strengthBar");
const strengthText = document.querySelector(".strengthContainer p");
const strengthLabel = document.getElementById("strengthLabel");

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";


function showCopySuccess(element) {
    console.log(element);
    element.classList.remove("far", "fa-copy");
    element.classList.add("fas", "fa-check");
    element.style.color = "#48bb78";
    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-copy");
        element.style.color = "";
    }, 2000);
}
function createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols){
    let allCharacters = "";
    if(includeUppercase) allCharacters += uppercaseLetters;
    if(includeLowercase) allCharacters += lowercaseLetters;
    if(includeNumbers) allCharacters += numberCharacters;
    if(includeSymbols) allCharacters += symbolCharacters;

    let password = "";
    for(let i = 0; i < length; i++){
        const randomCharacterIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomCharacterIndex];
    }
    return password;
}
function makePassword(){
    const length = +lengthSlider.value;
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;

    if(!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols){
        alert("Please select at least one character set");
        return;
    }

    const newPassword = createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);

    passwordInput.value = newPassword;
    updateStrengthMeter(newPassword)
}
function updateStrengthMeter(password) {
    const passwordLength = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

    let strengthScore = 0;

    // here the .min will get the minimum value
    // but this will make sure that "at maximum" you would get 40
    strengthScore += Math.min(passwordLength * 2, 40);

    if (hasUppercase) strengthScore += 15;
    if (hasLowercase) strengthScore += 15;
    if (hasNumbers) strengthScore += 15;
    if (hasSymbols) strengthScore += 15;

    // enforce minimum score for every short password
    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    // ensure the width of the strength bar is a valid percentage
    const safeScore = Math.max(5, Math.min(100, strengthScore));
    strengthBar.style.width = safeScore + "%";

    let strengthLabelText = "";
    let barColor = "";

    if (strengthScore < 40) {
        // weak password
        barColor = "#fc8181";
        strengthLabelText = "Weak";
    } else if (strengthScore < 70) {
        // Medium password
        barColor = "#fbd38d"; // Yellow
        strengthLabelText = "Medium";
    } else {
        // Strong password
        barColor = "#68d391"; // Green
        strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
}

passwordContainer.addEventListener("click", (e) =>{
    if(e.target.id === "password"){
        const hexValue = e.target;
        navigator.clipboard.writeText(hexValue.value)
            .then(()=>showCopySuccess(e.target.nextElementSibling))
            .catch((err)=>console.error(err))
    }
    else if(e.target.id === "copyBtn"){
        const hexValue = e.target.previousElementSibling;
        navigator.clipboard.writeText(hexValue.value)
            .then(()=>showCopySuccess(e.target))
            .catch((err)=>console.error(err))
    }
})

lengthSlider.addEventListener("input", () =>{
    lengthDisplay.textContent = lengthSlider.value;
})

generateButton.addEventListener("click", makePassword)

window.addEventListener("DOMContentLoaded", makePassword);

