ribcage-modal
=============

a modal for ribcage-ui

## install
```
npm install ribcage-modal
```

## usage

```javascript

  var Modal = require('ribcage-modal')
  
  var modal = new Modal({view: myView})
  
  modal.setContent(myOtherView)
  
  modal.addButton({label: 'done', action: function (){} })
  
  modal.clearButtons()
  
  modal.view.trigger('showBack') // shows a back button instead of a close button
  modal.view.trigger('hideBack') // hides the back button and shows the close button

  modal.close()

```
