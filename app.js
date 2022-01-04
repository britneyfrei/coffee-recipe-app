// Query Selectors
const recipeForm = document.getElementById('recipe-form');
const recipeContainer = document.getElementById('recipe-container');
let listItems = [];

// Functions
function handleFormSubmit(e) {
    e.preventDefault();
    const name = DOMPurify.sanitize(document.getElementById('name').value);
    const method = DOMPurify.sanitize(document.getElementById('method').value);
    const roast = DOMPurify.sanitize(document.getElementById('roast').value);
    const grind = DOMPurify.sanitize(document.getElementById('grind').value);
    const ratio = DOMPurify.sanitize(document.getElementById('ratio').value);
    const note = DOMPurify.sanitize( document.getElementById('note').value);
    const newRecipe = {
        // name = name,
        name,
        method,
        roast,
        grind,
        ratio,
        note,
        id: Date.now(),
    }
    listItems.push(newRecipe);
    // e.target = recipeForm
    e.target.reset();
    recipeContainer.dispatchEvent(new CustomEvent('refreshRecipes'));
}
function displayRecipes() {
    // b - sets bottom
    const tempString = listItems.map(item => `
    <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm border-primary">
            <div class="card-header py-3 text-white bg-primary border-primary">
                <h4 class="my-0">${item.name}</h4>
            </div>
            <div class="card-body">
                <ul class="text-start">
                    <li><strong>Method: </strong>${item.method}</li>
                    <li><strong>Roast: </strong>${item.roast}</li>
                    <li><strong>Grind: </strong>${item.grind}</li>
                    <li><strong>Ratio: </strong>${item.ratio}</li>
                    ${!item.note.length ? "" : `<li><strong>Note: </strong>${item.note}</li>`}
                </ul>
                <button class="btn btn-lg btn-outline-danger" aria-label="Delete ${item.name}" value="${item.id}">Delete Recipe</button>
            </div>
        </div>
    </div>
    `).join('');
    recipeContainer.innerHTML = tempString;
}
function mirrorStateToLocalStorage() {
    localStorage.setItem('recipeContainer.list', JSON.stringify(listItems)); 
}
function loadInitialUI() {
    const tempLocalStorage = localStorage.getItem('recipeContainer.list');
    if (tempLocalStorage === null || tempLocalStorage === []) return;
    const tempRecipes = JSON.parse(tempLocalStorage);
    listItems.push(...tempRecipes);
    recipeContainer.dispatchEvent(new CustomEvent('refreshRecipes'));
}
function deleteRecipeFromList(id) {
    // list = all items where the id doesn't equal the passed id
    listItems = listItems.filter(item => item.id !== id);
    recipeContainer.dispatchEvent(new CustomEvent('refreshRecipes'));

}
// Event Listeners
recipeForm.addEventListener('submit', handleFormSubmit);
recipeContainer.addEventListener('refreshRecipes', displayRecipes);
window.addEventListener('DOMContentLoaded', loadInitialUI);
recipeContainer.addEventListener('click', (e) => {
    if (e.target.matches('.btn-outline-danger')) {
        deleteRecipeFromList(Number(e.target.value));
    };
})