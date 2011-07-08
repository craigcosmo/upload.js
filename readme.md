#HTML5 AJAX upload

## Document

###Support

IE7+,FF3+,Chrome,Safari

###Requirement

jQuery 1.3+

###Usage

####Client

```css
.btn {
	color: #FFF;
	padding: 3px 10px;
	cursor: pointer;
	border: solid 1px #CCC;
	border-bottom: 0;
	border-top-right-radius: 4px;
	border-top-left-radius: 4px;
	line-height: 23px;
	font-family: Arial, Helvetica, sans-serif;
	color: #333333;
	background: -moz-linear-gradient(
		top,
		#ffffff 0%,
		#c4c4c4);
	background: -webkit-gradient(
		linear, left top, left bottom, 
		from(#ffffff),
		to(#c4c4c4));
	border-radius: 5px;
	border: 0px solid #6b6b6b;
	box-shadow:
		0px 1px 1px rgba(107,107,107,0.5),
		inset 0px 0px 1px rgba(046,046,046,0.7);
	text-shadow:
		0px 1px 1px #fff;
}
#file_browse_wrapper {
    //background: none repeat scroll 0 0 #FFFFFF;
    //color: #2058B5;
    display: block;
    float: left;
    font-size: 11px;
    overflow: hidden;
    //padding: 5px 0 0;
    position: relative;
    //width: 77px;
    margin:34px 0 0 40px;
}
#file-upload{
    cursor: pointer;
    font-size: 460px;
    margin: 0;
    opacity: 0;
    padding: 0;
    position: absolute; 
    right: 0;
    top: 0;
    z-index: 1;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
}
```

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
			$.modal('File <span style="color:red">'+name+'</span> is not an image');
		},
		onSubmit: function(name, size, index){
			$('li').eq(index).append('<span class="oriname" title="'+name+'">'+$.ellipsis(name,14)+'</span>');
		},
		onProgress: function(name, size, index, loaded, progress){
		
		},
		onCancel: function(name, size, index, loaded, progress){
			$('li').eq(index).fadeSlideWayRemove(120,120);
		},
		onComplete: function(name, size, index, response){
			
			var i = response;
			if(i.status=='success'){
				$('li').eq(index).prepend('<img src="'+ i.thumb_name+'" /><br>');
				$('li').eq(index).append('<a class="del" thumb="'+i.thumb_name+'" imageid="'+i.image_id+'" title="remove image"></a>');
				$('li').eq(index).find('.progress-bar-container').hide();
			}else{
				$('li').eq(index).remove();
				$.modal(i.error);	
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
			$('li').eq(index).append('<span class="oriname" title="'+name+'">'+$.ellipsis(name,15)+'</span>');
		},
		onTypeError:function(name, index){
			alert('File <span style="color:red">'+name+'</span> is not an image');
		},
		onLengthError:function(name, index){
			alert('Maximum upload limit is 12');
		},
		onComplete:function(name,index, i){
			if(i.status=='success'){
				$('li').eq(index).prepend('<img src="'+i.thumb_name+'" /><br>');
				$('li').eq(index).append('<a class="del" thumb="'+i.thumb_name+'" imageid="'+i.image_id+'" title="remove"></a>');
				$('li').eq(index).find('.progress-bar-container').hide();
			}else{
				$('li').eq(index).remove();
				alert(i.error);	
			}
		}
	});
}

```
####Server
```php
if(preg_match('/(MSIE|opera)/i',$_SERVER['HTTP_USER_AGENT']))
{
	$ori_name = $_FILES['userfile']['name'];
	$file = $_FILES['userfile']['tmp_name'];
	
	//if save succesfully
	echo json_encode(array(
		'status'=>'success',
		'thumb'=>$ori_name,
	));
}
else
{
	$ori_name = $_SERVER['HTTP_X_FILE_NAME'];		
	$file = file_get_contents("php://input");
	
	//if save succesfully
	echo json_encode(array(
		'status'=>'success',
		'thumb'=>$ori_name,
	));
}
```