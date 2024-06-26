// Functionality for the Mailchimp embed on contact us and calData pages.

const mailchimpWrapper = document.getElementsByClassName('mailchimp-wrapper');
if (mailchimpWrapper.length > 0) {

    // Define elements.
    const mailchimpSubmit = mailchimpWrapper[0].querySelectorAll('#mc-embedded-subscribe');
    const mailchimpTextInputs = mailchimpWrapper[0].querySelectorAll('input.required');

    // Check for required fields on click.
    mailchimpSubmit[0].addEventListener("click", () => {
        mailchimpTextInputs.forEach((input) => {
            input.value === '' ? input.classList.add('show') :
                input.classList.remove('show')
        });
    });
}

