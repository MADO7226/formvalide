let professeurs = [];

const form = document.getElementById("createForm");
const nomElem = document.getElementById("nom");
const prenomElem = document.getElementById("prenom");
const gradeElem = document.getElementById("grade");

const checkboxMatieres = document.querySelectorAll("input[type=checkbox]");
const checkboxError = document.getElementById("checkboxError");

for (const checkbox of checkboxMatieres) {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            checkbox.classList.remove('is-invalid');
            checkbox.classList.add('is-valid');
        } else {
            checkbox.classList.remove('is-valid');
            checkbox.classList.add('is-invalid');
        }
    });
}

const formFields = [nomElem, prenomElem, gradeElem];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let formValid = true;

    for (const field of formFields) {
        if (isEmpty(field)) {
            showErrorMessage(field);
            formValid = false;
        } else {
            showSuccessMessage(field);
        }
    }

    const elementsChoisis = document.querySelectorAll(".form-check-input:checked");
    if (elementsChoisis.length == 0) {
        checkboxError.textContent = "Veuillez cocher au moins un module";
        checkboxError.classList.add('invalid-feedback');
        formValid = false;
    } else {
        checkboxError.textContent = "";
        checkboxError.classList.remove('invalid-feedback');
    }

    if (formValid) {
        const newProf = {
            id: professeurs.length + 1,
            nom: nomElem.value,
            prenom: prenomElem.value,
            grade: gradeElem.value,
            module: Array.from(elementsChoisis).map(element => element.value)
        };
        saveDataProf(newProf);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    activateFocus();
    genererDataProfesseur();
});

const inputs = document.getElementsByClassName('form-control');

function activateFocus() {
    for (const input of inputs) {
        input.addEventListener('focus', () => {
            deleteClass(input, 'is-invalid', 'invalid-feedback');
            deleteClass(input, 'is-valid', 'valid-feedback');
        });
    }
}

// Les fonctions de validation

function isEmpty(champ) {
    return champ.value == '';
}

// Fonction d'affichage des messages de succès ou d'erreur sur les champs

function showErrorMessage(champ) {
    const champError = document.getElementById(`${champ.id}Error`);
    champ.classList.add('is-invalid');
    champError.classList.add('invalid-feedback');
    champError.textContent = "Ce champ est obligatoire";
}

function showSuccessMessage(champ) {
    const champError = document.getElementById(`${champ.id}Error`);
    champ.classList.remove('is-invalid');
    champError.classList.remove('invalid-feedback');

    champ.classList.add('is-valid');
    champError.classList.add('valid-feedback');
    champError.textContent = '';
}

function deleteClass(champ, classInput, classError) {
    const champError = document.getElementById(`${champ.id}Error`);
    if (champ.classList.contains(classInput)) {
        champ.classList.remove(classInput);
        champError.classList.remove(classError);
        champError.textContent = '';
    }
}

const tbody = document.getElementById("tbodyProfs");

document.getElementById("btnOpenForm").addEventListener("click", openForm);
document.getElementById("closeForm").addEventListener("click", closeForm);

// Fonction d'accès aux données
function genererDataProfesseur() {
    tbody.innerHTML = "";
    professeurs.forEach((professeur) => {
        const badges = professeur.module.map(module => `<span class="badge text-bg-primary mr-1">${module}</span>`).join(", ");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${professeur.nom}</td>
            <td>${professeur.prenom}</td>
            <td>${professeur.grade}</td>
            <td>${badges}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="modifierProf(${professeur.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="supprimerProf(${professeur.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadData() {
    professeurs = localStorage.getItem("professeurs") != null ? JSON.parse(localStorage.getItem("professeurs")) : [];
}

function saveDataProf(newProf) {
    professeurs.push(newProf);
    genererDataProfesseur();
    closeForm();

    localStorage.setItem("professeurs", JSON.stringify(professeurs));
}

function openForm() {
    form.style.display = "block";
}

function closeForm() {
    form.style.display = "none";
}

function modifierProf(id) {
    const prof = professeurs.find(p => p.id === id);
    if (prof) {
        nomElem.value = prof.nom;
        prenomElem.value = prof.prenom;
        gradeElem.value = prof.grade;

        // Ajouter la vérification pour les checkboxes
        const moduleElems = document.querySelectorAll("input[type=checkbox]");
        moduleElems.forEach((checkbox) => {
            checkbox.checked = prof.module.includes(checkbox.value);
        });

        form.style.display = "block";

        // Supprimer le professeur existant de la liste
        professeurs = professeurs.filter(p => p.id !== id);
        genererDataProfesseur();
    }
}

function supprimerProf(id) {
    professeurs = professeurs.filter(p => p.id !== id);
    genererDataProfesseur();

    localStorage.setItem("professeurs", JSON.stringify(professeurs));
}
