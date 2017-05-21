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
      xmlHttp.setRequestHeader('Ocp-Apim-Subscription-Key', '21addf49be0a458dae859d9c29ea47bd');
      xmlHttp.send(null);
  }

  function getCuteness() {  //calls the API results page i and adds those 10 results to the smolAnimals array, returns the array
    httpGetAsync('https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=smol+animals+photo&count=150&imageType=photo', function(data) {
      var data = JSON.parse(data);
      for (var j = 0; j < 150; j++) 
      {
      newAnimals = data.value;
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
  checkMonth(month); //checks to see if there is stored data from the current month
  getStoredAnimals(); //loads and displays any animals that have already been revealed
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

  function checkMonth(currentMonth)
  {
    chrome.storage.sync.get('month', function(data) //if the stored data is from a separate month, clear it out. 
    {
      var storedmonth = data.month;
      if (storedmonth != currentMonth) 
      {
            chrome.storage.sync.clear();
      }
    });
  }

  function getStoredAnimals()
  {
  chrome.storage.sync.get('revealedImages', function(images) //definitely having some issue with getting the array back out of storage in the right format - am somewhat confused with keys/values/etc.
    {
      if (images.revealedImages != undefined) 
      {
      var loadedAnimals = images.revealedImages;
      savedAnimals = loadedAnimals;
      displayStoredAnimals(loadedAnimals);
    }
    });
  }

  function displayStoredAnimals(loadedAnimals) 
  {
    if (loadedAnimals === undefined)
      {
      return;
    }
  for (var j=0; j < loadedAnimals.length; j++)
      {
        var day = loadedAnimals[j].day;
        var url = loadedAnimals[j].url;
        var box = document.getElementById(day);
        var img = document.createElement('img');
        img.src = url;
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
    img.src = animal.contentUrl; 
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
          var todaysAnimal = {
            day:date,
            url:img.src,
          };
          savedAnimals.push(todaysAnimal);
          storeClickedAnimals(savedAnimals); 
  }

  function storeClickedAnimals(array) {  //puts the revealed animals and the current month into chrome storage
          var month = new Date().getMonth() + 1;
          chrome.storage.sync.set({'revealedImages': array, 'month': month}, function() {
          });
  };

  getCuteness(); 
  DrawCalendar(); 