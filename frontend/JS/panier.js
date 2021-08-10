// déclaration des variables globales
let panier;
let mainHTML = document.querySelector('main');

// Vérification de l'existance du panier
if ("monPanier" in localStorage) {
    panier = JSON.parse(localStorage.getItem('monPanier'));
    createTemplate();
} else {
    document.querySelector('#panier-vide').style.display = "block";
}

// La fonction permettant d'afficher tous les articles présents dans le panier
function createTemplate() {
    let template = document.createElement('div');
    template.className = "template";
    
    // Parcours de l'array
    for (let i = 0; i < panier.length; i++) {
        let img = panier[i].img;
        let name = panier[i].name;
        let price = panier[i].price;
        let quantity = panier[i].quantity;
        let colors = panier[i].colors;
        
        // destructuration

        // Création du template avec les valeurs correspondantes
        let article =
            `<article>
                <div>
                    <h3>${name}</h3>
                    <img class="article__img" src=${img} alt=${name}>
                </div>
                <div>
                    <p>Couleurs : <span>${colors}</span></p>
                    <p>Quantité : <span class="articleQuantity">${quantity}</p>
                    <p>Prix : <span class="articlePrice">${price * quantity}</span>€</p>
                </div>
                <div>
                    <button class="btn">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            </article>`;

        template.innerHTML += article;
    }
    // Insertion au HTML + appel fonction prix total
    mainHTML.appendChild(template);
    totalPrice();
}

// Calcul du prix total en parcourant les valeurs HTML
function totalPrice() {
    let priceDiv = document.createElement('div');
    priceDiv.className = "priceDiv";
    let priceArray = document.querySelectorAll('.articlePrice');
    let sum = 0;
    priceArray.forEach(i => {
       i = Number(i.textContent);
       sum += i;
    });
    priceDiv.innerHTML = `Le prix total du panier est : 
        <span class="totalPrice">${sum}</span>€`;
    mainHTML.appendChild(priceDiv);
}

// Enlever un article du panier
let deleteBtns = document.querySelectorAll('.btn');
for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', () => {
            panier.splice(i, 1);
            localStorage.setItem('monPanier', JSON.stringify(panier));
        
            // Si le panier est vide on clear le localStorage
            if (panier.length < 1) {
                localStorage.removeItem('monPanier');
            }

            // Rafraîchissement de la page
            window.location.reload();
        })
}

// Event type submit
document.querySelector('#boutton-commande').addEventListener('click', (e) => {
    // On bloque le comportement par défaut du navigateur
    e.preventDefault();

    // Je crée mon objet data qui prend les data du formulaire + un tableau products
    let data = {
        contact : {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value
        },
        products : []
    }

    for (produits of panier) {

        data.products.push(produits.id)
    }
    console.log(data)

    // Si le panier est vide on stop la commande
    if (!panier) {
           alert("la commande ne peut pas être passée car le panier est vide");
            return
    }

    // Vérification sur le prénom
    if(!/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/.test(data.contact.firstName)) {
        alert("Attention à bien remplir correctement votre prénom");
        return
    }

    // Vérification sur le Nom
    if(!/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/.test(data.contact.lastName)) {
        alert("Attention à bien remplir correctement votre nom");
        return
    }

    // Vérification sur l'adresse (Ville) avec entre 5 et 20 lettres
    if(!/^[ a-zA-Zéèê\-]{5,20}/.test(data.contact.city)) {
        alert("Attention à bien remplir correctement le champ ville (entre 5 et 20 lettres)");
        return
    }

    // On fait rentrer dans data.products les id des articles autant de fois que la quantity est demandée
    panier.forEach(elt => {
        for (let i = 0; i < elt.quantity; i++) {
            data.products.push(elt.id);    
        }
    })

    // Envoi fetch via la méthode POST de 'data'
    fetch('http://localhost:3000/api/teddies/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    // Retour de l'envoi au server
    .then(response => response.json())
    .then(data => {
        // On va mettre dans le localStorage 'data'
        localStorage.setItem('confirmation', JSON.stringify(data));
        // Effaçons le panier vu que la commande est passée
        localStorage.removeItem('monPanier');
        // Ouverture de la page de confirmation
        location.replace("confirmation.html")
    })
    // Au cas où il y aurait une erreur
    .catch((error) => {
        console.error(error);
    }); 
})