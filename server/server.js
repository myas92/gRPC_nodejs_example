const path = require('path');
const { promisify } = require('util');
const { Server } = require('@grpc/grpc-js');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const q = require('q');
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}
const protoFilePath = path.join(__dirname, './hello_proto.proto');
const packageDefinition = protoLoader.loadSync(protoFilePath, options);
const packageObject = grpc.loadPackageDefinition(packageDefinition);


function hiReplay({ request }, callback) {
    const { name } = request
    setTimeout(()=>{
        callback(null, { message: 'Hello Replay, ' + name });
        
    }, 2000)
}
function hi({ request }, callback) {
    const { name } = request;
    setTimeout(() => {
        callback(null, { message: 'Hello, ' + name });
    }, 5000);
    // return { message: 'Hello again, ' + name }
    
}

function main() {
    const server = new Server();
    server.addService(packageObject.Greeter.service,
        { sayHello: hi, sayHelloAgain: hiReplay });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
    console.log(`server running on 50051 port`);
}

main() 