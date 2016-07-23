#HTML5 AJAX upload

### Demo

`http://craigcosmo.github.io/upload.js/`

### Browser Support

IE9+,FF3+,Chrome,Safari

### Dependencies

jQuery 2

### Usage

HTML

```html
<form id="uploadform">
	<div id="file_browse_wrapper" class="btn">
		Upload photo
		<input id="file-upload" type="file" name="userfile" multiple="true" />
	</div>
</form>
<br />
<ul id="files"></ul>
```

JS

```js

$('#album .upload').upload({
	url:'upload_url',
	list: '#files',
	item: item,
	progressor: '.progressor',
	progressBar: '.progress-bar',
	cancelButton: '.cancel',
	minWidth: 500,
	minHeight: 300,
	maxSize: 100000,
	maxLength: 20,
	allowedType:'jpg|png|jpeg|gif',
	onProgress:function(object){
		// $('#files li').eq(index).find('.progressor').text(progress);
	},
	onLengthError:function(){
		alert('you have reached the limit of 20 photos');
	},
	onSubmit: function(object){
			
	},
	onTypeError:function(object){
		alert(object.name + ' is not a correct file type');
	},
	onDimensionError: function(object){
		alert("image dimension has to be at least 650 x 350 or better");
	},
	onComplete: function(object, response){
		if(response.status=='success'){
			// upload success, do anything you want here.
			// object is the actual list item (photo) you can grab and do any sort of DOM manipulate.
		}
	}
});


```

Server

```php

	$file_name = $_SERVER['HTTP_X_FILE_NAME'];		
	$file_content = file_get_contents("php://input");
	$thumb_name = $file_name+ '_thumb.jpg';
	
	//if saved to server succesfully
	echo json_encode(array(
		'status'=>'success',
		'thumb'=>$,
	));
```

### Properties explaination

url

the page which will process file upload

fileList

The element that will contain your uploaded file, normally ul/ol

progressor

The element which will display the upload percentage (100%)

progressBar

is the progressbar

maxLength

is the amount of images are allowed to upload

maxSize

is maximum MB of an image allowed to upload (if set 2000, the maximum size will be 2MB)

minHeight

is the minimum height of the image. Set 0 for unlimit height

minWidth

is the minimum width of the image. Set 0 for unlimit width

allowedType

is the file extensions which are allowed to upload

onLengthError

is event happen when image not meet the maxLength limit

onSizeError

is event happen when image not meet the maxSize limit

onProgress

is event happens during transfering image to server

onCancel

is event happen after user click cancel uploading

onComple

is event happen when image complete transfering to server