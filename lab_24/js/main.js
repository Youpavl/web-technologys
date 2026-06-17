// Завдання 3
$(document).ready(function () {

    $('h3').each(function () {

        let nextDiv = $(this).next('div');

        nextDiv.insertBefore($(this));

    });

});


// Завдання 4
$(document).ready(function () {

    $('input[type="checkbox"]').change(function () {

        let checkedCount = $('input[type="checkbox"]:checked').length;

        if (checkedCount >= 3) {
            $('input[type="checkbox"]').prop('disabled', true);
        }

    });

});