//declaration des variables

// recuperation de la valeur qui est dans l'url
const parsedUrl = new URL(window.location.href);

//ensuite recuperation de l'id sur l'url
const id = parsedUrl.searchParams.get("id");

//recuperation de l'id du formulaire
const form = document.getElementById('myForm');

//recuperation de l'id du bouton d'ajout au panier
const submitBtn = document.getElementById('submitBtn');

//recuperation du prix 
const unitPrice = document.querySelector('.produit__price');

//recuperation du prix total
const displayPrice = document.querySelector('.produit__total');


//fonction get data qui recuepre et affiche l'article
function getData(id){
    fetch('http://localhost:3000/api/teddies/' + id)
    // on va chercher grace à l'id notre article
    .then((res) => res.json()) 
    .then((data) => {
        
        //declaration des variables depuis l'objet qui contient toutes les informations necessaires
        let name = data.name;
        let imageUrl = data.imageUrl;
        let description = data.description;
        let price = data.price / 100;
        let colors = data.colors;    

        //mettre nos donnees au HTML dynamiquement
        document.querySelector('.produit__name').innerHTML = name;
        document.querySelector('.produit__img').src = imageUrl;
        document.querySelector('.produit__description').innerHTML = description;
        document.querySelector('.produit__price').innerHTML = price;
        for (mychoice in colors){
            document.querySelector('.produit__choice').innerHTML
            += `<option value="${colors[mychoice]}">${colors[mychoice]}</option>`;
        }
    })
}

//appel la fonction avec l'id de l'url en parametre
getData(id);   

//j'indique dynamiquement le prix total de la commande prix à l'unité et quantité
function totalPrice(quantity){
    let result = quantity * unitPrice.innerHTML;
    displayPrice.innerHTML = result;
}

//declaration de la variable panier
let panier;
if("monPanier" in localStorage){
    panier = JSON.parse(localStorage.getItem('monPanier'));
} else{
    panier = [];
}

function addPanier() {
    //on bloque l'action du navigateur par default
   // e.preventDefault();
  

    //creation de notre objet
    let commande = {
        id: id,
        name : document.querySelector('.produit__name').textContent,
        img : document.querySelector('.produit__img').src,
        quantity : Number(document.querySelector('#inputNumber').value),
        price : Number(document.querySelector('.produit__price').textContent),
        colors : document.querySelector('.produit__choice').value
    }

    //verification que la commande possede au moins un article
    //if(!commande.quantity > 0 ){
       // alert("Vous devez selectionné au moins un article pour passer votre commande")
        //return;
    //}

    //verification sur les repetitions
    for (let i = 0; i < panier.length; i++) {
        if (commande.colors == panier [i].colors && commande.id == panier [i].id){
            commande.quantity += Number(panier[i].quantity);
            panier.splice(i,1);
        }
    }

    //on rentre ça dans le panier + reset des valeurs
    panier.push(commande);
    //form.reset();
    //displayPrice.innerHTML = 0;

    //on place le panier dans le local storage
    localStorage.setItem('monPanier', JSON.stringify(panier));
}

//l'eventListener declencheur
submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addPanier();
    window.location.href= 'panier.html'
});
