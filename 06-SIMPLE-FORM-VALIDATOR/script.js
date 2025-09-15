const form = document.getElementById('form');
const userName =document.getElementById('userName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

function checkRequired(inputArray) {
    let isValid = true;

    inputArray.forEach((input) => {
        // Password is required
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false;
        } else {
            showSuccess(input);
        }
    });

    return isValid;
}
// Format field name with proper capitalization
function formatFieldName(input) {
    // if input.id === "userName" it will: username --> Username
    return (input.id).charAt(0).toUpperCase() + input.id.toLowerCase().slice(1);
}
//This function shows the error/
function showError(input, message) {
    //Here we want to add "error" to the class of formGroup id which is parent.
    const formGroup = input.parentElement;
    formGroup.className = "formGroup error";
    //This will fetch small from DOM and pass-in message argument.
    const small = formGroup.querySelector('small');
    small.innerText = message;
}
//This function shows successful parts
function showSuccess(input){
    const formGroup = input.parentElement;
    formGroup.className = "formGroup success";
}

////////////////////////////////////////////////////////////////////////////////////

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${formatFieldName(input)} must be at least ${min} characters`);
        return false;
    } else if (input.value.length > max) {
        showError(input, `${formatFieldName(input)} must be less than ${max} characters`);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}
function checkEmail(email) {
    // Email regex that covers most common email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.value.trim())) {
        showSuccess(email);
        return true;
    } else {
        showError(email, "Email is not valid");
        return false;
    }
}
function checkPasswordMatch(password, confirmPassword) {
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, "Passwords do not match");
        return false;
    }
    return true;
}

form.addEventListener('submit', function(e){
    e.preventDefault();

    let isFormValid = checkRequired([userName, email, password, confirmPassword]);

    if(isFormValid){
        const isUsernameValid = checkLength(userName, 3, 15);
        const isEmailValid =checkEmail(email);
        const isPasswordValid =checkLength(password,6,25);
        const isPasswordMatch =checkPasswordMatch(password,confirmPassword);
        console.log(isUsernameValid, isEmailValid, isPasswordValid, isPasswordMatch);

        isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPasswordMatch;
    }
    if(isFormValid){
        alert('Form submitted successfully');
        form.reset();

        document.querySelectorAll(".formGroup").forEach((group) => {
            group.className = "formGroup";
        })
    }
});
