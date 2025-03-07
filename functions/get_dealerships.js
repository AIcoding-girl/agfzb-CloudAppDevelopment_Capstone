/* Gets all dealerships in the database that match the specified state. */
function main(params) {

    return new Promise(function (resolve, reject) {
        const Cloudant = require('@cloudant/cloudant'); 
        const cloudant = Cloudant({
            url: params.COUCH_URL,
            plugins: {iamauth: {iamApiKey:params.IAM_API_KEY}} 
        });
        const dealershipDb = cloudant.use('dealerships'); 
        
        if (params.dealerId) { 
            // return dealership of specified dealership ID (if specified)
            dealershipDb.find({"selector": {"id": parseInt(params.dealerId)}}, 
                function (err, result) { 
                        if (err) { 
                            console.log(err) 
                            reject(err); 
                        } 
                        let code=200; 
                            if (result.docs.length==0) { 
                                code= 404; 
                            }
                        resolve({ 
                            statusCode: code, 
                            headers: { 'Content-Type': 'application/json' }, 
                            body: result 
                        }); 
                    }); 
        } else if (params.state) { 
            // return dealerships for the specified state (if specified)
            dealershipDb.find({"selector": {"state": {"$eq": params.state}}}, 
                function (err, result) { 
                        if (err) { 
                            console.log(err) 
                            reject(err); 
                        } 
                        let code=200; 
                            if (result.docs.length==0) { 
                                code= 404; 
                            }
                        resolve({ 
                            statusCode: code, 
                            headers: {'Content-Type': 'application/json'}, 
                            body: result 
                        }); 
                    }); 
        } else { 
            // return all documents if no parameters are specified
            dealershipDb.list(
                { include_docs: true }, 
                function (err, result) { 
                    if (err) { 
                        console.log(err) 
                        reject(err); 
                    } 
                    resolve({ 
                        statusCode: 200, 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: result 
                    }); 
                }
            ); 
        } 
    });
}