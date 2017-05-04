var newAnimals;
var smolAnimals = [];
var savedAnimals = [];
var loadedAnimals = [];
var i;

function httpGetAsync(theUrl, callback) {  //make API call 
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getCuteness(i) {  //calls the API results page i and adds those 10 results to the smolAnimals array, returns the array
  httpGetAsync('https://www.googleapis.com/customsearch/v1?q=smol+animal&searchType=image&imgType=photo&key=AIzaSyCH4Rnngqjbt6YATpbHWNfvJshZYiG7xQQ&cx=001985054786931384945%3Avlg7_fusw5u&start=' + i, function(data) {
    var data = JSON.parse(data);
    for (var j = 0; j < 10; j++) //iterates through the 10 search results on each page
    {
    newAnimals = data.items;
    smolAnimals.push(newAnimals[j]);
    }
    return smolAnimals;
  });
   return smolAnimals;
 }

function DrawCalendar() //creates boxes for each day in the div container
{
var container = document.getElementsByClassName('container')[0];
var year = new Date().getFullYear();
var month = new Date().getMonth() + 1;
var daysInMonth = new Date(year, month,0 ).getDate();

for (var i = 1; i <= daysInMonth; i++)
  {
    var day = getDay(i);
    container.appendChild(day);
      }
getStoredAnimals();
}

function getDay(num) 
{
  var day = document.createElement('div');
  day.classList.add('day');
  day.id = num;
  day.innerHTML = num;
  day.addEventListener('click', handleClick);
  return day;
}

function getStoredAnimals()
{
chrome.storage.sync.get('revealedImages', function(images) //definitely having some issue with getting the array back out of storage in the right format - am somewhat confused with keys/values/etc.
  {
    loadedAnimals = images.revealedImages.array;
    console.log(loadedAnimals);
  });
    if(loadedAnimals.length === 0)
    {
      return;
    }
    for (var j=1; j < loadedAnimals.length; j++)
    {
      box=document.getElementByID(loadedAnimals[j].date);
      var img=laodedAnimals[j].url;
      box.appendChild(img); 
    }
}

function getRandomThing(array) {
  var randomNumberBetween0and1 = Math.random(); 
  var highestNumber = array.length; 
  var randomInteger = Math.floor(randomNumberBetween0and1 * highestNumber);
  return array[randomInteger];
}


function getImage()
{ 
  var img = document.createElement('img');
    var animal = getRandomThing(smolAnimals); 
    img.src = animal.link; 
    return img;
}

function handleClick(event) {
    if(event.target.childElementCount > 0) 
    {
      return;
    }
    var today = new Date().getDate();
    var date = event.target.innerHTML;
    if (date > today) 
      {
        return; 
      }
        var img=getImage();
        event.target.appendChild(img);
        var todaysAnimal = [{
          day:date,
          url:img.src,
        }];
          savedAnimals.push(todaysAnimal);
        storeClickedAnimals(savedAnimals); 
}

function storeClickedAnimals(array) {  //HAVING PROBLEMS IN THIS SECTION I THINK
        var month = new Date().getMonth() + 1;
        chrome.storage.sync.set({'revealedImages': array, 'month': month}, function() {
        console.log('Animals saved!'); 
        });
};

function clearStorage(){
  reset = document.getElementByID('reset'); 
  reset.addEventListener('click', function()
  {
    chrome.storage.sync.clear;
  });
}

for (var i = 1; i < 42; i+=10) {
getCuteness(i);
};

DrawCalendar(); 