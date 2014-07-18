#madge-targeted
##Description
This project uses MaDGe to get specific amd/cjs dependency trees from big
codebases.

###Notes
This is a work in progress currently. There is command-line help. Documentation
is a new thing while this goes from a quick hack to a useful product. More to
come.

Also, this may be broken at any time, even the very head you're looking at right
now.

##Usage
madge-targeted presently takes a directory subtree of modules and an entry point
for the code, and builds a dependency tree from the entry point, graphing all
modules that depend on it. This generates a top-down view of an application or
module.

###Examples
```
user@host:~/git/madge-targeted/ > ./madge-targeted.js -e heyo225/main \
-d ../heyo-resources/src/js/dojo/
```
prints a dot file to stdout containing a digraph of all live code that the app's
main entry point explicitly uses. (Excludes dynamically loaded editor widgets, I
think.)

##Design
The processing of MaDGe output is pretty naive, but originated in a proof of
concept. There's plenty of room for improvement.

##Goals
The next two priority goals (after potentially fixing if broken) are to:
* facilitate batch processing of codebases
* support reverse traversal to get consumers of target modules

###Misc. Todo
More stuff that maybe needs done:
* potentially refactor stuff
* potentially async some things
* support graphviz rendering
* put issues in GitHub tracker
* write tests
* add automagic file output naming

Maybe nice to haves:
* build fancy-pants html-ized moving graphs with dependo
* maybe make api?

Btw, 1.0 will be called Beefy Miracle, just for Bryan Lunduke.
<!-- ##API -->