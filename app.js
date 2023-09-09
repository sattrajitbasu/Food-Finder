const searchBtn = document.querySelector('#search-btn')
const mealList = document.querySelector('#meal')
const mealDetailsContent = document.querySelector('.meal-details-content')
const recipeCloseBtn = document.querySelector('#recipe-close-btn')

// event listener
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', ()=>{
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})



// get meal list that matches with the ingredients
async function getMealList(){
    let searchInputTxt = document.querySelector('#search-input').value.trim();
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    let html ="";
    if(res.data.meals){
        res.data.meals.forEach((meal) => {
            html += `
            <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="" />
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
            </div>`;
        });
        mealList.classList.remove("notFound");
    }else{
        html += "Sorry, we didn't find any meal!";
        mealList.classList.add('notFound');
    }
    mealList.innerHTML = html;
    document.querySelector('#search-input').value = "";
 }




//  get recipe of the meal
async function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)   
        await mealRecipeModel(res.data.meals);
    }
}

// create recipe model
function mealRecipeModel(meal){
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
        mealDetailsContent.innerHTML = html;
        mealDetailsContent.parentElement.classList.add('showRecipe');
}