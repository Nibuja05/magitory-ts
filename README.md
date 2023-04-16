# factorio-typescript-template

A template for a typescript based factorio mod.

# How to install:

-   run `npm install` to install the node modules and to run the installation script
-   if your installation was not sucessful, please try to fix the error and try again with `npm run link`

# How to develop:

-   run `npm run dev` to transpile the code
-   all changes should be in your mod folder automatically

## Localizaion

- localization files are auto-generated
- to add a new localization use a localization function in any file:
	- `localizeName(type, name, localizedString, language[default=en])`: localizes [name] of group [type] for a language
	- `localizeDescription(...)`: same as above
	- `localize(...)`: same as above

## Versioning

-   if you want to change the current mod version, simply run `npm run version xxx`, where xxx is the new version
