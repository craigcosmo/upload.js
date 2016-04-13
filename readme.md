#HTML5 AJAX upload

## Document

###Support

IE9+,FF3+,Chrome,Safari

###Requirement

jQuery 1.3+

###Usage

####Clients

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

```js

$('#album .upload').upload({
	url:'<?= site_url("upload/index/".$this->uri->segment(3))?>',
	list: '#files',
	item: item,
	progressor: '.progressor',
	progressBar: '.progress-bar',
	cancelButton: '.cancel',
	// minWidth: 550,
	// minHeight: 330,
	minWidth: 500,
	minHeight: 300,
	// minHeight: 300,
	maxSize: 100000,
	maxLength: 20,
	allowedType:'jpg|png|jpeg|gif',
	onProgress:function(object){
		// $('#files li').eq(index).find('.progressor').text(progress);
	},
	onLengthError:function(){
		$.modal('you have reached the limit of 20 photos');
	},
	onSubmit: function(object){
		check();			
	},
	onTypeError:function(object){
		$.modal(object.name + ' is not a correct file type');
	},
	onDimensionError: function(object){
		$.modal("image dimension has to be at least 650 x 350 or better");
	},
	onComplete: function(object, response){
		if(response.status=='success'){

			// object.append('<img src="'+response.link+'">');
			var img = $('<span class="thumb">').css('background-image', 'url('+object.path+')');
			$(object).append('<span class="handler c"><i class="fa fa-bars"></i></span>');
			$(object).append(img);
			$(object).append('<a class="del" id="'+response.image_id+'" thumb="'+response.thumb+'" style="display:none">✕</a>');
			$(object).append('<a class="set" id="'+response.image_id+'" style="display:none">set default</a>');
			$(object).append('<a class="no">'+(object.index + 1)+'</a>');
			$(object).append('<textarea class="caption hide" placeholder="caption"></textarea>');


			$(object).find('.progress-container ').hide();


			_sort();

			// this is end of upload process, all images selected were uploaded
			if(object.index + 1 == $('#files li').length) {
				update_order();
				if (check() == true)  activate();
			}
		}
	}
});


```
####Server
```php
//detect browser
if(preg_match('/(MSIE|opera)/i',$_SERVER['HTTP_USER_AGENT']))
{
	//if IE we access the uploaded file like this
	$ori_name = $_FILES['userfile']['name'];
	$file = $_FILES['userfile']['tmp_name'];
	$thumb = 'thumb' + $ori_name;
	
	//if save succesfully
	echo json_encode(array(
		'status'=>'success',
		'thumb'=>$ori_name,
	));
}
else
{
	// if FF, Chrome, Safari we access the uploaded file like this
	$ori_name = $_SERVER['HTTP_X_FILE_NAME'];		
	$file = file_get_contents("php://input");
	$thumb = 'thumb' + $ori_name;
	
	//if save succesfully
	echo json_encode(array(
		'status'=>'success',
		'thumb'=>$ori_name,
	));
}
```
###Properties explaination

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