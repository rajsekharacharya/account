var lockTimeout;
 
function startLockTimer() {
    lockTimeout = setTimeout(lockSystem, 3600000);  // 1 hour (3600000 ms)
}
 
function resetLockTimer() {
    clearTimeout(lockTimeout);  // Clear previous timeout
    lockTimeout = setTimeout(lockSystem, 3600000);  // Restart the timer (no startLockTimer call)
}
 
function lockSystem() {
    console.log("Session expired. Logging out...");
    window.location.href = "logout";  // Redirect to logout page
}
 
// Start the lock timer as soon as the script loads (only once)
startLockTimer();
 
document.addEventListener("mousemove", resetLockTimer);   // Mouse movement
document.addEventListener("keypress", resetLockTimer);    // Key press
document.addEventListener("click", resetLockTimer);       // Click on any element
document.addEventListener("scroll", resetLockTimer);      // Scrolling the page
document.addEventListener("touchstart", resetLockTimer);  // Touch start on touch devices
document.addEventListener("touchmove", resetLockTimer);   // Touch move on touch devices
document.addEventListener("mousedown", resetLockTimer);   // Mouse button press
document.addEventListener("mouseup", resetLockTimer);     // Mouse button release
document.addEventListener("dblclick", resetLockTimer);    // Double-click event
document.addEventListener("wheel", resetLockTimer);       // Mouse wheel event
document.addEventListener("keydown", resetLockTimer);     // Key down event
document.addEventListener("keyup", resetLockTimer);       // Key up event
document.addEventListener("focus", resetLockTimer, true);  // Focus event
document.addEventListener("blur", resetLockTimer, true);   // Blur event
document.addEventListener("change", resetLockTimer);      // Change event



function display_c() {
  setTimeout(display_ct, 1000); // Refresh every second
}

function display_ct() {
  const x = new Date();
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][x.getDay()];
  const hours = x.getHours();

  // Update HTML content
  document.getElementById("lblShowDate").innerText = day;
  document.getElementById("greetingSpan").innerText = getGreeting(hours);
  display_c(); // Refresh after 1 second
}

function getGreeting(hours) {
  return hours < 6 ? "Good Night," :
         hours < 12 ? "Good Morning," :
         hours < 17 ? "Good Afternoon," :
                      "Good Evening,";
}

window.onload = display_ct;


var navToggler = document.getElementById("navToggler");
var mainWrapper = document.getElementById("mainWrapper");
var navContainer = document.getElementById("navContainer");
var bodyWrapper = document.getElementById("bodyWrapper");

// Toggler button click to open and close menu
navToggler.onclick = function () {
  mainWrapper.classList.toggle("menu-close");
  resetNavContainerEvents();
};

// On mouse enter and leave side menu
function resetNavContainerEvents() {
  if (mainWrapper.classList.contains("menu-close")) {
    navContainer.onmouseenter = function () {
      mainWrapper.classList.remove("menu-close");
      mainWrapper.classList.add("hover-menu-open");
    };
    navContainer.onmouseleave = function () {
      mainWrapper.classList.add("menu-close");
      mainWrapper.classList.remove("hover-menu-open");
    };
  } else {
    navContainer.onmouseenter = null;
    navContainer.onmouseleave = null;
  }
}

resetNavContainerEvents();

// Close menu on body click in small screens
if (window.innerWidth < 576) {
  mainWrapper.classList.add("menu-close");
  bodyWrapper.onclick = function () {
    mainWrapper.classList.add("menu-close");
  };
}

// Sub-menu toggle functionality
function toggleSubMenu(element) {
  var parentElement = element.parentNode;
  var elements = document.getElementsByClassName("nav-item");
  Array.from(elements).forEach(function (el) {
    el.classList.remove("sub-menu-active");
  });
  parentElement.classList.toggle("sub-menu-active");
}



// Get the current URL
var currentUrl = window.location.pathname;

var navLinks = document.querySelectorAll('.nav-link');
// Loop through each navigation link
navLinks.forEach(function (navLink) {
  // Get the href attribute of the navigation link
  var href = navLink.getAttribute('href');
  // Check if the current URL ends with the href attribute value
  if (currentUrl.endsWith(href)) {
    // Add the 'active' class to the parent navigation item
    navLink.closest('.nav-item').classList.add('link-active');
  }
});

var subNavLinks = document.querySelectorAll('.sub-menu-link');
// Loop through each sub-navigation link
subNavLinks.forEach(function (subLink) {
  // Get the href attribute of the sub-navigation link
  var href = subLink.getAttribute('href');
  // Check if the current URL ends with the href attribute value
  if (currentUrl.endsWith(href)) {
    // Add the 'active' class to the parent navigation item and sub-menu item
    subLink.closest('.nav-item').classList.add('sub-menu-active');
    subLink.closest('.sub-menu-item').classList.add('link-active');
  }
});

$("#dropdowncal").flatpickr({
  dateFormat: "Y-m-d",
  allowInput: true,
  disableMobile: "true",
});


var showHideLoad = function (hideIndicator) {
  if (typeof hideIndicator === "undefined" || hideIndicator === null) {
    // console.log('data');
    $('#overlay').show();
  } else {
    // console.log('data1');
    $('#overlay').hide();
  }
}


function printModalContent() {
  var modalContent = document.getElementById('modalContentToPrint').innerHTML;

  // Convert canvas to image
  var canvas = document.getElementById('barcode');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  var barcodeImage = new Image();
  barcodeImage.src = canvas.toDataURL('image/png');

  barcodeImage.onload = function() {
    console.log('Barcode image loaded successfully');
    // Replace the canvas with the image in the print content
    modalContent = modalContent.replace('<canvas id="barcode"></canvas>', '<img src="' + barcodeImage.src + '" style="width: 120px; height: 50px;" />');

    var printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body {-webkit-print-color-adjust: exact; font-family: Arial; }
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      /* print page */
      #staticBackdropLabel {
        display: none !important;
      }
      @media print {
        @page {
          size: A4;
        }
        .report-page {
          height: auto;
          width: auto;
        }
        .d-print-none {
          display: none;
        }
        .page-footer {
          position: fixed;
        }
      }
      html, body {
        font-family: "Inter", sans-serif;
      }  
      table {
        width: 100%;
      }
      /* page setup */
      .w-10 { width: 10%; }
      .w-15 { width: 15%; }
      .w-20 { width: 20%; }
      .w-25 { width: 25%; }
      .w-30 { width: 30%; }
      .w-33 { width: 33.3333%; }
      .w-40 { width: 40%; }
      .w-50 { width: 50%; }
      .w-60 { width: 60%; }
      .w-75 { width: 75%; }
      .w-80 { width: 80%; }
      .w-100 { width: 100%; }
      .text-start { text-align: start; }
      .text-center { text-align: center; }
      .text-end { text-align: right; }
      .lbl-bold { font-weight: 700; }
      .lbl-medium { font-weight: 500; }
      .lbl-light { font-weight: 300; }
      .lbl-bold-hr {font-weight: bold;display: inline-block;margin-right: 10px;}
      .dotted-hr {border-top: 1px dotted #000;display: inline-block;width: calc(100% - 50px);vertical-align: middle;}
      .p-0 { padding: 0 !important; }
      .lbl-gap-md { margin-bottom: 30px; }
      .lbl-gap-sm { margin-bottom: 15px; }
      .d-flex { display: flex; }
      .page-header { margin-bottom: 10px; border-bottom: 1px solid #b3b3b3; }
      .page-footer { padding: 10px; margin-top: 20px; left: 0; right: 0; bottom: 0; border-top: 1px solid #b3b3b3; }
      .table-page-header { table-layout: fixed; }
      .table-page-header td { vertical-align: top; }
      .img-brand { width: 120px; }
      .sign-line {display: block;margin-inline: auto;border-top: 1px dashed #454545;width: 150px;height: 8px;}
      .brand-header { font-size: 24px; font-weight: 500; line-height: 1; margin-bottom: 10px; color: #3f3f3f; }
      .brand-info { font-size: 13px; font-weight: 400; line-height: 1.5; margin-bottom: 5px; }
      .lbl-info-caption { color: #3f3f3f; }
      .lbl-word-caption { width: 115px; flex-shrink: 0; }
      .lbl-word-caption-lg { width: 140px; flex-shrink: 0; }
      .lbl-header { font-size: 16px; margin-bottom: 6px; font-weight: 700; }
      .section-wrapper:not(:last-child) { margin-bottom: 30px; }
      .value-wrapper:not(:last-child) { margin-bottom: 10px; }
      .value-container { font-size: 14px; }
      .value-container:not(:last-child), .value-container:not(:only-child) { margin-bottom: 4px; }
      .lbl-caption, .lbl-row-caption { color: #000; }
      .lbl-value, .lbl-row-value { color: #3f3f3f; }
      .lbl-sm { font-size: 12px; }
      .lbl-row-value:not(:last-child), .lbl-row-caption:not(:last-child),
      .lbl-row-value:not(:only-child), .lbl-row-caption:not(:only-child) { margin-bottom: 5px; }
      .page-content-header { font-weight: 700; font-size: 18px; text-align: center; color: #3f3f3f; margin-bottom: 15px; }
      .table-border, .table-border th, .table-border td { border: 0.8px solid #535353; border-collapse: collapse; }
      .table-border td, .table-border th { padding: 6px; }
      .table-info th, .table-info td, .table-details th, .table-details td { font-size: 12px; }
      .table-info th, .table-details th { font-size: 12px; vertical-align: top; }
      .table-info td, .table-details td { vertical-align: middle; }
      .table-sign-off td { vertical-align: bottom; font-size: 12px; }
      .footer-table { font-size: 12px; font-weight: 400; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; height: 45px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(modalContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();

    var images = printWindow.document.querySelectorAll('img');
    var loadedCount = 0;

    function checkIfAllLoaded() {
      loadedCount++;
      if (loadedCount === images.length) {
        printWindow.print();
        printWindow.close();
      }
    }

    images.forEach(function(image) {
      if (image.complete) {
        checkIfAllLoaded();
      } else {
        image.onload = checkIfAllLoaded;
        image.onerror = function() {
          console.error('Image failed to load.');
          checkIfAllLoaded();
        };
      }
    });

    // If there are no images, print immediately
    if (images.length === 0) {
      printWindow.print();
      printWindow.close();
    }
  };

  barcodeImage.onerror = function() {
    console.error('Barcode image failed to load.');
    printWindow.print();
    printWindow.close();
  };
}


