
let myButton = document.getElementById('actionBtn');

let blocksToToggle = document.querySelectorAll('.target-block');

myButton.addEventListener('click', function () {

    for (let i = 0; i < blocksToToggle.length; i++) {
        blocksToToggle[i].classList.toggle('hidden');
    }

});