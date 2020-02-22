# Beyond bookmarklets
For fun reasons I want to provide bookmarklet with some hacks for Beyond DnD website. There are already couple chrome extensions for Beyond, but since extensions are not working on iPad, I decided to hack a bit :)
## How to?
### Adding bookmarklet
Create new bookmark in your browser with any name and with url copied from `compiled.js`. Basically url is huge javascript.
### Compiling
If you want to add something or hack around, change files like you want and then run `ruby compile.rb` which will create one big javascript file (`compiled.js`).
### Running server
You might want to run the server to be able to connect to development environment. Just run `yarn` and then `node server.js` (you need to have both yarn and node installed).
### Running guard
You can have automatic compiling if you want. Just run `bundle exec guard`
### Running unit tests
Visit `localhost:8080/tests.html` after starting the server.
## TODO's
- add dice rolls to character page
- add dice rolls to other pages
- add dice roll calculator
- no idea #shrug

### Convert any string into equasion
given any string try to convert it to tokens and calculate the result

### Use tokens instead of strings when using calculator
don't parse the string on flu, byt use tokens instead
