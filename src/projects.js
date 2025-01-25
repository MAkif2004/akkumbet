onload();

function onload() {
    const rightArrow = document.getElementsByClassName('right-arrow');
    const leftArrow = document.getElementsByClassName('left-arrow');
    const imgContainers = document.getElementsByClassName('img-container');
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
}

function changeImg(imgContainer, next) {
    const projectImgs = imgContainer.querySelectorAll('.project-img');
    for (let j = 0; j < projectImgs.length; j++) {
        if (!projectImgs[j].classList.contains('hidden')) {
            projectImgs[j].classList.add('hidden');
            if (next) {
                if (projectImgs[j + 1]) {
                    projectImgs[j + 1].classList.remove('hidden');
                }
                else {
                    projectImgs[0].classList.remove('hidden');
                }
            }
            else {
                if (projectImgs[j - 1]) {
                    projectImgs[j - 1].classList.remove('hidden');
                }
                else {
                    projectImgs[projectImgs.length - 1].classList.remove('hidden');
                }
            }
            return;
        }
    }
}