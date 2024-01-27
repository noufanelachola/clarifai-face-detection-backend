// const fetch = require("node-fetch");

const PAT = '9adee5fcd2114e51ad526e42d3c1ee94';
const USER_ID = 'noufan_elachola';           
const APP_ID = 'initial-face-recognition';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req,res) => {
    const IMAGE_URL = req.body.image;
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                {
                    data: {
                        image: {
                            url: IMAGE_URL,
                            // base64: imageBytes,
                            allow_duplicate_url: true
                        }
                    }
                }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
    
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
    
            const regions = response.outputs[0].data.regions;
    
            regions.forEach(region => {
                // Accessing and rounding the bounding box values
                const boundingBox = region.region_info.bounding_box;
                const topRow = boundingBox.top_row.toFixed(3);
                const leftCol = boundingBox.left_col.toFixed(3);
                const bottomRow = boundingBox.bottom_row.toFixed(3);
                const rightCol = boundingBox.right_col.toFixed(3);
    
                region.data.concepts.forEach(concept => {
                    // Accessing and rounding the concept value
                    const name = concept.name;
                    const value = concept.value.toFixed(4);
    
                    console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
    
                });
            });

            res.json(response);


            
        }
    
    );
    
    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    // .then(response => response.json())    
    // .then(data => {
    //         res.json(data)
    //     })
    //     .catch(err => {
    //         res.status(400).json("error at api")
    //     })
}

const handleImage = (req,res,db) => {
    const {id} = req.body;

    db("users").where("id","=",id)
        .increment("entries",1)
        .returning("entries")
        .then(entries => {
            res.json(entries[0].entries);
        }).catch(err => {
            res.status(400).json("Error at entries")
        }
    );
}

module.exports = {
    handleImage,
    handleApiCall
}