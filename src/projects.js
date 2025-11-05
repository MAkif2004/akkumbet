onload();

function onload() {
    const rightArrow = document.getElementsByClassName('right-arrow');
    const leftArrow = document.getElementsByClassName('left-arrow');
    const imgContainers = document.getElementsByClassName('img-container');

    const imgs = document.getElementsByClassName('image');
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const fullscreenImgContainer = document.getElementById('fullscreen-image-container');
    const imageCloseButton = document.getElementById('image-close-button');

    // Initialize image credit badges per container
    for (let i = 0; i < imgContainers.length; i++) {
        ensureCreditElement(imgContainers[i]);
        updateCreditForContainer(imgContainers[i]);
    }

    for (let i = 0; i < rightArrow.length; i++) {
        rightArrow[i].addEventListener('click', () => {
            changeImg(imgContainers[i], true);
        })
    }
    for (let i = 0; i < leftArrow.length; i++) {
        leftArrow[i].addEventListener('click', () => {
            changeImg(imgContainers[i], false);
        })
    }

    for (let i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('click', () => {
            toggleFullscreenContainer(imgs[i], fullscreenContainer, fullscreenImgContainer);
        })
    }
    imageCloseButton.addEventListener('click', () => {
        toggleFullscreenContainer(null, fullscreenContainer, fullscreenImgContainer);
    })
    fullscreenContainer.addEventListener('click', () => {
        toggleFullscreenContainer(null, fullscreenContainer, fullscreenImgContainer);
    })

    // Close overlay with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !fullscreenContainer.classList.contains('hidden')) {
            toggleFullscreenContainer(null, fullscreenContainer, fullscreenImgContainer);
        }
    });
}

// Create credit element if missing
function ensureCreditElement(imgContainer) {
    if (!imgContainer.querySelector('.img-credit')) {
        const credit = document.createElement('div');
        credit.className = 'img-credit hidden';
        imgContainer.appendChild(credit);
    }
}

// Update credit text/visibility based on the currently visible image's data-credit
function updateCreditForContainer(imgContainer) {
    const creditEl = imgContainer.querySelector('.img-credit');
    if (!creditEl) return;
    const imgs = imgContainer.querySelectorAll('.project-img');
    let current = null;
    for (let i = 0; i < imgs.length; i++) {
        if (!imgs[i].classList.contains('hidden')) { current = imgs[i]; break; }
    }
    const creditText = current && current.dataset && current.dataset.credit ? current.dataset.credit : '';
    if (creditText) {
        creditEl.textContent = creditText;
        creditEl.classList.remove('hidden');
    } else {
        creditEl.textContent = '';
        creditEl.classList.add('hidden');
    }
}

function toggleFullscreenContainer(img = null, fullscreenContainer, fullscreenImgContainer) {
    // If the overlay is hidden and we have an img -> open and show it
    if (fullscreenContainer.classList.contains('hidden')) {
        if (!img) return; // nothing to show
        document.body.style.overflowY = 'hidden';
        // create an <img> element inside the fullscreen container so object-fit works
        const el = document.createElement('img');
        el.className = 'fullscreen-image';
        el.src = img.src;
        // prevent clicks on the image from bubbling up (which would close the overlay)
        el.addEventListener('click', (e) => e.stopPropagation());
        // remove any previous image just in case
        const prev = fullscreenImgContainer.querySelector('.fullscreen-image');
        if (prev) prev.remove();
        fullscreenImgContainer.appendChild(el);
    }
    else {
        // If overlay is visible and a new img was passed -> replace source (don't close)
        if (img) {
            const existing = fullscreenImgContainer.querySelector('.fullscreen-image');
            if (existing) {
                existing.src = img.src;
            } else {
                const el = document.createElement('img');
                el.className = 'fullscreen-image';
                el.src = img.src;
                el.addEventListener('click', (e) => e.stopPropagation());
                fullscreenImgContainer.appendChild(el);
            }
            return;
        }
        // else close
        document.body.style.overflowY = 'auto';
        const existing = fullscreenImgContainer.querySelector('.fullscreen-image');
        if (existing) existing.remove();
    }
    fullscreenContainer.classList.toggle("hidden");
}

function changeImg(imgContainer, next) {
    const projectImgs = imgContainer.querySelectorAll('.project-img');
    for (let j = 0; j < projectImgs.length; j++) {
        if (!projectImgs[j].classList.contains('hidden')) {
            projectImgs[j].classList.add('hidden');
            let newVisible;
            if (next) {
                if (projectImgs[j + 1]) {
                    projectImgs[j + 1].classList.remove('hidden');
                    newVisible = projectImgs[j + 1];
                }
                else {
                    projectImgs[0].classList.remove('hidden');
                    newVisible = projectImgs[0];
                }
            }
            else {
                if (projectImgs[j - 1]) {
                    projectImgs[j - 1].classList.remove('hidden');
                    newVisible = projectImgs[j - 1];
                }
                else {
                    projectImgs[projectImgs.length - 1].classList.remove('hidden');
                    newVisible = projectImgs[projectImgs.length - 1];
                }
            }
            // If fullscreen is open, update its image to match the newly visible slide
            const fullscreenContainer = document.getElementById('fullscreen-container');
            if (fullscreenContainer && !fullscreenContainer.classList.contains('hidden')) {
                const fullscreenImgContainer = document.getElementById('fullscreen-image-container');
                const fullscreenImg = fullscreenImgContainer && fullscreenImgContainer.querySelector('.fullscreen-image');
                if (fullscreenImg && newVisible) {
                    fullscreenImg.src = newVisible.src;
                }
            }
            // Update credit badge for this container
            updateCreditForContainer(imgContainer);
            return;
        }
    }
}