exports.socket = io => {
    const clients = {};
    const admins = {};
    const on = io.of('/order');
    on.on('connection', socket => {
        socket.info = {};
        socket.on('clientRegister', () => {
            clients[socket.id]
                ? null
                : (clients[socket.id] = {
                      id: socket.id,
                      done: false,
                      order: '',
                      room: 'client',
                  });
            socket.info.room = 'clientroom';
            socket.join('clientroom');
        });
        socket.on('adminRegister', () => {
            admins[socket.id]
                ? null
                : (admins[socket.id] = {
                      id: socket.id,
                      room: 'adminroom',
                  });
            // console.log(`admins now ${JSON.stringify(admins, null, 4)}`);
            socket.info.room = 'adminroom';
            socket.join('adminroom');
        });

        // Customer's name added
        socket.on('addName', name => {
            socket.info.name = name;
            console.log(
                `${socket.info.name} in the ${
                    socket.info.room
                } room with customer tracking id ${socket.id}`
            );
        });
        // Retive orders from client side
        socket.on('orderSend', ({ orderItem, orderId }) => {
            console.log(
                `Order from customer ${socket.info.name},\nTrancking id: ${
                    socket.id
                }\nOrders: ${orderItem}\norder ID: ${orderId}
                `
            );
            // console.log(`Orders are ${JSON.stringify(data, 0, 4)}`);
            if (Object.keys(admins).length === 0) {
                on
                    .in('clientroom')
                    .to(socket.id)
                    .emit('error', {
                        message: 'no one in the kitchen yet',
                    });
                return;
            } else if (socket.info.room === 'clientroom') {
                //Send order to admin adminstration
                on.to('adminroom').emit('order', {
                    type: `customer order`,
                    clientId: socket.id,
                    orderItem,
                    orderId,
                    clientName: socket.info.name
                    // orderNumber: data.orderNumber,
                });
                on.in('clientroom').to(socket.id).emit('orderConfirm', {
                    orderItem,
                    orderId
                })
            }
        });
        // on.emit('test', 'test');
        // Admin finish order and send back to client
        socket.on('orderDone', data => {
            if (socket.info.room === 'adminroom') {
                // on.in('clientroom').to;
                on
                    .in('clientroom')
                    .to(data.clientId)
                    .emit('done', data);
            }
        });

        //Handle disconnect of socket
        socket.on('disconnect', () => {
            switch (socket.info.room) {
                case 'clientroom':
                    socket.leave('clientroom');
                    console.log(`Client ${socket.info.name} leave clientroom`);
                    break;

                case 'adminroom':
                    socket.leave('adminroom');
                    console.log(`Admin ${socket.info.name} leave clientroom`);
                    break;
            }
        });
    });

    // io.sockets.on('connection', socket => {
    //     console.log(`Connected from namespace /, and socket.id: ${socket.id}`);
    // });
};
