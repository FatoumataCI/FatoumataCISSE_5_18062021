// On va chercher dans le localStorage les données
let data = JSON.parse(localStorage.getItem('confirmation'));

// On va calculer le prix total du panier
let totalPrice = 0;

// Là on pourrait faire un forEach aussi (au cas où)
data.products.forEach(elt => {
    totalPrice += elt.price;
});

// Display sur le html du numéro de commande et du prix total des articles (prix divisé par 100)
document.getElementById('orderId').innerHTML = data.orderId;
document.getElementById('totalPrice').innerHTML = totalPrice/100;

// Affichage des données reçues en console
console.log(data);