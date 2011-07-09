#HTML5 AJAX upload

## Document

###Support

IE7+,FF3+,Chrome,Safari

###Requirement

jQuery 1.3+

###Usage

####Client

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

//detecting iE
IE='\v'=='v';

if(!IE){
	var	listitem = 	'<li>'+
						'<div class="progressor"></div>'+
						'<div class="progress-bar-container">'+
							'<div class="progress-bar">'+
							'</div>'+
						'</div>'+
						'<a class="cancel"></a>'+
					'</li>';
				
	$('#file-upload').ajaxUpload({
		url:'<?= site_url("demo/ajax_upload/uploadx") ?>',
		fileList: '#files',
		listItem: listitem,
		progressor: '.progressor',
		progressBar: '.progress-bar',
		cancelButton: '.cancel',
		minWidth: 110,
		minHeight: 86,
		maxSize: 10000,
		maxLength: 12,
		allowedType: 'jpg|png|jpeg|gif',
		onDimensionError: function(name, width, height){
			alert('File <span style="color:red">'+name+'</span> dimension is too small');
		},
		onLengthError: function(current_length){
			alert('Maximum upload limit is 12');
		},
		onSizeError: function(name){
			alert('File <span style="color:red">'+name+'</span> size is too big. Max is 10MB');
		},
		onTypeError: function(name){
			alert('File <span style="color:red">'+name+'</span> is not an image');
		},
		onSubmit: function(name, size, index){
			$('li').eq(index).append('<span class="oriname" title="'+name+'">'+name+'</span>');
		},
		onProgress: function(name, size, index, loaded, progress){
		
		},
		onCancel: function(name, size, index, loaded, progress){
			$('li').eq(index).remove();
		},
		onComplete: function(name, size, index, response){
			var i = response;
			if(i.status=='success'){
				$('li').eq(index).prepend('<img src="'+ i.thumb_name+'" /><br>');
				$('li').eq(index).find('.progress-bar-container').hide();
			}else{
				$('li').eq(index).remove();
				alert('upload fail');	
			}
		}
	});

}

if(IE){
	var	html = 	'<li>'+
					'<div class="progressor">0%</div>'+
					'<div class="progress-bar-container">'+
						'<div class="progress-bar">'+
						'</div>'+
					'</div>'+
				'</li>';
	$('#file-upload').ieAjaxUpload({
		fileList:'#files',
		listItem:html,
		progressor:'.progressor',
		progressBar:'.progress-bar',
		allowedType:'jpg|png|jpeg|gif',
		url:'<?= site_url("demo/ajax_upload/upload")?>',
		maxLength:12,
		onSubmit:function(name,index){
			$('li').eq(index).append('<span class="oriname" title="'+name+'">'+name+'</span>');
		},
		onTypeError:function(name, index){
			alert('File <span style="color:red">'+name+'</span> is not an image');
		},
		onLengthError:function(name, index){
			alert('Maximum upload limit is 12');
		},
		onComplete:function(name,index, response){
			var i = response;
			if(i.status=='success'){
				$('li').eq(index).prepend('<img src="'+i.thumb_name+'" />');
				$('li').eq(index).find('.progress-bar-container').hide();
			}else{
				$('li').eq(index).remove();
				alert('upload fail');	
			}
		}
	});
}

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