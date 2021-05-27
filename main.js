// it is submenu or Submenu, never subMenu or Submenu

const submenuToggles = document.querySelectorAll('.submenu-toggle');
const globalNavList = document.querySelector('.global-nav-list');
const globalNavListItems = globalNavList.querySelectorAll('.global-nav-list-item');
const globalNavTopLevelLinks = globalNavList.querySelectorAll('.global-nav-top-level-link');
let isMenuOpen = false;
let activeItemExists = false;

function getParentFromEvent(event) {
    return event.target.parentNode;
}

function getSubmenu(parent) {
    return parent.querySelector('.submenu-list');
}

function closeUpdateButton(button) {
    button.setAttribute('aria-expanded', 'false');
}

function openUpdateButton(button) {
    button.setAttribute('aria-expanded', 'true');
}

function closeSubmenu(submenu) {
    submenu.classList.remove('show');
    submenu.hidden = !submenu.hidden;
}

function openSubmenu(submenu) {
    submenu.classList.add('show');
    submenu.hidden = !submenu.hidden;
}

function focusFirstChild(children) {
    children[0].focus();
    children[0].classList.add('focus');
    return activeItemExists = true;
}

function getChildren(parent, selector) {
    return parent.querySelectorAll(selector);
}

function getOpenMenuParent(container) {
    const parent = container.querySelector("[data-expanded='true']");
    return parent;
}

function arrowKeyToMoveFocus(items, currentIndex, nextIndex) {
    items[currentIndex].classList.remove('focus');
    items[nextIndex].classList.add('focus');
    items[nextIndex].focus();
    return activeItemExists = true;
}

function getMenuElements(parent) {
    const button = parent.querySelector('button');
    const submenu = getSubmenu(parent);
    const submenuChildren = getChildren(submenu, 'a');
    return [parent, button, submenu, submenuChildren];
}

function openAndUpdateNav(container, button, submenu, children) {
    container.classList.add('expanded');
    container.setAttribute('data-expanded', 'true');
    openUpdateButton(button);
    openSubmenu(submenu);
    // if pass in children argument, move focus to the related button
    // in case of mouseenter, we don't want to move focus, so don't pass in children
    if (children) {
        focusFirstChild(children);
        activeItemExists = true;
    }
    return [activeItemExists, isMenuOpen = true];
}

function closeAndUpdateNav(container, button, submenu) {
    const focused = submenu.querySelector('.focus');
    if(focused){
        focused.classList.remove('focus');
    }
    container.classList.remove('expanded');
    container.setAttribute('data-expanded', 'false');
    closeUpdateButton(button);
    closeSubmenu(submenu);
    
    return [isMenuOpen = false, activeItemExists = false];

}


globalNavList.addEventListener('click', e => {
    if (e.target.matches('.submenu-toggle')) {
        const [parent, button, submenu, children] = getMenuElements(getParentFromEvent(e));
        if (isMenuOpen && parent.classList.contains('expanded')) {
            return closeAndUpdateNav(parent, button, submenu);
        }
        // if another menu is open, close it first, then open the button's menu
        if (isMenuOpen && !parent.classList.contains('expanded')) {
            const [openParent, openButton, openSubmenu] = getMenuElements(getOpenMenuParent(globalNavList));
            closeAndUpdateNav(openParent, openButton, openSubmenu);
            return setTimeout(openAndUpdateNav(parent, button, submenu, children), 0);
        }
        // no other menus are open, simply open the button's menu
        if (!isMenuOpen) {
            return openAndUpdateNav(parent, button, submenu, children);
        }
    }
}, true);

globalNavList.addEventListener('mouseenter', e => {
    if (e.target.matches('.global-nav-list-item')) {
        const container = e.target;
        const [parent, button, submenu] = getMenuElements(container);
        if (isMenuOpen) {
            if (e.target.classList.contains('expanded')) {
                return;
            }
            const [openParent, openButton, openSubmenu] = getMenuElements(getOpenMenuParent(globalNavList));
            closeAndUpdateNav(openParent, openButton, openSubmenu);
            return setTimeout(openAndUpdateNav(parent, button, submenu), 0);
        }
        return openAndUpdateNav(parent, button, submenu);
    }
}, true);

globalNavList.addEventListener('mouseleave', e => {
    if (e.target.matches('.global-nav-list-item')) {
        if (isMenuOpen) {
            const [openParent, openButton, openSubmenu] = getMenuElements(getOpenMenuParent(globalNavList));
            return closeAndUpdateNav(openParent, openButton, openSubmenu);
        }
    }
}, true);

globalNavList.addEventListener('focus', e => {
    if (e.target.matches('.global-nav-top-level-link')) {
        if (isMenuOpen) {
            const [openParent, openButton, openSubmenu] = getMenuElements(getOpenMenuParent(globalNavList));
            return closeAndUpdateNav(openParent, openButton, openSubmenu);
        }
    }
}, true);

document.addEventListener('keydown', e => {
    // console.log(e.code);
    if (isMenuOpen) {
        const [openParent, openButton, openSubmenu, children] = getMenuElements(getOpenMenuParent(globalNavList));
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
                    return arrowKeyToMoveFocus(children, currentIndex, Number(children.length - 1));
                }
                // user hits up arrow so simply move to the previous item
                return arrowKeyToMoveFocus(children, currentIndex, Number(currentIndex - 1));
            }
            // following is for ArrowDown
            // last item is focused and user hits Down arrow: so loop to the first item
            if (currentIndex === children.length - 1) {
                return arrowKeyToMoveFocus(children, currentIndex, 0);
            }
            // button (.submenu-toggle) has focus, menu is open and user hits Down arrow,
            // so move focus to first element in the element
            if (document.activeElement === openButton) {
                return moveToFirstItem(children, 0);
            }
            // user hits Down arrow so simply move to the next item
            return arrowKeyToMoveFocus(children, currentIndex, Number(currentIndex + 1));
        }
        // hit Esc key to close any open menu
        if (e.code === 'Escape') {
            closeAndUpdateNav(openParent, openButton, openSubmenu);
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
            const [openParent, openButton, openSubmenu] = getMenuElements(getOpenMenuParent(globalNavList));
            return closeAndUpdateNav(openParent, openButton, openSubmenu);
        }
    }
});