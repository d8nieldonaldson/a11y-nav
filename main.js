// it is submenu or Submenu, never subMenu or Submenu

const submenuToggles = document.querySelectorAll('.submenu-toggle');
const globalNavList = document.querySelector('.global-nav-list');
const globalNavListItems = globalNavList.querySelectorAll('.global-nav-list-item');
const globalNavTopLevelLinks = globalNavList.querySelectorAll('.global-nav-top-level-link');
let isMenuOpen = false;

function getParent(event) {
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
    return children[0].classList.add('focus');
}

function getChildren(parent) {
    return parent.querySelectorAll('a');
}

function moveToFirstItem(items, currentIndex) {
    items[currentIndex].classList.remove('focus');
    items[0].classList.add('focus');
    return items[0].focus();
}

function moveToNextItem(items, currentIndex) {
    items[currentIndex].classList.remove('focus');
    items[currentIndex + 1].classList.add('focus');
    return items[currentIndex + 1].focus();
}

function moveToPreviousItem(items, currentIndex) {
    items[currentIndex].classList.remove('focus');
    items[currentIndex - 1].classList.add('focus');
    return items[currentIndex - 1].focus();
}

function moveToLastItem(items, currentIndex) {
    items[currentIndex].classList.remove('focus');
    items[items.length - 1].classList.add('focus');
    return items[items.length - 1].focus();
}

function openUpdateNav(container, button, submenu, children) {
    container.classList.add('expanded');
    openUpdateButton(button)
    openSubmenu(submenu);
    if (children) {
        focusFirstChild(children);
    }
    isMenuOpen = true;
}

function closeUpdateNav(container, button, submenu) {
    container.classList.remove('expanded');
    closeUpdateButton(button)
    closeSubmenu(submenu)
    isMenuOpen = false;
}

function findOpenMenuElements(container) {
    const openParent = container.querySelector('.expanded');
    const openButton = openParent.querySelector('button');
    const openSubmenu = getSubmenu(openParent);
    const openSubmenuChildren = getChildren(openSubmenu);
    return [openParent, openButton, openSubmenu, openSubmenuChildren];
}

function findNewMenuElements(event) {
    const parent = getParent(event);
    const button = parent.querySelector('button');
    const submenu = getSubmenu(parent);
    const children = getChildren(submenu);
    return [parent, button, submenu, children];
}

submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
        const [parent, button, submenu, children] = findNewMenuElements(e);
        // if the button's menu is open, simply close it
        if (isMenuOpen && parent.classList.contains('expanded')) {
            return closeUpdateNav(parent, button, submenu);
        }
        // if another menu is open, close it first, then open the button's menu
        if (isMenuOpen && !parent.classList.contains('expanded')) {
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            closeUpdateNav(openParent, openButton, openSubmenu);
            return setTimeout(openUpdateNav(parent, button, submenu, children), 0);
        }
        // no other menus are open, simply open the button's menu
        if (!isMenuOpen) {
            return openUpdateNav(parent, button, submenu, children);
        }

    });
});


globalNavListItems.forEach(item => {
    item.addEventListener('mouseenter', e => {
        const parent = e.target;
        const submenu = getSubmenu(parent);
        const button = parent.querySelector('button');
        // edge case: menu is already open and user hovers into it: do nothing
        if (isMenuOpen && parent.classList.contains('expanded')) {
            console.log('already open');
            return;
        }
        // another menu is open: close it and then open the newly hovered to menu
        if (isMenuOpen && !parent.classList.contains('expanded')) {
            console.log('close current and open');
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            closeUpdateNav(openParent, openButton, openSubmenu);
            return setTimeout(openUpdateNav(parent, button, submenu), 0);
        }
        // no menus are open, simply open the menu the user has moused into
        console.log(`just entering`);
        return openUpdateNav(parent, button, submenu);

    });
});

globalNavListItems.forEach(item => {
    item.addEventListener('mouseleave', e => {
        const [parent, button, submenu] = findOpenMenuElements(globalNavList);
        if (isMenuOpen) {
            console.log(`just leaving updated`);
            return closeUpdateNav(parent, button, submenu);
        }
    });
});


globalNavTopLevelLinks.forEach(link => {
    link.addEventListener('focus', () => {
        // user tabs/shift-tabs out of open menu, so simply close the menu
        if (isMenuOpen) {
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            return closeUpdateNav(openParent, openButton, openSubmenu);
        }
    });
});

document.addEventListener('keydown', function(e) {
    console.log(e.code); // User presses enter on their main keyboard - Enter
    if (isMenuOpen) {
        const [openParent, openButton, openSubmenu, children] = findOpenMenuElements(globalNavList);
        let currentIndex = 0;
        if (e.code === 'ArrowUp') {
            children.forEach((child, index) => {
                if (child.classList.contains('focus')) {
                    currentIndex = index;
                };
            });
            // first item is focused and user hits Up arrow: so loop to the last item
            if (currentIndex === 0) {
                return moveToLastItem(children, currentIndex);
            }
            // user hits up arrow so simply move to the previous item
            return moveToPreviousItem(children, currentIndex);
        }
        if (e.code === 'ArrowDown') {
            children.forEach((child, index) => {
                if (child.classList.contains('focus')) {
                    currentIndex = index;
                };
            });
            // last item is focused and user hits Down arrow: so loop to the first item
            if (currentIndex === children.length - 1) {
                return moveToFirstItem(children, currentIndex);

            }
            // user hits Down arrow so simply move to the next item
            return moveToNextItem(children, currentIndex);
        }
        // hit Esc key to close any open menu
        if (e.code === 'Escape') {
            closeUpdateNav(openParent, openButton, openSubmenu);
            return openButton.focus();
        }
    }
});

// click anywhere outside of open menu to close
// window.addEventListener('click', function(e) {
//     if (!(sortContainer && sortContainer.contains(e.target))) {
//         if (isSortPanelOpen) {
//             closePanel(sortButton, sortPanel);
//         }
//     }
// });