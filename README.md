# Reddit Image Opener
[Extension is published in the chrome web store](https://chrome.google.com/webstore/detail/reddit-image-opener/iffnacikcgjlndahdgnckeekdefoafbn)

## Pain Point
When browsing Reddit, I found it to be cumbersome to view source images for posts as it required opening the post itself - a step which either results in a lot of unnecessary tabs or navigating back-and-forth between pages.

I wanted to find a convenient way to open source images directly from a post's preview.

## First Iteration: AutoHotKey
I started by writing an AutoHotKey script that would capture the URL of the post preview image located under the mouse cursor, alter the URL to reference the source image, and then launch the URL. This worked for some image posts, but not for others. I learned that there are different types of image posts, and the URL syntax is not universal between them all. I also found this solution to be clunky and wanted to find a more elegant and distributable solution.

## Final Solution: Chrome Extension
Writing a browser extension seemed to be a solution worth investigating as it would likely integrate well with the website, allow for a clean user experience, and be easy to distribute across multiple devices.

I began investigating and learning about the various types of browser extensions and how to develop them, as this was a new field for me. I started by writing several iterations that utilized the right-click context menu to reference the post preview image located under the mouse cursor, similar to the AutoHotKey script.

As I progressed in learning more advanced aspects of browser extensions, I switched over to developing an extension that would place a button under each post preview image, which would then be used to open the source image in a single click. A settings menu was also implemented to allow for easy toggling between opening source images in either foreground or background tabs.

The extension was written using JavaScript, HTML, and CSS.
