
const API = 'https://www.themealdb.com/api/json/v1/1/';
const searchByName = 'search.php?s=';
const searchByFirstLetter = 'search.php?f=';
const listCategories = 'categories.php';
const listAreas = 'list.php?a';
const listIngredients = 'list.php?i';
const filterByCategory = 'filter.php?c=';
const filterByArea = 'filter.php?a=';
const filterByIngredient = 'filter.php?i=';
const searchById = 'lookup.php?i=';

const sidebarBtn = document.querySelector('.sidebar__btn');
const sidebar = document.querySelector('aside');
const sidebarListItems = document.querySelectorAll('.sidebar__list__item');
const pages = document.getElementById('pages');
const loader = document.querySelector('.loader__outer');
const mealDetailsModal = document.querySelector('.meal__details');
const closeBtn = document.querySelector('.meal__details__close');

const mealsContainer = document.createElement('div')
mealsContainer.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 py-3';


// Close modal
closeBtn.addEventListener('click', closeModal);

window.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

sidebarBtn.addEventListener('click', toggleSidebar);

sidebarListItems.forEach(item => {
    item.addEventListener('click', function () {

        pages.innerHTML = '';
        mealsContainer.innerHTML = ''
        toggleSidebar();
        closeModal();

        switch (this.dataset.page) {
            case 'search':
                pages.setAttribute('data-pages', 'search');
                Search();
                break;
            case 'categories':
                pages.setAttribute('data-pages', 'categories');
                ListData(listCategories, 'categories', Categories);
                break;
            case 'area':
                pages.setAttribute('data-pages', 'areas');
                ListData(listAreas, 'meals', Areas);
                break;
            case 'ingredients':
                pages.setAttribute('data-pages', 'ingredients');
                ListData(listIngredients, 'meals', Ingredients);
                break;
            case 'contact-us':
                pages.setAttribute('data-pages', 'contact-us');
                ContactUs();
                break;
        }
    });
});

(async function () {
    const { meals } = await fetchData(searchByName);

    displayMeals(meals);
})()

function debounce(callback, delay) {
    let timer = null;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback();
        }, delay);
    };
}

async function fetchData(endpoint, params = '') {
    loader.classList.remove('loader--hide');

    const res = await fetch(`${API}${endpoint}${params}`);
    const data = await res.json();

    return data;
}

function closeModal() {
    mealDetailsModal.classList.remove('meal__details--show');
    pages.classList.remove('d-none');
}

function toggleSidebar() {
    sidebar.classList.toggle('sidebar__btn--close');
    sidebar.classList.toggle('sidebar--open');
    sidebarListItems.forEach(item => {
        item.classList.toggle('sidebar__list__item--fade-up');
    });
}

function displayMeals(meals) {

    mealsContainer.innerHTML = ''

    meals.forEach(({ idMeal, strMeal, strMealThumb }) => {
        let meal = document.createElement('div');
        meal.className = 'meal';
        meal.setAttribute('data-mealid', idMeal);
        meal.addEventListener('click', function () {
            mealDetails(idMeal);
        });

        let image = document.createElement('img');
        image.className = 'rounded';
        image.setAttribute('src', strMealThumb);
        image.setAttribute('alt', strMeal);
        image.setAttribute('loading', 'lazy');

        let layer = document.createElement('div');
        layer.className = 'meal__inner rounded';

        let title = document.createElement('h3');
        title.textContent = strMeal;

        layer.append(title);

        meal.append(image, layer);

        mealsContainer.append(meal);

    });

    pages.append(mealsContainer)

    loader.classList.add('loader--hide');
}

async function mealDetails(id) {
    mealDetailsModal.classList.add('meal__details--show');
    pages.classList.add('d-none');

    const { meals } = await fetchData(`${searchById}${id}`);
    const meal = meals[0];
    const { strMeal, strArea, strCategory, strInstructions, strMealThumb, strTags } = meal;


    const mealImage = document.querySelector('.meal__details__image');
    const mealTags = document.querySelector('.meal__details__tags');
    const mealTitle = document.querySelector('.meal__details__title');
    const mealArea = document.querySelector('.meal__details__area');
    const mealCategory = document.querySelector('.meal__details__category');
    const mealInstructions = document.querySelector('.meal__details__instructions');
    const mealIngredients = document.querySelector('.meal__details__ingredients');
    const mealSource = document.querySelector('.meal__details__source');
    const mealYoutube = document.querySelector('.meal__details__youtube');


    mealImage.setAttribute('src', strMealThumb);
    mealImage.setAttribute('alt', strMeal);

    mealTitle.textContent = strMeal;
    mealArea.textContent = strArea;
    mealCategory.textContent = strCategory;
    mealInstructions.textContent = strInstructions;

    // Hide Tags if No Tags
    mealTags.innerHTML = '';

    if (!strTags) {
        mealTags.parentElement.classList.add('d-none');
    } else {
        mealTags.parentElement.classList.remove('d-none');
        strTags.split`,`.map(tag => {
            let mealTag = document.createElement('li');
            mealTag.className = 'badge rounded-pill bg-warning text-dark';
            mealTag.textContent = tag;
            mealTags.append(mealTag);
        });
    }

    let ingredients = [];
    mealIngredients.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        let recipe = `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`;
        if (recipe.trim()) {
            ingredients.push(recipe);
        }
    }
    ingredients.forEach(ingredient => {
        let li = document.createElement('li');
        li.textContent = ingredient;
        mealIngredients.append(li);
    });

    mealSource.setAttribute('href', meal.strSource);
    mealYoutube.setAttribute('href', meal.strYoutube);

    loader.classList.add('loader--hide');
}

function Search() {
    let name = document.createElement('input');
    let nameCol = document.createElement('div');

    nameCol.className = 'col-md-6';
    name.className = 'form-control';
    name.setAttribute('placeholder', 'Search...');
    name.setAttribute('type', 'text');
    nameCol.append(name);

    let firstLetter = document.createElement('input');
    let firstLetterCol = document.createElement('div');
    firstLetterCol.className = 'col-md-6';
    firstLetter.className = 'form-control';
    firstLetter.setAttribute('placeholder', 'First Letter...');
    firstLetter.setAttribute('maxlength', '1');
    firstLetter.setAttribute('type', 'text');
    firstLetterCol.append(firstLetter);

    let errorMessage = document.createElement('p')
    let errorMessageCol = document.createElement('div')
    errorMessage.className = 'text-danger text-center';
    errorMessageCol.className = 'col-12';
    errorMessageCol.append(errorMessage);

    let filters = document.createElement('div');
    filters.className = 'row mb-3 g-2';
    filters.append(errorMessageCol, nameCol, firstLetterCol);
    async function handleInput(endpoint, input) {
        if (input.value.trim()) {
            errorMessage.textContent = '';
            try {
                const { meals } = await fetchData(endpoint, input.value);
                displayMeals(meals);
            } catch {
                loader.classList.add('loader--hide');
                errorMessage.textContent = "Can't find meals!";
                input.value = ''
            }
        }
    }

    name.addEventListener('keyup', debounce(() => {
        firstLetter.value = ''
        handleInput(searchByName, name);
    }, 500));

    let lastLetter = null
    firstLetter.addEventListener('keyup', function () {
        name.value = ''
        if (lastLetter !== this.value) {
            handleInput(searchByFirstLetter, this);
            lastLetter = this.value
        }
    });

    pages.append(filters);
    name.focus()
    loader.classList.add('loader--hide');
}

function Categories() {
    return ({ strCategory, strCategoryThumb, strCategoryDescription }) => {

        let col = document.createElement('div');
        col.addEventListener('click', async function () {

            const { meals } = await fetchData(filterByCategory, strCategory);
            displayMeals(meals);
        });
        let card = document.createElement('div');
        card.className = 'position-relative overflow-hidden category__card rounded';

        let img = document.createElement('img');
        img.className = 'rounded';
        img.setAttribute('src', strCategoryThumb);
        img.setAttribute('alt', strCategory);

        let cardBody = document.createElement('div');
        cardBody.className = 'position-absolute rounded category__card__body';

        let title = document.createElement('h5');
        title.className = 'category__card__body__title';
        title.textContent = strCategory;

        let p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = `${strCategoryDescription.slice(0, 50)}...`;

        cardBody.append(title, p);
        card.append(img, cardBody);

        col.append(card);

        mealsContainer.append(col);
    };
}

function Areas() {
    return ({ strArea }) => {

        let col = document.createElement('div');
        col.addEventListener('click', async function () {
            const { meals } = await fetchData(filterByArea, strArea);
            displayMeals(meals);
        });

        let card = document.createElement('div');
        card.className = 'area__card meal__card';
        let icon = document.createElement('i');
        icon.className = 'fa-solid fa-map-location-dot';

        let cardBody = document.createElement('div');

        let title = document.createElement('h5');
        title.textContent = strArea;

        card.append(icon);
        cardBody.append(title);
        card.append(cardBody);

        col.append(card);

        mealsContainer.append(col);
    }
}

function Ingredients() {
    return ({ strIngredient, strDescription }) => {

        let col = document.createElement('div');
        col.addEventListener('click', async function () {
            const { meals } = await fetchData(filterByIngredient, strIngredient);
            displayMeals(meals);
        });

        let card = document.createElement('div');
        card.className = 'ingredient__card h-100 p-3 rounded d-flex flex-column align-items-center justify-content-center';
        let icon = document.createElement('i');
        icon.className = 'fa-solid fa-bowl-food fa-2x';

        let cardBody = document.createElement('div');

        let title = document.createElement('h5');
        title.textContent = strIngredient;

        let description = document.createElement('p');

        description.textContent = strDescription ? `${strDescription.slice(0, 50)}...` : '';

        card.append(icon);
        cardBody.append(title, description);
        card.append(cardBody);

        col.append(card);

        mealsContainer.append(col);
    };
}

async function ListData(endpoint, type, callback) {
    const data = await fetchData(endpoint);

    data[type].slice(0, 20).forEach(callback());

    pages.append(mealsContainer);

    loader.classList.add('loader--hide');
}

function ContactUs() {
    const NameRegex = /^[\w ]{4,20}$/;
    const EmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const PhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const MessageRegex = /[\s\S]{4,200}/m;
    const SubjectRegex = /^[\w -]{4,50}$/;

    const isUserNameValid = userName => NameRegex.test(userName);
    const isEmailValid = email => EmailRegex.test(email);
    const isPhoneValid = phone => PhoneRegex.test(phone);
    const isMessageValid = message => MessageRegex.test(message);
    const isSubjectValid = subject => SubjectRegex.test(subject);

    const validation = (userName, email, phone, subject, message) => (
        isUserNameValid(userName) &&
        isEmailValid(email) &&
        isPhoneValid(phone) &&
        isMessageValid(message) &&
        isSubjectValid(subject)
    );

    let userName = document.createElement('input');
    let nameCol = document.createElement('div');
    let nameErrorMessage = document.createElement('p');

    // Attributes
    userName.className = 'form-control';
    nameCol.className = 'col-md-6';
    nameErrorMessage.className = "mb-0 text-danger small mt-2 error-message";
    userName.setAttribute('placeholder', 'Your Name');
    userName.setAttribute('type', 'text');
    userName.setAttribute('name', 'userName');

    // Events
    userName.addEventListener('input', handleInput);

    nameCol.append(userName, nameErrorMessage);

    let email = document.createElement('input');
    let emailCol = document.createElement('div');
    let emailErrorMessage = document.createElement('p');

    // Atributes
    email.className = 'form-control';
    emailCol.className = 'col-md-6';
    emailErrorMessage.className = "mb-0 text-danger small mt-2 error-message";
    email.setAttribute('placeholder', 'Your Email');
    email.setAttribute('type', 'email');
    email.setAttribute('name', 'email');

    // Event 
    email.addEventListener('input', handleInput);

    emailCol.append(email, emailErrorMessage);

    let subject = document.createElement('input');
    let subjectCol = document.createElement('div');
    let subjectErrorMessage = document.createElement('p');

    // Attributes
    subjectCol.className = 'col-md-6';
    subject.className = 'form-control';
    subject.setAttribute('placeholder', 'Subject');
    subject.setAttribute('type', 'text');
    subject.setAttribute('name', 'subject');
    subjectErrorMessage.className = "mb-0 text-danger small mt-2 error-message";

    // Event
    subject.addEventListener('input', handleInput);

    subjectCol.append(subject, subjectErrorMessage);

    let phone = document.createElement('input');
    let phoneCol = document.createElement('div');
    let phoneErrorMessage = document.createElement('p');

    // Attributes
    phoneCol.className = 'col-md-6';
    phone.className = 'form-control';
    phoneErrorMessage.className = "mb-0 text-danger small mt-2 error-message";
    phone.setAttribute('name', 'phone');
    phone.setAttribute('placeholder', 'Phone');
    phone.setAttribute('type', 'text');

    // Event
    phone.addEventListener('input', handleInput);

    phoneCol.append(phone, phoneErrorMessage);

    let message = document.createElement('textarea');
    let messageCol = document.createElement('div');
    let messageErrorMessage = document.createElement('p');

    // Attribute
    message.className = 'form-control';
    message.setAttribute('placeholder', 'Message');
    message.setAttribute('rows', '5');
    message.setAttribute('name', 'message');
    messageCol.className = 'col';
    messageErrorMessage.className = "mb-0 text-danger small mt-2 error-message";

    // Event
    message.addEventListener('input', handleInput);

    messageCol.append(message, messageErrorMessage);

    let row = document.createElement('div');
    row.className = 'row g-3';
    row.append(nameCol, emailCol, subjectCol, phoneCol, messageCol);

    let submit = document.createElement('button');
    submit.className = 'btn btn-outline-light mt-3 mx-auto d-block px-4 py-2 fw-bold';
    submit.textContent = 'Send Message';
    submit.setAttribute('id', 'toast');
    submit.setAttribute('disabled', true);

    let toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container  position-fixed bottom-0 p-3';

    let toast = document.createElement('div');
    toast.className = 'toast show text-bg-light';
    toast.setAttribute('id', 'toast');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    let wrapper = document.createElement('div');
    wrapper.className = 'd-flex';

    let toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = 'Message Sent Successfully';

    let dismiss = document.createElement('button');
    dismiss.className = 'btn-close btn-close-dark shadow-none me-2 m-auto';
    dismiss.setAttribute('data-bs-dismiss', 'toast');
    dismiss.setAttribute('aria-label', 'Close');

    wrapper.append(toastBody, dismiss);
    toast.append(wrapper);
    toastContainer.append(toast);

    let form = document.createElement('form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        toastContainer.classList.add('show')
        setTimeout(() => {
            toastContainer.classList.remove('show')
        }, 2500)
        clearInputs();
    });

    form.append(row, submit);
    pages.append(form, toastContainer);

    loader.classList.add('loader--hide');

    function handleInput(e) {
        const { name } = e.target;

        getElement(name, e);

        submit.disabled = !validation(userName.value, email.value, phone.value, subject.value, message.value);
    }

    function getElement(name, e) {
        return {
            userName(e) {
                e.target.classList.toggle('border-danger', !isUserNameValid(e.target.value));
                e.target.classList.toggle('border-3', !isUserNameValid(e.target.value));
                e.target.nextSibling.textContent = isUserNameValid(e.target.value) ? null : 'Name must be at least 4 to 20 characters';
            },
            email(e) {
                e.target.classList.toggle('border-danger', !isEmailValid(e.target.value));
                e.target.classList.toggle('border-3', !isEmailValid(e.target.value));
                e.target.nextSibling.textContent = !isEmailValid(e.target.value) ? 'Enter a valid email' : null;
            },
            phone(e) {
                e.target.classList.toggle('border-danger', !isPhoneValid(e.target.value));
                e.target.classList.toggle('border-3', !isPhoneValid(e.target.value));
                e.target.nextSibling.textContent = !isPhoneValid(e.target.value) ? 'Enter a valid phone number' : null;
            },
            subject(e) {
                e.target.classList.toggle('border-danger', !isSubjectValid(e.target.value));
                e.target.classList.toggle('border-3', !isSubjectValid(e.target.value));
                e.target.nextSibling.textContent = !isSubjectValid(e.target.value) ? 'Subject must be at least 4 to 50 characters' : null;
            },
            message(e) {
                e.target.classList.toggle('border-danger', !isMessageValid(e.target.value));
                e.target.classList.toggle('border-3', !isMessageValid(e.target.value));
                e.target.nextSibling.textContent = !isMessageValid(e.target.value) ? 'Message must be at least 4 to 100 characters' : null;
            }

        }[name](e);
    }

    function clearInputs() {
        userName.value = '';
        email.value = '';
        phone.value = '';
        subject.value = '';
        message.value = '';
        submit.disabled = true;
    }
}