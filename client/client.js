const { promisify } = require('util');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const protoFilePath = path.join(__dirname, './hello_proto.proto');
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}
const packageDefinition = protoLoader.loadSync(protoFilePath, options);
const packageObject = grpc.loadPackageDefinition(packageDefinition);

async function main() {
    const client = new packageObject.Greeter('localhost:50051', grpc.credentials.createInsecure());

    // client.sayHello({name: 'yaser'}, function(err, response) {
    //   console.log('Greeting:', response.message);
    // });
    // client.sayHelloAgain({name: 'javid'}, function(err, response) {
    //   console.log('Greeting:', response.message);
    // });


    // const call_service = async (req, service_name) => {
    //     try {
    //       const res = await service_name(req)
    //       console.log("sayHello_Reply:", res.message)
    //     } catch (error) {
    //       console.log("error", error);
    //     }
    //   }
    //   call_service({ name: "Alan"}, sayHello)
    //   call_service({ name: "John" }, sayHelloAgain)


    try {
        const sayHello = promisify(client.sayHello).bind(client)
        const sayHelloAgain = promisify(client.sayHelloAgain).bind(client)
    

        // const resultSay =  await sayHello({ name: "Alex" })
        // console.log("sayHello_Reply_Async:", resultSay.message)
        // const resultReply =  await sayHelloAgain({ name: "Petter" })
        // console.log("sayHello_Reply_Async:", resultReply.message)

        const promises = [sayHello({ name: "Alex" }), sayHelloAgain({ name: "Petter" })];
        let res =  await Promise.allSettled(promises)
        console.log(res);
    } catch (error) {
        console.log(error);
    }

}


main()