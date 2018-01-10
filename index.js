let express = require('express'),
 	cookieParser = require('cookie-parser'),
 	bodyParser = require('body-parser'),
 	fs = require('fs'),
 	http = require('http'),
 	cors = require('cors');
const db = require('./comments-db');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.post('/add', (req, res) => {
	let title = req.body.programm;
	let newData = Object.assign({}, req.body);
	delete newData.programm;

	if (db[title]) {
		db[title].push(newData)
	} else {
		db[title] = [newData];
	}

	fs.writeFile(__dirname + '/comments-db/index.json', JSON.stringify(db, null, 4), 'utf8', (err) => {
			if (err) {
				console.log(err)
				res.status(500).jsonp({ error: 'Failed to write file' });
			}
			res.end("write successful!");
		});         	
});

app.post('/get', (req, res) => {
	res.end(JSON.stringify(db[req.body.title]));
});

app.get('/', (req, res) => {
	res.end('<h1>Hello</h1>')
});

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

let port = 10102;
app.set('port', port);

let server = http.createServer(app);
server.listen(port);
