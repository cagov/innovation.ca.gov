# digital.ca.gov
Office of Digital Innovation website


## Blog

Our blog originally on news.alpha.ca.gov has been moved here so it is deployed to [digital.ca.gov/blog](https://digital.ca.gov/blog/)

### Writing posts

To write a new post:

- Add it here...[Wordpress for digital.ca.gov](https://live-digital-ca-gov.pantheonsite.io/.pantheonsite.io/wp-admin/edit.php)

## Deployment

Deployment is handled by a [wordpress-to-github](https://www.npmjs.com/package/@cagov/wordpress-to-github) instance; the repository that controls it is [here](https://github.com/cagov/services-wordpress-to-github-digital-ca-gov).

## Preview Mode

### Currently under reconstruction 

You can preview content updates [here](https://fa-go-wp-prev-01.azurewebsites.net/).

- The Preview instance will give you a rendering of the page as it will look in production.
- It can create a preview for any page or post that is published
- If you publish a new page in WordPress and are not ready to go live but want to see how it will look live use the ```Preview-Mode``` tag on the content before publishing
- The presence of the Preview-Mode tag will prevent it from going live but will allow it to be browsable on the [preview instance](https://fa-go-wp-prev-01.azurewebsites.net/)
- When ready to go live remove the Preview-Mode tag from the content and publish again
