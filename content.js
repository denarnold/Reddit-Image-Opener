//---------------------------------------------------------------
//                     Construct the Button                    --
//---------------------------------------------------------------

// Define script for a new image open button (derrived from the share button)
const buttonScript = `<button rpl=""
    class="button border-md flex flex-row justify-center items-center mr-sm h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover"
    style="height: var(--size-button-sm-h); font: var(--font-button-sm)"
    type="button"
    data-action="open-image"
    aria-haspopup="true"
    aria-expanded="false"
    >
    <span class="flex items-center">
      <span>
        Open Image
      </span>
    </span>
  </button>`

// Use the dom parser to convert the buttonScript string into a node
const parser = new DOMParser()
const openImageButton = parser.parseFromString(buttonScript, 'text/html').body.firstChild




//---------------------------------------------------------------
//                    addButtonToPosts Function                --
//---------------------------------------------------------------

function addButtonToPosts(imagePosts) {
  // Check each image post for openImageButton and add if not present
  for (let post of imagePosts) {
    if (!post.shadowRoot.querySelector('button[data-action="open-image"]')) {
      
      // Identify the buttonBarNode of the post
      let buttonBarNode = post.shadowRoot.querySelector('.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start')
      
      // Add the button
      buttonBarNode.appendChild(openImageButton.cloneNode(true))
    }
  }
}




//---------------------------------------------------------------
//                 Functions to List Image Posts               --
//---------------------------------------------------------------

// Takes a list of nodes and filters to image posts
function filterImagePosts(container) {
  return Array.from(container.children).filter(node =>
      node.nodeName === 'SHREDDIT-POST' &&
      (node.getAttribute('post-type') === 'image' || 
        node.getAttribute('post-type') === 'gallery')
  )
}

function listImagePosts() {
  // Define the main post container node (contains initial posts and batches of new posts)
  const postContainerNode = document.querySelector('report-flow-provider')

  // Collect posts directly under report-flow-provider
  let imagePosts = filterImagePosts(postContainerNode)

  // Collect posts under any faceplate-batch children of report-flow-provider
  const faceplateBatches = postContainerNode.querySelectorAll('faceplate-batch')
  for (let batch of faceplateBatches) {
      imagePosts = imagePosts.concat(filterImagePosts(batch))
  }

  // Collect posts under any shreddit-feed children of report-flow-provider
  const shredditFeeds = postContainerNode.querySelectorAll('shreddit-feed')
  for (let feed of shredditFeeds) {
      imagePosts = imagePosts.concat(filterImagePosts(feed))
  }

  return imagePosts
}




//---------------------------------------------------------------
//                 Check Posts on Time Interval                --
//---------------------------------------------------------------

setInterval(() => {addButtonToPosts(listImagePosts())}, 2000)




//---------------------------------------------------------------
//                    Listen for Button Clicks                 --
//---------------------------------------------------------------

document.addEventListener('click', function(event) {
  // Get the full path of the event, including elements inside shadow DOMs
  const path = event.composedPath()

  // Search within the first 3 elements in the path for a button element with the 'open-image' action
  for (let i = 0; i < Math.min(3, path.length); i++) {
      const element = path[i]
      if (element.nodeName === 'BUTTON' && element.dataset && element.dataset.action === 'open-image') {

        // Identify the post dom element in the path (3 elements past the button element)
        const postNode = postElement = path[i+3]

        // Identify the image source link for the post
        const sourceLink = findSourceLink(postNode)

        //send a message to background.js as an array containing an identifying message and the link
        chrome.runtime.sendMessage(["Open this image link", sourceLink])

        // Exit the loop once we've found the element
        break
      }
  }
})




//---------------------------------------------------------------
//                   findSourceLink Function                   --
//---------------------------------------------------------------

const singleImageNode = 'absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-30 object-cover scale-[1.2] post-background-image-filter'
const multiImageNode = 'relative flex justify-center mt-0 bg-black/20'
  



function findSourceLink(postNode) {

  let imageNode

  //identify the image node
  if (postNode.getAttribute('post-type') === 'gallery') {

    // Identify the image index that is currently being displayed (taken from indicator dots at bottom of gallery)
    const indexContainer = postNode.querySelector('gallery-carousel')
                          .shadowRoot.querySelector('faceplate-carousel')
                          .shadowRoot.querySelector('faceplate-pagination-indicator')

    let index = indexContainer.getAttribute('page-index')
    index = parseInt(index, 10)  // Convert from string to int

    // Assemble query string and navigate to the image container for that image index +1 
    const imageContainerName = `li[slot="page-${index + 1}"]`
    const imageContainer = postNode.querySelector(imageContainerName)

    // The image node is the first child element in the container
    imageNode = imageContainer.firstElementChild

  } else {

    // Handle single-image posts
    imageNode = postNode.querySelector('img[alt][role="presentation"]')
  
  }
  
  let rawLink = imageNode.src
  let newLink

  //get source link for reddit images
  if (rawLink.substr(0, 23) == 'https://preview.redd.it') {

    // Extract the image filename from the path
    const imagePath = rawLink.substring(rawLink.lastIndexOf('/'), rawLink.indexOf('?'))

    // Extract the last parameter for the security hash
    const lastParamMatch = rawLink.match(/&s=[^&]*/)
    const lastParamStr = lastParamMatch ? lastParamMatch[0].replace('&', '?') : ''

    // Construct the new link
    newLink = 'https://i.redd.it' + imagePath + lastParamStr
  
  //get source link for external images (haven't seen these in new reddit layout)
  } else if (rawLink.substr(0, 32) == 'https://external-preview.redd.it') {
    newLink = postNode.querySelector(externalLinkDom).getAttribute('href')
  
  //push remaining good links through (haven't seen these in new reddit layout)
  } else if (rawLink.substr(0, 17) == 'https://i.redd.it') {
    newLink = rawLink
  }

  //return the output
  console.log("raw link: ", rawLink)
  console.log("new link: ", newLink)
  return newLink
}