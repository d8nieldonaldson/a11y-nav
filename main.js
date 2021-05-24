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


function openUpdateNav(container, button, submenu, children) {
    container.classList.add('expanded');
    openUpdateButton(button)
    openSubmenu(submenu);
    focusFirstChild(children);
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
        if (isMenuOpen && parent.classList.contains('expanded')) {
            console.log(`just close that shit update betterized`);
            return closeUpdateNav(parent, button, submenu);
        }
        if (isMenuOpen && !parent.classList.contains('expanded')) {
            console.log(`it is complicated`);
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            closeUpdateNav(openParent, openButton, openSubmenu);
            return setTimeout(openUpdateNav(parent, button, submenu, children), 0);

        }
        if (!isMenuOpen) {
            console.log(`just open that shit`);
            return openUpdateNav(parent, button, submenu, children);
        }

    });
});


globalNavListItems.forEach(item => {
    item.addEventListener('mouseenter', e => {
        let parent = e.target;
        let submenu = getSubmenu(parent);
        let children = getChildren(submenu);
        let button = parent.querySelector('button');
        if (isMenuOpen && parent.classList.contains('expanded')) {
            console.log('already open');
            return;
        }
        if (isMenuOpen && !parent.classList.contains('expanded')) {
            console.log('it is complicated again as well');
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            closeUpdateNav(openParent, openButton, openSubmenu);
            return setTimeout(openUpdateNav(parent, button, submenu, children), 0);
        }
        console.log(`just entering`);
        return openUpdateNav(parent, button, submenu, children);

    });
});

globalNavListItems.forEach(item => {
    item.addEventListener('mouseleave', e => {
        // let parent = e.target;
        // let submenu = getSubmenu(parent);
        // let button = parent.querySelector('button');
        const [parent, button, submenu] = findOpenMenuElements(globalNavList);
        if (isMenuOpen) {
            console.log(`just leaving updated`);
            return closeUpdateNav(parent, button, submenu);
        }
    });
});


globalNavTopLevelLinks.forEach(link => {
    link.addEventListener('focus', () => {
        if (isMenuOpen) {
            console.log('when link gets focus, close the open menu, updated');
            const [openParent, openButton, openSubmenu] = findOpenMenuElements(globalNavList);
            return closeUpdateNav(openParent, openButton, openSubmenu);

        }
    });
});


document.addEventListener('keydown', function(e) {
    console.log(e.code); // User presses enter on their main keyboard - Enter
    if (isMenuOpen) {
        const [openParent, openButton, openSubmenu, children] = findOpenMenuElements(globalNavList);
        const firstChild = children[0];
        const lastChild = children[children.length - 1];
        let currentIndex = 0;
        let nextIndex = 0;
        if (e.code === 'ArrowUp') {
            console.log('up arrow pressed, streamlined j');
            children.forEach((child, index) => {
                if (child.classList.contains('focus')) {
                    currentIndex = index;
                };
            });

            if (currentIndex === 0) {
                console.log(`new way`);
                firstChild.classList.remove('focus');
                lastChild.focus();
                return lastChild.classList.add('focus');

            }
            nextIndex = currentIndex - 1;
            children[currentIndex].classList.remove('focus');
            children[nextIndex].classList.add('focus');
            return children[nextIndex].focus();
        }
        if (e.code === 'ArrowDown') {
            console.log('downtown arrow k');
            children.forEach((child, index) => {
                if (child.classList.contains('focus')) {
                    currentIndex = index;
                };
            });
            console.log(`arrow key down and ${currentIndex} k`);
            if (currentIndex === children.length - 1) {
                children[currentIndex].classList.remove('focus');
                firstChild.focus();
                return firstChild.classList.add('focus');

            }
            nextIndex = currentIndex + 1;
            console.log(`down arrow and nextIndex: ${ nextIndex } k`);
            children[currentIndex].classList.remove('focus');
            children[nextIndex].classList.add('focus');
            return children[nextIndex].focus();

        }
        if (e.code === 'Escape') {
            console.log('ESC to close k');
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