
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const errorContainer = document.getElementById("errorContainer");
const resultHeading = document.getElementById("resultHeading");
const mealsContainer = document.getElementById("meals");
const mealDetails = document.getElementById("mealDetails");
const mealDetailsContent = document.querySelector(".mealDetailsContent")
const backBtn = document.getElementById("backBtn");

const API_KEY = "577041a90759401d9aaf88e54f8aff09";
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;


async function searchMeals() {

    // TODO:HANDLE THE EDGE CASE
    if (searchInput.value.trim() === "") {
        errorContainer.textContent = "Please enter a search query.";
        errorContainer.classList.remove("hidden");
        return;
    }
    else{
        errorContainer.classList.add("hidden");
    }

    const query = searchInput.value.trim();
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=5`;

    try {
        const res = await fetch(url);
        const data = await res.json();


        if(data.results.length===0) {
            resultHeading.textContent = "";
            errorContainer.textContent = `No results found for "${query}". Try again with a different search query.`;
            errorContainer.classList.remove("hidden");
        }
        else {
            errorContainer.classList.add("hidden");
            resultHeading.textContent = `Search results for "${query}":`;
            displayMealsApi1(data.results);
            searchInput.value = "";
        }
        console.log(data.results);

    } catch (err) {
        // errorContainer.textContent = "Error fetching search results.";
        // errorContainer.classList.remove("hidden");
        console.error("Error fetching search results:", err);

        try {
            mealsContainer.innerHTML = "";
            errorContainer.classList.add("hidden");

            // fetch meals from API
            // www.themealdb.com/api/json/v1/1/search.php?s=chicken
            const response = await fetch(`${SEARCH_URL}${query}`);
            const data = await response.json();

            if (data.meals === null) {
                // no meals found
                resultHeading.textContent = ``;
                mealsContainer.innerHTML = "";
                errorContainer.textContent = `No recipes found for "${query}". Try another search term!`;
                errorContainer.classList.remove("hidden");
            } else {
                resultHeading.textContent = `Search results for "${query}":`;
                displayMealsApi2(data.meals);
                searchInput.value = "";
            }
        } catch (error) {
            errorContainer.textContent = "Something went wrong. Please try again later.";
            errorContainer.classList.remove("hidden");
        }
    }
}

function displayMealsApi1(meals) {
    mealsContainer.innerHTML = "";

    // loop through meals and create a card for each meal
    meals.forEach((meal) => {
        mealsContainer.innerHTML += `
      <div class="meal" data-meal-id="${meal.id}">
        <img src="${meal.image}" alt="${meal.title}">
        <div class="meal-info">
          <h3 class="meal-title">${meal.title}</h3>
           ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
        </div>
      </div>
    `;
    });
}
function displayMealsApi2(meals) {
        mealsContainer.innerHTML = "";

        // loop through meals and create a card for each meal
        meals.forEach((meal) => {
            mealsContainer.innerHTML += `
      <div class="meal" data-meal-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
          <h3 class="meal-title">${meal.strMeal}</h3>
          ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
        </div>
      </div>
    `;
        });
}

async function handleMealClick(e) {
    const mealEl = e.target.closest(".meal");
    if (!mealEl) return;

    const mealId = mealEl.getAttribute("data-meal-id");

    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];

            const ingredients = [];

            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
                    ingredients.push({
                        ingredient: meal[`strIngredient${i}`],
                        measure: meal[`strMeasure${i}`],
                    })
                }
            }

// display meal details
            mealDetailsContent.innerHTML = `
           <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
           <h2 class="meal-details-title">${meal.strMeal}</h2>
           <div class="meal-details-category">
             <span>${meal.strCategory || "Uncategorized"}</span>
           </div>
           <div class="meal-details-instructions">
  <h3>Instructions</h3>
  <ol class="instructions-list">
    ${meal.strInstructions
                .split(/(?<=[.?!])\s+(?=[A-Z])/)
                .map((step) => `<li>${step.trim()}</li>`)
                .join("")}
  </ol>
</div>

           <div class="meal-details-ingredients">
             <h3>Ingredients</h3>
             <ul class="ingredients-list">
               ${ingredients
                .map(
                    (item) => `
                 <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
               `
                )
                .join("")}
             </ul>
           </div>
           ${
                meal.strYoutube
                    ? `
             <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
               <i class="fab fa-youtube"></i> Watch Video
             </a>
           `
                    : ""
            }
         `;

            mealDetails.classList.remove("hidden");
            mealDetails.scrollIntoView({ behavior: "smooth" });
        }
    } catch (error) {
        errorContainer.textContent = "Could not load recipe details. Please try again later.";
        errorContainer.classList.remove("hidden");
    }
}

searchBtn.addEventListener("click", searchMeals)
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchMeals();
})
searchBtn.addEventListener("mouseover", () => {
    const search=document.createElement("i");
    searchBtn.classList.add("expand");
    searchBtn.textContent="search";
        search.classList.remove("fas","fa-search");
        searchBtn.appendChild(search);
    }
);
searchBtn.addEventListener("mouseout", () => {
        const search=document.createElement("i");
    searchBtn.classList.remove("expand");
        searchBtn.textContent="";
        search.classList.add("fas","fa-search");
        searchBtn.appendChild(search);
    }
);
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    window.scrollTo({
        top: 0,
        behavior: "smooth" // adds a smooth scrolling effect
    });
});






//todo: this will trigger error if results were not found
// if(data.results.length===0){
//     resultHeading.textContent="";
//     errorContainer.textContent="No results found";
//     errorContainer.classList.remove("hidden");
// }
// else if(data.results.length===1){
//     errorContainer.classList.add("hidden");
//     resultHeading.textContent="1 result found";
// }
// else{
//     errorContainer.classList.add("hidden");
//     resultHeading.textContent=`${data.results.length} results found`;
// }







//todo: this is a domo api call to generate random outcomes
// async function getRandomRecipes() {
//     const url = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=3`;
//     try {
//         const res = await fetch(url);
//         const data = await res.json();
//         console.log("Random Recipes:");
//         data.recipes.forEach(recipe => {
//             console.log(`- ${recipe.title}`);
//         });
//     } catch (err) {
//         console.error("Error fetching random recipes:", err);
//     }
// }
// getRandomRecipes();
