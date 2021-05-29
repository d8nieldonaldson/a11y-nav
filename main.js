// it is submenu or Submenu, never subMenu or Submenu

const submenuToggles = document.querySelectorAll('.submenu-toggle');
const globalNavList = document.querySelector('.global-nav-list');
const globalNavListItems = globalNavList.querySelectorAll('.global-nav-list-item');
const globalNavTopLevelLinks = globalNavList.querySelectorAll('.global-nav-top-level-link');
let isMenuOpen = false;
let activeItemExists = false;

function toggleMenu(menu){
    menu.classList.toggle('show');
    menu.toggleAttribute('hidden');
    isMenuOpen = !isMenuOpen;
}

function toggleButton(button){
    button.toggleAttribute('aria-expanded');
}

function moveFocus(items, currentIndex, nextIndex) {
    items[currentIndex].classList.remove('focus');
    items[nextIndex].classList.add('focus');
    items[nextIndex].focus();
    return activeItemExists = true;
}

function toggleMenuAndUpdateNav(container, setFocus){
    const button = container.querySelector('button'); 
    const submenu = container.querySelector('.submenu-list');
    const children = submenu.querySelectorAll('a');
    container.classList.toggle('expanded');
    container.toggleAttribute('data-expanded');
    toggleButton(button);
    toggleMenu(submenu);
    if(setFocus){
        moveFocus(children, 0, 0);
        activeItemExists = true;
    }
    return [activeItemExists, isMenuOpen]
}

globalNavList.addEventListener('click', e => {
    if (e.target.matches('.submenu-toggle')) {
        const parent = e.target.parentNode;
        if (isMenuOpen && parent.classList.contains('expanded')) {
            return toggleMenuAndUpdateNav(parent, false);
        }
        // if another menu is open, close it first, then open the button's menu
        if (isMenuOpen && !parent.classList.contains('expanded')) {
            const openParent = globalNavList.querySelector('.expanded');
            toggleMenuAndUpdateNav(openParent, false);
            return setTimeout(toggleMenuAndUpdateNav(parent, true), 0);
        }
        // no other menus are open, simply open the button's menu
        if (!isMenuOpen) {
            return toggleMenuAndUpdateNav(parent, true);
        }
    }
}, true);

globalNavList.addEventListener('mouseenter', e => {
    if (e.target.matches('.global-nav-list-item')) {
        const parent = e.target;
        ;
        if (isMenuOpen) {
            if (e.target.classList.contains('expanded')) {
                return;
            }
            const openParent = globalNavList.querySelector('.expanded');
            toggleMenuAndUpdateNav(openParent, false);
            return setTimeout(toggleMenuAndUpdateNav(parent, true), 0);
        }
        return toggleMenuAndUpdateNav(parent);
    }
}, true);

globalNavList.addEventListener('mouseleave', e => {
    if (e.target.matches('.global-nav-list-item')) {
        if (isMenuOpen) {
            const openParent = globalNavList.querySelector('.expanded');
            return toggleMenuAndUpdateNav(openParent, false);
        }
    }
}, true);

globalNavList.addEventListener('focus', e => {
    if (e.target.matches('.global-nav-top-level-link')) {
        if (isMenuOpen) {
            const openParent = globalNavList.querySelector('.expanded');
            toggleMenuAndUpdateNav(openParent, false);
        }
    }
}, true);

document.addEventListener('keydown', e => {
    // console.log(e.code);
    if (isMenuOpen) {
        const openParent = globalNavList.querySelector('.expanded');
        const openButton = openParent.querySelector('button');
        const openSubmenu = openParent.querySelector('.submenu-list');
        const children = openSubmenu.querySelectorAll('a');
        let currentIndex = 0;
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            e.preventDefault();
            children.forEach((child, index) => {
                if (child.classList.contains('focus')) {
                    currentIndex = index;
                    return currentIndex;    
                }
            });
            if (e.code === 'ArrowUp') {
                // first item is focused and user hits Up arrow: so loop to the last item
                if (currentIndex === 0) {
                    return moveFocus(children, currentIndex, Number(children.length - 1));
                }
                // user hits up arrow so simply move to the previous item
                return moveFocus(children, currentIndex, Number(currentIndex - 1));
            }
            // following is for ArrowDown
            // last item is focused and user hits Down arrow: so loop to the first item
            if (currentIndex === children.length - 1) {
                return moveFocus(children, currentIndex, 0);
            }
            // button (.submenu-toggle) has focus, menu is open and user hits Down arrow,
            // so move focus to first element in the element
            if (document.activeElement === openButton) {
                return moveFocus(children, 0, 0);
            }
            // user hits Down arrow so simply move to the next item
            return moveFocus(children, currentIndex, Number(currentIndex + 1));
        }
        // hit Esc key to close any open menu
        if (e.code === 'Escape') {
            toggleMenuAndUpdateNav(openParent, false);
            return openButton.focus();
        }
        if (e.code === 'Tab') {
            // Shift + Tab moves focus to button, so remove the focus class from the submenu item
            if (e.shiftKey) {
                const focused = openSubmenu.querySelector('a.focus');
                focused.classList.remove('focus');
                return activeItemExists = false;
            }
        }
    }
});

// click anywhere outside of open menu to close
window.addEventListener('click', function(e) {
    if (!(globalNavList && globalNavList.contains(e.target))) {
        if (isMenuOpen) {
            const openParent = globalNavList.querySelector('expanded');
            return toggleMenuAndUpdateNav(openParent, false);        
        }
    }
});