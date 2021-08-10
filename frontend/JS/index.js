//declaration de la variable et selection
let madiv = document.querySelector('.main');

//fonction fetch qui va aller chercher les infos
function getData() {
    fetch('http://localhost:3000/api/teddies')
        .then((res) => res.json())
        .then((data) => {
            
            //lancement de la boucle
            for (let i = 0; i < data.length; i++) {

            let name = data[i].name;
            let imageUrl = data[i].imageUrl;
            let description = data[i].description;
            let price = data[i].price / 100;
            let id = data[i]._id;

            let div =
                `<div class="col">
                    <div class="card">                    
                        <img src="${imageUrl}" class="card-img-top"  alt="..." width="100" height="200">
                            <div class="card-body">
                                <h5 class="card-title"> ${name} </h5>
                                <p class="card-description"> ${description}</p>
                                <p class="card-text"> ${price}€</p>
                                <a href="produit.html?id=${id}" class="btn btn-primary"> Voir l'article </a>
                            </div>                           
                    </div>
                </div>` 
                    madiv.innerHTML += div;  
            }
        })
        .catch(erreur => {erreur});
}
getData();






