var store = {};
var searchQuery;

var featuredRef = firebase.database().ref('Featured/project/');
var pastRef = firebase.database().ref('Past/');
var presentRef = firebase.database().ref('Present/');
var futureRef = firebase.database().ref('Future/');

function homeSetup() {
	extractContent(featuredRef);
	// extractPastImage();
	// extractPresentImage();
	// extractFutureImage();
}

function pastSetup() {
	extractPastImage();
}

function presentSetup() {
	extractPresentImage();
}

function futureSetup(){
	extractFutureImage();
}

function extractContent(ref){
	var ul = document.getElementById("featured_links");

	ref.orderByChild("date").on("child_added", function(snapshot) {
		var links = snapshot.val().fullScreenImg;
		var li = document.createElement("li");
		var img = document.createElement("img");
		img.setAttribute("src" , links);
		li.appendChild(img);
		ul.appendChild(li);
	});
}

function extractProjectImage(){
	var ul = document.getElementById("all_link_list");

	projectsRef.orderByChild("priority").on("child_added", function(snapshot) {
		var links = snapshot.val().link;
		var li = document.createElement("li");
		var img = document.createElement("img");
		var imgID = "draggable-img";
		img.setAttribute("src" , links);
		img.setAttribute("id", imgID);
		li.appendChild(img);
		ul.appendChild(li);
		Draggable.create("#draggable-img", {
			bounds: document.getElementById("all_link_list")
		});
		// console.log(img);
		// console.log(links);
	});
}

function extractSpaceImage(){
	var ul = document.getElementById("all_link_list");

	featuredRef.orderByChild("priority").on("child_added", function(snapshot) {
		var links = snapshot.val().link;
		var li = document.createElement("li");
		var img = document.createElement("img");
		img.setAttribute("src" , links);
		li.appendChild(img);
		ul.appendChild(li);
		
		// console.log(links);
	});
}

// code for Search Queries

/* Is called when user clicks on searchbar. 
Makes searchbar get rid of value of "Search..." */
function active(){
	var searchBar = document.getElementById("search-bar");

	if(searchBar.value == "search:"){
		searchBar.value = "";
		searchBar.placeholder = "search:"
		console.log("active searchbar")
		setupIndex(featuredRef);
	}
}

function inactive(){
	var searchBar = document.getElementById("search-bar");

	if(searchBar.value == "search:"){
		searchBar.value = "search:";
		searchBar.placeholder = "";
		console.log("inactive searchbar")
	}
}

function createLunrIndex(){
	var index = lunr(function(){
		//The id
	    this.ref('name')

	    // boost increases the importance of words found in this field
	    this.field('projectTitle', {boost: 20})
	    this.field('artist', {boost: 10})
	    this.field('author')
	    this.field('text')
	});
	console.log("lunr index created");
	return index;
}

// /* Takes in the corresponding reference of posts, goes through each initial
// child inside the reference and whenever one is added, creates a copy of the JSON object, and stores it inside a global dictionary 'store' */
function setupIndex(ref){
	//Create index of all keywords that can be searched for
	var index = createLunrIndex();

	ref.on("child_added", function(snapshot){
		var doc = {
			'name': snapshot.key, //name is the id
			'artist': snapshot.val().artist,
			'author': snapshot.val().author,
			'projectTitle': snapshot.val().projectTitle,
			'text': snapshot.val().text
		};

		//store[] is global, so it's seen everywhere. Used to keep track of more info of document than index
		store[doc.name] = { 
			author: snapshot.val().author,
			artist: snapshot.val().artist, 
			projectTitle: snapshot.val().projectTitle,
			imageUrl: snapshot.val().fullScreenImg,
			projectUrl: snapshot.val().projectURL,
			text: snapshot.val().text,
			videoUrl: snapshot.val().videoURL
		};
		// console.log("artist " + snapshot.val().artist);
		// console.log("projectTitle " + snapshot.val().projectTitle);
		index.add(doc);
	});

	var savedIndex = index.toJSON();

	// Put the index into storage to be used in different function
	localStorage.setItem('savedIndex', JSON.stringify(savedIndex));
}

function search(){
	// Retrieve the index from storage
	var data = localStorage.getItem('savedIndex');
	index = lunr.Index.load(JSON.parse(data));

	//Retrieve searchquery
	var searchHandle = document.getElementById("search-bar");
	var resultDiv = document.getElementById("featured_links");
	searchQuery = searchHandle.value;

	if(searchQuery === ""){
		//This is some edge case that I can't think of at the moment
		emptyDiv(resultDiv);
	}
	else{
		var results = index.search(searchQuery);

		if(results.length === 0){
			console.log("No results found");
			resultDiv.innerHTML = "<p><strong>No results found</strong></p>";
		}
		else{
			console.log("Results found");
			emptyDiv(resultDiv);

			for(var item in results){
				var ref = results[item].ref; //This allows code to properly access items inside the store dictionary

				var li = document.createElement("li");
				var a = document.createElement("a");
				var img = document.createElement("img");
				a.setAttribute("href", store[ref].projectUrl);
				img.setAttribute("src" , store[ref].imageUrl);
				a.appendChild(img);
				li.appendChild(a);
				resultDiv.appendChild(li);
			}
		}
	}
}

//Deletes all content inside a div. Basically a copy of jQuery's $().empty function
function emptyDiv(div){
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}
}