//getting realtime Date Time
function display_c() {
  var refresh = 1000; // Refresh rate in milliseconds
  mytime = setTimeout("display_ct()", refresh);
}

function display_ct() {
  var x = new Date();

  // Get day, month, year, hours, minutes, and seconds
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var day = days[x.getDay()];
  var date = x.getDate();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var month = months[x.getMonth()];
  var year = x.getFullYear();
  var hours = x.getHours();
  var minutes = x.getMinutes();
  var seconds = x.getSeconds();

  // Add leading zero if necessary
  if (date < 10) {
    date = "0" + date;
  }

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // Combine the values
  //var dateTimeString = day + ', ' + date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds;  //Friday, 21 July 2023 15:12:42 format
  // var dateTimeString = day + ', ' + date + ' ' + month + ' ' + year; //Friday, 21 July 2023 format
  var dateTimeString = day; //Friday format

  document.getElementById("lblShowDate").innerHTML = dateTimeString;
  document.getElementById("greetingSpan").innerHTML = getGreeting(hours);
  tt = display_c();
}

function getGreeting(hours) {
  if (hours >= 0 && hours < 6) {
    return "Good Night,";
  } else if (hours >= 6 && hours < 12) {
    return "Good Morning,";
  } else if (hours >= 12 && hours < 17) {
    return "Good Afternoon,";
  } else {
    return "Good Evening,";
  }
}

window.onload = function () {
  display_ct();
};
//end getting realtime Date Time

//nav toggle functionality
var navToggler = document.getElementById("navToggler");
var mainWrapper = document.getElementById("mainWrapper");
var navMenu = document.getElementById("navMenu");
var bodyWrapper = document.getElementById("bodyWrapper");
//toggler button click to open and close menu function
// var isSideMenuClose = mainWrapper.classList.contains('menu-close');

// window.onload = function () {
// 	mainWrapper.classList.add('menu-close');
// };

//on mouse enter side menu open
navContainer.onmouseenter = function () {
  mainWrapper.classList.remove("menu-close");
  mainWrapper.classList.add("hover-menu-open");
};
//on mouse leave side menu close
navContainer.onmouseleave = function () {
  mainWrapper.classList.add("menu-close");
  mainWrapper.classList.remove("hover-menu-open");
};

//on mouse enter side menu open
navToggler.onclick = function () {
  mainWrapper.classList.remove("hover-menu-open");

  var isSideMenuClose = mainWrapper.classList.contains("menu-close");
  if (isSideMenuClose) {
    mainWrapper.classList.remove("menu-close");

    navContainer.onmouseenter = function () {
      // mainWrapper.classList.remove('menu-close');
      mainWrapper.classList.remove("hover-menu-open");
    };
    //on mouse leave side menu will remain opened
    navContainer.onmouseleave = function () {
      mainWrapper.classList.remove("menu-close");
      mainWrapper.classList.remove("hover-menu-open");
    };
  } else {
    mainWrapper.classList.add("menu-close");

    //on mouse enter side menu open
    navContainer.onmouseenter = function () {
      mainWrapper.classList.remove("menu-close");
      mainWrapper.classList.add("hover-menu-open");
    };
    //on mouse leave side menu close
    navContainer.onmouseleave = function () {
      mainWrapper.classList.add("menu-close");
      mainWrapper.classList.remove("hover-menu-open");
    };
  }
};

if (window.innerWidth < 576) {
  mainWrapper.classList.add("menu-close");

  bodyWrapper.onclick = function () {
    mainWrapper.classList.add("menu-close");
  };
}

//nav sub menu open close functionality
function toggleSubMenu(element) {
  var parentElement = element.parentNode;
  var isSubMenuActive = parentElement.classList.contains("sub-menu-active");
  // Remove the class from all parent elements
  var elements = document.getElementsByClassName("nav-item");
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove("sub-menu-active");
  }

  // Toggle the class on the parent element of the clicked element
  if (!isSubMenuActive) {
    parentElement.classList.add("sub-menu-active");
  }
}

$("#dropdowncal").flatpickr({
  dateFormat: "Y-m-d",
  allowInput: true,
  disableMobile: "true",
});

function loadNotifications() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/asset-management/report/notification", true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      var response = JSON.parse(xhr.responseText);
      displayNotifications(response);
    } else {
      console.error("API request failed with status " + xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("API request failed");
  };

  xhr.send();
}

function displayNotifications(notifications) {
  var notificationsContainer = document.getElementById("notifications");
  notificationsContainer.innerHTML = ""; // Clear existing notifications

  if (notifications.length === 0) {
    notificationsContainer.innerHTML = "No notifications available.";
  } else {
    notifications.forEach(function (notification, index) {
      var notificationElement = document.createElement("div");
      var message = generateNotificationMessage(notification, index + 1);
      notificationElement.textContent = message;
      notificationsContainer.appendChild(notificationElement);
      index + 1;
    });
  }
}

function generateNotificationMessage(notification, index) {
  var message =
    index +
    ". " +
    notification.assetType +
    " (" +
    notification.asset_tag_id +
    ")";

  if (notification.type === "Insurance") {
    message += " Insurance ends in " + notification.days_left + " days";
  } else if (notification.type === "AMC") {
    message += " AMC ends in " + notification.days_left + " days";
  } else if (notification.type === "Warranty") {
    message += " Warranty ends in " + notification.days_left + " days";
  }

  return message;
}

// Load notifications on page load and then refresh every 2 hours (7,200,000 milliseconds)
loadNotifications();
setInterval(loadNotifications, 7200000);



var showHideLoad = function (hideIndicator) {
  if (typeof hideIndicator === "undefined" || hideIndicator === null) {
      // console.log('data');
      $('#overlay').show();
  } else {
      // console.log('data1');
      $('#overlay').hide();
  }
}

