// Set up scroll animations
var scroll = window.requestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60)};

var elementsToShow = document.querySelectorAll('.show-on-scroll');

function showOnScroll() {

    elementsToShow.forEach(function (element) {
    if (isInViewport(element)) {
        element.classList.add('is-visible');
    }
    });

    scroll(showOnScroll);
}

function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        (rect.top <= 0 && rect.bottom >= 0)
        ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight))
        ||
        (rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
}

// Run scroll animations
showOnScroll();

// Simulate hover effect on mobile

// Toggle hover effect via tapping on mobile
$(".hover").on("click", function() {
    $(this).toggleClass("hover_effect");
});

function listenForHover() {
    // lastTouchTime is used to ignore emulated mousemove events
    let lastTouchTime = 0

    function enableHover() {
        if (new Date() - lastTouchTime < 500) return
        document.body.classList.add('hover-enabled')
        document.body.classList.remove('hover-disabled')
    }

    function disableHover() {
        document.body.classList.remove('hover-enabled')
        document.body.classList.add('hover-disabled')
    }

    function updateLastTouchTime() {
        lastTouchTime = new Date()
    }

    document.addEventListener('touchstart', updateLastTouchTime, true)
    document.addEventListener('touchstart', disableHover, true)
    document.addEventListener('mousemove', enableHover, true)

    enableHover()
}

listenForHover()

// Navbar animations

var lastId,
topMenu = $("#nav-list"),
topMenuHeight = topMenu.outerHeight(),
menuItems = topMenu.find("a"),
// Anchors corresponding to menu items
scrollItems = menuItems.map(function () {
    var item = $($(this).attr("href"));
    if (item.length) {
    return item;
    }
});

// Set up scroll animation when clicking menu items
var duration;

// Change scroll speed depending on screen size
function responsiveScroll(m) {
    if (m.matches) {
        duration = 500;
    } else {
        duration = 50;
    }
}

var media = window.matchMedia("(max-width: 768px)")
responsiveScroll(media)
//media.addListener(responsiveScroll)

// Scroll animation on click
menuItems.on("click", function (e) {
    var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top;// - topMenuHeight + 1;
    $("html, body").animate(
        {
        scrollTop: offsetTop
        },
        duration,
        "swing"
    );
    // Collapse navbar on mobile after click
    $("#menu").attr("checked", false);
    return false;
});

// Show active menu item while scrolling

var offset = 100;
var activeItem = scrollItems[0][0];

$(window).scroll(function () {
    // Get scroll position
    var fromTop = $(this).scrollTop() + offset; //+ topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function (idx, ele) {
        var activeRect = activeItem.getBoundingClientRect();
        var eleRect = ele[0].getBoundingClientRect();
        if ((activeItem !== ele[0] && (activeRect.bottom > 0) && (($(ele).offset().top < fromTop)) && eleRect.bottom > offset)
            || ((activeRect.bottom <= offset) 
                && (eleRect.top <= (window.innerHeight || document.documentElement.clientHeight))
                && (eleRect.top > 0))) {
                    activeItem = ele[0];
                    return ele[0];
        }  else if (idx == (scrollItems.length - 1)) {
            return activeItem;
        }
    });

    var id = cur[0].id;

    if (lastId !== id) {
        lastId = id;
        // Toggle active class
        menuItems
        .parent()
        .removeClass("active")
        .end()
        .filter("[href=#" + id + "]")
        .parent()
        .addClass("active");
    }
});