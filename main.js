// it is submenu or Submenu, never subMenu or Submenu

const submenuToggles = document.querySelectorAll('.submenu-toggle');
const globalNavList = document.querySelector('.global-nav-list');
const globalNavListItems = globalNavList.querySelectorAll('.global-nav-list-item');
const globalNavTopLevelLinks = globalNavList.querySelectorAll('.global-nav-top-level-link');
let isMenuOpen = false;

function getParent(event){
  return event.target.parentNode;
}

function getSubmenu(parent){
  return parent.querySelector('.submenu-list');
}



function closeUpdateButton(button){
    button.setAttribute('aria-expanded', 'false');
}

function openUpdateButton(button){
    button.setAttribute('aria-expanded', 'true');
}

function toggleSubmenu(submenu){
  submenu.classList.toggle('show');
  submenu.hidden = !submenu.hidden;
}

function closeSubmenu(submenu){
    submenu.classList.remove('show');
    submenu.hidden = !submenu.hidden;
}

function openSubmenu(submenu){
    submenu.classList.add('show');
    submenu.hidden = !submenu.hidden;
}

function focusFirstChild(children){
    children[0].focus();
    return children[0].classList.add('focus');
}

function getChildren(parent){
  return parent.querySelectorAll('a');
}




function openUpdateNav(container, button, submenu, children){
    container.classList.add('expanded');
    openUpdateButton(button)
    openSubmenu(submenu);
    focusFirstChild(children);
    isMenuOpen = true;
}

function closeUpdateNav(container, button, submenu){
    container.classList.remove('expanded');
    closeUpdateButton(button)
    closeSubmenu(submenu)
    isMenuOpen = false;
}


submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      let parent = getParent(e);
      let submenu = getSubmenu(parent);
      let children = getChildren(submenu);
      let button = parent.querySelector('button');
        if(isMenuOpen && parent.classList.contains('expanded')){
            console.log(`just close that shit`);
            return closeUpdateNav(parent, button, submenu);
        }
        if(isMenuOpen && !parent.classList.contains('expanded')){
            console.log(`it is complicated`);
            let currentlyOpenParent = globalNavList.querySelector('.expanded');
            let currentlyOpenButton = currentlyOpenParent.querySelector('button');
            let currentlyOpenSubmenu = currentlyOpenParent.querySelector('ul.submenu-list');
            closeUpdateNav(currentlyOpenParent, currentlyOpenButton, currentlyOpenSubmenu);
            return setTimeout(openUpdateNav(parent, button, submenu, children), 0);
          
        }
        if(!isMenuOpen){
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
        if(isMenuOpen && parent.classList.contains('expanded')){
            console.log('already open, muthafuckahhhh');
            return;
        }
        if(isMenuOpen && !parent.classList.contains('expanded')){
            console.log('it is complicated again');
            let currentlyOpenParent = globalNavList.querySelector('.expanded');
            let currentlyOpenButton = currentlyOpenParent.querySelector('button');
            let currentlyOpenSubmenu = currentlyOpenParent.querySelector('ul.submenu-list');
            closeUpdateNav(currentlyOpenParent, currentlyOpenButton, currentlyOpenSubmenu);
            return setTimeout(openUpdateNav(parent, button, submenu, children), 0);
        }
        return openUpdateNav(parent, button, submenu, children);

    });
});

globalNavListItems.forEach(item => {
    item.addEventListener('mouseleave', e => {
        let parent = e.target;
        let submenu = getSubmenu(parent);
        let button = parent.querySelector('button');
        if(isMenuOpen && parent.classList.contains('expanded')){
            return closeUpdateNav(parent, button, submenu);
        }
    });
});


globalNavTopLevelLinks.forEach(link => {
    link.addEventListener('focus', e => {
        if(isMenuOpen){
            console.log('when link gets focus, close the open menu');
            let currentlyOpenParent = globalNavList.querySelector('.expanded');
            let currentlyOpenButton = currentlyOpenParent.querySelector('button');
            let currentlyOpenSubmenu = currentlyOpenParent.querySelector('ul.submenu-list');
            return closeUpdateNav(currentlyOpenParent, currentlyOpenButton, currentlyOpenSubmenu);

        }
    });
});


document.addEventListener('keydown', function(e) {
    console.log(e.code); // User presses enter on their main keyboard - Enter
    if(e.code === 'ArrowUp'){
        console.log('up arrow pressedjsafkjdf');
        if(isMenuOpen){
            
            let currentlyOpenParent = globalNavList.querySelector('.expanded');
            let currentlyOpenSubmenu = currentlyOpenParent.querySelector('ul.submenu-list'); 
            let children = getChildren(currentlyOpenSubmenu);
            let lastChild = children[children.length -1];
            let currentIndex = 0;
            let nextIndex = 0;
            children.forEach((child, index) => {
                if(child.classList.contains('focus')){
                    currentIndex = index;
                };
            });
         
            if(currentIndex === 0){
                children[0].classList.remove('focus');
                children[children.length -1].focus();
                return children[children.length -1].classList.add('focus');

            }
            nextIndex = currentIndex - 1;
            children[currentIndex].classList.remove('focus');
            children[nextIndex].classList.add('focus');
            return children[nextIndex].focus();

        }
    }
    if(e.code === 'ArrowDown'){
        console.log('downtown arrow');
        if(isMenuOpen){
            
            let currentlyOpenParent = globalNavList.querySelector('.expanded');
            let currentlyOpenSubmenu = currentlyOpenParent.querySelector('ul.submenu-list'); 
            let children = getChildren(currentlyOpenSubmenu);
            let lastChild = children[children.length -1];
            let currentIndex = 0;
            children.forEach((child, index) => {
                if(child.classList.contains('focus')){
                    currentIndex = index;
                };
            });
            console.log(`arrow key down and ${currentIndex}`);
            console.log(`last child: ${lastChild}`);
            if(currentIndex === children.length - 1){
                children[currentIndex].classList.remove('focus');
                children[0].focus();
                return children[0].classList.add('focus');

            }
            nextIndex = currentIndex + 1;
            console.log(`down arrow and nextIndex: ${nextIndex}`);
            children[currentIndex].classList.remove('focus');
            children[nextIndex].classList.add('focus');
            return children[nextIndex].focus();
        }
    }
    if(e.code === 'Escape'){
        console.log('escape key pressed');
        if(isMenuOpen){
            console.log('ESC to close');
            let currentlyOpenParent = globalNavList.querySelector('.expanded');
            let currentlyOpenButton = currentlyOpenParent.querySelector('button');
            let currentlyOpenSubmenu = currentlyOpenParent.querySelector('ul.submenu-list');
            closeUpdateNav(currentlyOpenParent, currentlyOpenButton, currentlyOpenSubmenu);
            return currentlyOpenButton.focus();
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