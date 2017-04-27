var newAnimals;
var smolAnimals = [];
var i;
var savedAnimals = [];

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getCuteness(i) {
  httpGetAsync('https://www.googleapis.com/customsearch/v1?q=smol+animal&searchType=image&imgType=photo&key=AIzaSyCH4Rnngqjbt6YATpbHWNfvJshZYiG7xQQ&cx=001985054786931384945%3Avlg7_fusw5u&start=' + i, function(data) {
    var data = JSON.parse(data);
    for (var j = 0; j < 10; j++)
    {
    newAnimals = data.items;
    smolAnimals.push(newAnimals[j]);
    }
    return smolAnimals;
  });
   return smolAnimals;
 }

function DrawCalendar() 
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

for (var j=0; j < savedAnimals.length; j++)
  {
    box=document.getElementByID(savedAnimals[j].date);
    console.log(box);
    //WHAT I NEED TO DO HERE IS ADD THE IMAGE FOR EACH DAY
  }
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
 //       chrome.storage.sync.set({'revealedImages': {}}, function() {
 //     });
 
}


for (var i = 1; i < 42; i+=10) {
getCuteness(i);
};

DrawCalendar(); 