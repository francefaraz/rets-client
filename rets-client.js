const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbase=""
var express = require("express");
const request = require('request');

var fs=require('fs')

var photoIds = {
    '11111': [1,3],  // get photos #1 and #3 for listingId 11111
    '22222': '*',    // get all photos for listingId 22222
    '33333': '0'     // get 'preferred' photo for listingId 33333
  };
var app = express();
MongoClient.connect(url,{ useNewUrlParser: true , useUnifiedTopology: true}, function(err, db) {   //here db is the client obj
    if (err) throw err;
     dbase = db.db("rets-Client");
     console.log("connect successfully")
});
var rets = require('rets-client');
var clientSettings = {

    loginUrl: '',  //need to give url
    username: '', //enter ur username
    password: '', //enter the password
    version: 'RETS/1.8',
    method: 'GET'
};





var fs = require('fs');
var photoSourceId = '12345'; // 
var fields;
app.get("/login", (req, res) => {
    // establish connection to RETS server which auto-logs out when we're done
    rets.getAutoLogoutClient(clientSettings,async function (client) {
        res.send('<h1>Login Successfull </h1><br/><h2>Go To Console To see The Results</h2>');
        // mongt.hi("chaap");
        // ModificationTimestamp=2000-01-01T00:00:00+
        //get resources metadata//perform a query using DMQL2 -- pass resource, class, and query, and options
        return client.search.query('Property', 'Residential', '(ModificationTimestamp=2020-10-10T00:00:00+)', { limit: 3 })
            .then(function (searchData) {

                console.log("=============================================");
                        // console.log(searchData.results);
                // dbase.collection("Property").insertMany(searchData.results,async function(err, res) {
                //             if (err) throw err;
                //             console.log("all  documents inserted",res.insertCount);
                            
                //           });
                console.log(JSON.stringify(searchData.results[0].AssociationFee)+"")
                
                for (var dataItem = 0; dataItem < searchData.results.length; dataItem++) {
                    console.log("   -------- Result " + dataItem + " --------");
                    console.log(JSON.stringify(searchData.results[0].AssociationFee)+"")
                    console.log(searchData.results[dataItem].AssociationFee)

                    dbase.collection("test").insertOne({
        
                        Appliances:searchData.results[dataItem].Appliances,
                        BathroomsFull:searchData.results[dataItem].BathroomsFull,
                        BathroomsTotalInteger:searchData.results[dataItem].BathroomsTotalInteger,
                        BedroomsTotal:searchData.results[dataItem].BedroomsTotal,
                        CoListOfficePhone:searchData.results[dataItem].CoListOfficePhone,
                        Country:searchData.results[dataItem].Country,
                        CountyOrParish:searchData.results[dataItem].CountyOrParish,
                        LaundryFeatures:searchData.results[dataItem].LaundryFeatures,
                        ListPrice:searchData.results[dataItem].ListPrice,
                        
                        ParkingFeatures:searchData.results[dataItem].ParkingFeatures,
                        PricePerSquareFoot:searchData.results[dataItem].PricePerSquareFoot,
                        RoomType:searchData.results[dataItem].RoomType,
                        VirtualTourURLUnbranded:searchData.results[dataItem].VirtualTourURLUnbranded,
                        Latitude:searchData.results[dataItem].Latitude,
                        Longitude:searchData.results[dataItem].Longitude,
                    }
                        ,async function(err, res) {
                                if (err) throw err;
                                console.log("documents inserted Successfully");
                        })     

                   // console.log(searchData.results[dataItem])
                //    outputFields(searchData.results[dataItem], { fields: fields });
                }
                if (searchData.maxRowsExceeded) {
                    console.log("   -------- More rows available!");
                }
            }).then(function (fields) {
              let lisid=["364791406","364793661"]
             //perform a query using DMQL2 -- pass resource, class, and query, and options
            let j=0
            console.log("searching media")
            const brosri=async (j)=>{
              
             await client.search.query("Media", "Media",  '(ResourceRecordKeyNumeric='+lisid[j]+')', { limit: 50 })
               .then(async function (searchData) {
                   console.log('getting details:')
                 console.log("=============================================");
                 console.log("========  Residential Query Results  ========");
                 console.log("=============================================");
                 console.log('   ~~~~~~~~~ Header Info ~~~~~~~~~');
                 // outputFields(searchData.headerInfo);
                 console.log('   ~~~~~~~~~~ Query Info ~~~~~~~~~');
               outputFields(searchData, {exclude: ['results','headerInfo']});
       
       
                  dir="./"+searchData.results[j].ResourceRecordKeyNumeric+"/";
                 
                 
                             if (!fs.existsSync(dir)){
                                 fs.mkdirSync(dir);
                             }
                 //iterate through search results
                 for (var dataItem = 0; dataItem < searchData.results.length; dataItem++) {
                   console.log("   -------- Result " + dataItem + " --------");
                   console.log("row value"+searchData.results[dataItem].ResourceRecordKeyNumeric)
                   console.log("media url "+searchData.results[dataItem].MediaURL)
                   url=searchData.results[dataItem].MediaURL;
                   filenames="/"+(dataItem+1) + ".jpg"
                   console.log("url :",url,"filename :",filenames,"dir :",dir);
                    (async () => {
                              const data = await download(url ,dir+"/"+filenames);
                                   // console.log("successfully downloaded"); // The file is finished downloading.
                               })();
                  console.log("created files"+filenames)
                    // outputFields(searchData.results[dataItem], {fields: fields});
                 }
       
       
                 
                 if (searchData.maxRowsExceeded) {
                   console.log("   -------- More rows available!");
                 }
               });
               return
            }
            for(var i=0;i<2;i++){
              console.log("iterating through media")
             brosri(i)
             }
           }).catch(function (errorInfo) {
         var error = errorInfo.error || errorInfo;
         console.log("   ERROR: issue encountered:");
         outputFields(error);
         console.log('   '+(error.stack||error).replace(/\n/g, '\n   '));
       });
      })
       
    // .catch(function (errorInfo) {
    //  //   res.send('<h1>UNAUTHORISED USER </h1><br/><h2>Please Check Your Username And Password </h2>');
    //     console.log('Error unauthorised user')
    //     console.log(errorInfo.message);
    // })





    async function download(url, dest) {

      /* Create an empty file where we can save data */
      const file = fs.createWriteStream(dest);
    
      /* Using Promises so that we can use the ASYNC AWAIT syntax */
      await new Promise((resolve, reject) => {
        request({
          /* Here you should specify the exact link to the file you are trying to download */
          uri: url,
          gzip: true,
        })
            .pipe(file)
            .on('finish', async () => {
              console.log(`The file is finished downloading.`);
              resolve();
            })
            .on('error', (error) => {
              reject(error);
            });
      })
          .catch((error) => {
            console.log(`Something happened: ${error}`);
          });
    }
    

    function outputFields(obj, opts) {
        if (!obj) {
            console.log("      " + JSON.stringify(obj))
        } else {
            if (!opts) opts = {};

            var excludeFields;
            var loopFields;
            if (opts.exclude) {
                excludeFields = opts.exclude;
                loopFields = Object.keys(obj);
            } else if (opts.fields) {
                loopFields = opts.fields;
                excludeFields = [];
            } else {
                loopFields = Object.keys(obj);
                excludeFields = [];
            }
            for (var i = 0; i < loopFields.length; i++) {
                if (excludeFields.indexOf(loopFields[i]) != -1) {
                    continue;
                }
                if (typeof (obj[loopFields[i]]) == 'object') {
                    console.log("       " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]], null, 2).replace(/\n/g, '\n      '));
                } else {
                    console.log("      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]]));
                }
            }
        }
        console.log("__________________________________________________");
    }

});

app.listen(4585, () => {
    console.log("started server 1")
})

