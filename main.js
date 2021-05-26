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
    openUpdateButton(button);
    openSubmenu(submenu);
    // if pass in children argument, move focus to the related button
    // in case of mouseenter, we don't want to move focus, so don't pass in children
    if (children) {
        focusFirstChild(children);
    }
    return isMenuOpen = true;
}

function closeUpdateNav(container, button, submenu) {
    container.classList.remove('expanded');
    closeUpdateButton(button);
    closeSubmenu(submenu);
    return isMenuOpen = false;
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

function getMenuElements(parent) {
    const button = parent.querySelector('button');
    const submenu = getSubmenu(parent);
    const submenuChildren = getChildren(openSubmenu);
    return [parent, button, submenu, submenuChildren];
}

globalNavList.addEventListener('click', e => {
    if (e.target.matches('.submenu-toggle')) {
        const [parent, button, submenu, children] = findNewMenuElements(e);
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
    }
})

// globalNavListItems.forEach(item => {
//     item.addEventListener('mouseenter', e => {
//         const parent = e.target;
//         const submenu = getSubmenu(parent);
//         const button = parent.querySelector('button');
//         // edge case: menu is already open and user hovers into it: do nothing
//         if (isMenuOpen && parent.classList.contains('expanded')) {
//             console.log('already open');
//             return;
//         }
//         // another menu is open: close it and then open the newly hovered to menu
//         if (isMenuOpen && !parent.classList.contains('expanded')) {
//             console.log('close current and open');
//             const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
//             closeUpdateNav(openParent, openButton, openSubmenu);
//             return setTimeout(openUpdateNav(parent, button, submenu), 0);
//         }
//         // no menus are open, simply open the menu the user has moused into
//         console.log(`just entering`);
//         return openUpdateNav(parent, button, submenu);

//     });
// });

globalNavList.addEventListener('mouseenter', e => {
    console.log(`working 1`);
    if (e.target.matches('.global-nav-list-item')) {
        console.log(`working 2`);
        if (isMenuOpen) {
            if (e.target.classList.contains('expanded')) {
                console.log(`edge case`);
                return
            }
            const parent = e.target;
            const submenu = getSubmenu(parent);
            const button = parent.querySelector('button');
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            closeUpdateNav(openParent, openButton, openSubmenu);
            console.log(`menu open`);
            return setTimeout(openUpdateNav(parent, button, submenu), 0);
        }
    }
}, true)


// globalNavListItems.forEach(item => {
//     item.addEventListener('mouseleave', e => {
//         const [parent, button, submenu] = findOpenMenuElements(globalNavList);
//         if (isMenuOpen) {
//             console.log(`just leaving updated`);
//             return closeUpdateNav(parent, button, submenu);
//         }
//     });
// });

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
                }
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
                }
            });
            // last item is focused and user hits Down arrow: so loop to the first item
            if (currentIndex === children.length - 1) {
                return moveToFirstItem(children, currentIndex);
            }
            // button has focus, menu is open
            // so move focus to first element
            if (document.activeElement === openButton) {
                console.log(`odd case`);
                return moveToFirstItem(children, 0);

            }
            // user hits Down arrow so simply move to the next item
            return moveToNextItem(children, currentIndex);
        }
        // hit Esc key to close any open menu
        if (e.code === 'Escape') {
            closeUpdateNav(openParent, openButton, openSubmenu);
            return openButton.focus();
        }
        if (e.code === 'Tab') {
            if (e.shiftKey) {
                console.log(`shift + tab`);
                const focused = openSubmenu.querySelector('a.focus');
                focused.classList.remove('focus');
            }
        }
    }
});

// click anywhere outside of open menu to close
window.addEventListener('click', function(e) {
    if (!(globalNavList && globalNavList.contains(e.target))) {
        if (isMenuOpen) {
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            return closeUpdateNav(openParent, openButton, openSubmenu);
        }
    }
});