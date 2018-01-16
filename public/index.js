const socket_order = io('/order');

const clientBtn = element('client');
const adminBtn = element('admin');
const nameInput = element('nameInput');
const nameBtn = element('nameBtn');
const clientCanvas = element('clientCanvas');
const adminCanvas = element('adminCanvas');
const orderBtn = element('order');
const orders = element('orders');
const orderSelect = element('selector');
const orderList = element('orderList');
const clientOrders = element('clientOrders');

//Register a client account
const clientClick = Rx.Observable.fromEvent(clientBtn, 'click');
clientClick.map(e => e.target.parentNode.parentNode).subscribe(parentCanvas => {
    parentCanvas.style.transform = 'translateX(-100%)';
    adminCanvas.style.display = 'none';
    socket_order.emit('clientRegister');
});

//Register a admin account
const adminClick = Rx.Observable.fromEvent(adminBtn, 'click');
adminClick.map(e => e.target.parentNode.parentNode).subscribe(parentCanvas => {
    parentCanvas.style.transform = 'translateX(+100%)';
    clientCanvas.style.display = 'none';
    socket_order.emit('adminRegister');
});

//Add customer name to associate socket(client/admin)
const nameClick = Rx.Observable.fromEvent(nameBtn, 'click');
nameClick.map(e => e.target.parentNode).subscribe(parentCanvas => {
    const userName = nameInput.value;
    nameInput.value = '';
    socket_order.emit('addName', userName);
    parentCanvas.style.transform = 'translateY(+100%)';
});

//Put order from Client side and sent it back to server
const orderClick = Rx.Observable.fromEvent(orderBtn, 'click');
orderClick.do(e => e.preventDefault()).subscribe(() => {
    const orderId = uuidv4();
    const orderItem = orders.value;
    orders.value = '';
    const orderSelects = orderSelect.value;
    socket_order.emit('orderSend', {
        orderItem: orderSelects,
        orderId,
    });
});

//Order confirm by server
socket_order.on('orderConfirm', ({ orderItem, orderId }) => {
    const node = document.createElement('li');
    node.setAttribute('data-key', orderId);
    const textNode = document.createTextNode(
        `${orderItem}\n, Ordernumber: ${orderId}`
    );
    node.appendChild(textNode);
    orderList.appendChild(node);
});

//Retrive order from server and list in the Admin order table
socket_order.on(
    'order',
    ({ orderItem, orderId, clientId, type, clientName }) => {
        const node = document.createElement('li');
        const btn = document.createElement('button');
        const textNode = document.createTextNode(
            `orders: ${orderItem}, Client Name: ${clientName}, Order Number: ${orderId}`
        );
        const btnText = document.createTextNode(`Done?`);
        //Send order confirmation back server notify relative client's order done
        btn.addEventListener('click', e => {
            e.preventDefault();
            socket_order.emit('orderDone', {
                orderItem,
                orderId,
                clientId,
                type,
                clientName,
            });
            node.parentNode.removeChild(node);
        });
        btn.appendChild(btnText);
        node.appendChild(textNode);
        node.appendChild(btn);
        clientOrders.appendChild(node);
    }
);

//Retive order confirmation from server and renew the order list in the client side
socket_order.on('done', data => {
    console.log(`Order done by the id number is ${data.orderId}`);

    const node = document.querySelector(`[data-key="${data.orderId}"]`);
    node.style.cssText = 'background-color: teal';
    const textNode = document.createTextNode(', Done!');
    node.appendChild(textNode);
});

//Handle error 
socket_order.on('error', data => {
    const node = document.createElement('li');
    const textNode = document.createTextNode(`sorry, ${data.message}`);
    node.appendChild(textNode);
    orderList.appendChild(node);
});

//helper function
function element(id) {
    return document.querySelector(`#${id}`);
}
