var express = require('express');
var app = express();
app.use(express.static('assets'))

console.log("1");

const port = process.env.PORT || 3000;

app.listen(port,);
app.set('view engine', 'ejs');

console.log("2");

var fs = require("firebase-admin");
let serviceAccount;
if (process.env.GOOGLE_CREDENTIALS != null) {
    serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
else {
    serviceAccount = require("./jewelsbykrys-firebase-adminsdk-w6mdp-b001b4fd21.json");
}
fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

console.log("3");

const db = fs.firestore();
const ingColl = db.collection('items');

app.get('/', async function (req, res) {
    const items = await ingColl.get();
    let data = {
        url: req.url,
        itemData: items.docs,
    }
    res.render('pages/index', data);
});

console.log("4");

app.get('/item/:itemid', async function (req, res) {
    try {
        console.log(req.params.itemid);

    } catch (e) {
    }
    const item_id = req.params.itemid;
    const item_ref = ingColl.doc(item_id);
    const doc = await item_ref.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
    }
    // const items = await ingColl.get();
    let data = {
        url: req.url,
        itemData: doc.data(),
    }
    res.render('pages/item', data);
});

console.log("5");

app.use(express.static(__dirname + '/public'));