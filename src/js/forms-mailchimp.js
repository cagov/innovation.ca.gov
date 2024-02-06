// Functionality for the Mailchimp embed on contact us and calData pages.

const mailchimpWrapper = document.getElementsByClassName('mailchimp-wrapper');
if (mailchimpWrapper.length > 0) {

    // Define elements.
    const mailchimpSubmit = mailchimpWrapper[0].querySelectorAll('#mc-embedded-subscribe');
    const mailchimpTextInputs = mailchimpWrapper[0].querySelectorAll('input.required')

    // Start by disabling the submit button.
    mailchimpSubmit[0].classList.add('btn-disabled');

    // Create counter for required inputs.
    let inputsWithValues = 0;

    // Once all items are filled in, enable the submit button.
    mailchimpTextInputs.forEach((input) => {

        // Listen for keystrokes.
        input.addEventListener('keyup', () => {

            // If the input has a value count it.
            mailchimpTextInputs.forEach((input) => {
                inputsWithValues += (input.value !== '') ? 1 : 0;
            });

            // If all inputs have values, enable.
            if (inputsWithValues == mailchimpTextInputs.length) {
                mailchimpSubmit[0].classList.remove('btn-disabled')
            }

            // Reset the counter.
            inputsWithValues = 0;
        });
    });
}
;
