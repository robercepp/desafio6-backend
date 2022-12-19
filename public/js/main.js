const socket = io.connect()

const input = document.getElementById('inputSocket')
const main = document.getElementById('parrafo')
const boton = document.getElementById('btn')
const celdasProductos = document.getElementById('products-container')

// Escucho los mensajes enviados por el servidor
socket.on('mensaje', messages => {
    const mensajesHTML = messages
        .map(msj => `
        <span class="email">${msj.email}</span> 
        <span class="hora">[${msj.diaYHora}]</span> 
        <span class="texto">${msj.text}</span> 
          `)
        .join('<br>')
    main.innerHTML = mensajesHTML
})
socket.on('producto', productos => {
        const productosHTML = productos
        .map(pro => `
        <tr class="tr2">
        <td class="td1">${pro.title}</td>
        <td class="td2">${pro.price}</td>
        <td class="td3"><img src="${pro.thumbnail}"></td>
        </tr>`)
        .join('')
    celdasProductos.innerHTML = productosHTML
})

//Envio de los mensajes al servidor
function addMessage (e) {
    const email = document.getElementById('email').value;
    const text = document.getElementById('texto').value;
    if(email == ""){
        return(alert('Debe ingresar un Email para enviar un mensaje'));
    } else {
        const ahora = new Date();
        const reloj =
        ahora.getDate() + "/" +
        ("0" + (ahora.getMonth()+1)).slice(-2) + "/" +
        ("0" + ahora.getFullYear()).slice(-2) + " " +
        ("0" + ahora.getHours()).slice(-2) + ":" +
        ("0" + ahora.getMinutes()).slice(-2) + ":" +
        ("0" + ahora.getSeconds()).slice(-2);
        const mensaje= {
            email: email,
            diaYHora: reloj,
            text: text
        };
        socket.emit('new-message', mensaje);
        return(false);
    }
}

function addProducto (e) {
    const producto= {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('new-producto', producto);
    return(false);
}

