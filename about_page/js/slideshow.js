/**
 * Created by GuoJunjun on 25.12.14. JunjunGuo.com
 */


/**
 * check if client from China
 */
//function clientlocationplugin() {
//    return jQuery.getScript('http://www.geoplugin.net/javascript.gp', function () {
//        var country = geoplugin_countryName();
//        var zone = geoplugin_region();
//        var district = geoplugin_city();
//        console.log("Your location is: " + country + ", " + zone + ", " + district);
//    })();
//}
console.log("Your location: " + geoplugin_countryName());
/**
 *  * shuffle the list and return a photo addressed list
 * @param list
 * @returns {Array}
 */
function shuffleList(list) { // shuffle nrlist and return a list with objects ready for slides
    var copy = [], n = list.length, index;
    var bgimgaddress;
    if (geoplugin_countryName() == "China") {
        bgimgaddress = './2015/images/bg/';
    } else {
        bgimgaddress = 'http://static.panoramio.com/photos/large/';
    }
    while (n) {
        index = Math.floor(Math.random() * (n--));
//        var overlay = 'url(".2015/css/images/overlay-black.svg"),'
        copy.push(bgimgaddress + list[index] + '.jpg');
        list.splice(index, 1);
    }
    return copy;
}

/**
 * add the image to #header as background image
 * @param theImg
 */
function addImage(theImg) {
    document.getElementById("header").style.backgroundImage = "url('" + theImg + "')";
}
var listh = [			//  Images id numbers for header
    77233663,
    105836333,
    109199045,
    109172199,
    92464442,
    92464435,
    107909681,
    51569735,
    108930464,
    109049207,
    109100961,
    106419102,
    51569745,
    78491829,
    49428516,
    43143230,
    106397984
];
function slideShow() {
    var counter = 0; // to keep track of current slide
    var slides = shuffleList(listh); // a collection of all of the slides

    var showImage = function () {
// calculates the actual index of the element to show
        var theImage = Math.abs(counter % slides.length);
        addImage(slides[theImage]);
    };

// add click events to prev &amp; next buttons
    $('.nextslide').on('click', function () {
        document.getElementById('header').scrollIntoView()
        counter++;
        showImage();
    });
    $('.prevslide').on('click', function () {
        document.getElementById('header').scrollIntoView()
        counter--;
        showImage();
    });
    // logo click
    $('#logo').on('click', function () {
        document.getElementById('header').scrollIntoView()
        counter = Math.floor(Math.random() * slides.length);
        showImage();
    });


    showImage();
}

//run the script:

//run slide show
slideShow();


/**
 * Fly down
 */
$(".b0").animate({ "top": "+=350px", opacity: 1}, 1500);

// fly up
var list = [".b1",
            ".b2",
            ".b3",
            ".b4"];

for (i = 0; i < list.length; i++) {
    $(list[i]).animate({ "top": "-=450px", opacity: 1}, 2000 + i * 500, function () {
//            $(list[i]).animate({opacity: 1});
    });
}


$(".prevslide").animate({ "left": "-=500px", opacity: 1}, 2000);

$(".nextslide").animate({ "right": "-=500px", opacity: 1}, 2000);


//
var listf = [			//  Images id numbers for footer
    106397977,
    101153731,
    77835780,
    100920022,
    42462727,
    55717739,
    77835786,
    100920020
];
function changeBCP() {

    var bcgslides = shuffleList(listf); // a collection of all of the bcgslides

    var changepic = function () {

        var theimg = bcgslides[Math.floor(Math.random() * bcgslides.length)];

        document.getElementById("footer").style.backgroundImage =
            "url('./2015/css/images/overlay-black.svg'), url('" + theimg + "')";
    };

// add click events to prev &amp; next buttons
    $('#changebcp').on('click', function () {
        document.getElementById('footer').scrollIntoView()
        changepic();
    });

    changepic();
}

changeBCP();


//Magnific Popup ------------->
// Inline popups
$('#inline-popups').magnificPopup({
                                      delegate: 'a',
                                      removalDelay: 500, //delay removal by X to allow out-animation
                                      callbacks: {
                                          beforeOpen: function () {
                                              this.st.mainClass = this.st.el.attr('data-effect');
                                          }
                                      },
                                      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
                                  });
