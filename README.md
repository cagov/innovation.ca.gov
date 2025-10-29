# innovation.ca.gov
Office of Data and Innovation website  


## Blog
 
Our blog originally on news.alpha.ca.gov has been moved here and is viewable at [innovation.ca.gov/blog](https://innovation.ca.gov/blog/)

### Writing posts

To write a new post:

- Add it here... [Wordpress for innovation.ca.gov](https://live-digital-ca-gov.pantheonsite.io/.pantheonsite.io/wp-admin/edit.php)

## Deployment

Deployment is handled by a [wordpress-to-github](https://www.npmjs.com/package/@cagov/wordpress-to-github) instance; the repository that controls it is [here](https://github.com/cagov/services-wordpress-to-github-digital-ca-gov).


## PAR scores

The Performance, Accessibility and Readability scores are displayed in the page footers. These are determined by audits which evaluate:
- The lighthouse performance score in the <a href="https://github.com/cagov/site-performance-review">site-performance-review API</a>
- Accessibility issues will cause the site build to fail, all site urls are evaluated during the build process so we should always have 100% score on automated audits
- Automated Readability Index. This process was evaluated to closely match hemingwayapp's grading also base don ARI. We discovered some interesting issues with hemingway during this process and opened bug reports with them to help them stop using a . in an email address or a curly apostrophe as word delimiters.
