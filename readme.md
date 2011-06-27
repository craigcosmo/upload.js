HTML5 AJAX upload

======

AJAX upload for browser that support HTML5

## Document

requirement

- jQuery 1.3+

Advanced usage
```js

$('#files-upload').ajaxUpload({
	url:'upload.php', //
	fileList:'#files',
	listItem:html,
	progressBar:'.progress-bar',
	cancelButton:'.cancel',
	minWidth:110,
	minHeight:86,
	maxSize:10000,
	maxLength:12,
	allowedType:'jpg|png|jpeg|gif',
	onDimensionError:function(name, width, height){
		
	},
	onLengthError:function(current_length){
		
	},
	onSizeError:function(name){
		
	},
	onTypeError:function(name){

	},
	onSubmit:function(name, size, index){
		
	},
	onProgress:function(name, size, index, loaded, progress){
		
	},
	onCancel:function(name, size, index, loaded, progress){
		
	},
	onComplete:function(name, size, index, i, target){
		
	}
});

```


IE AJAX upload

======

AJAX upload for Internet explorer 6,7,8,9

## Document

Advanced usage

```js

	$('#ieupload').ieAjaxUpload({
		fileList:'#files',
		allowedType:'jpg|png|jpeg|gif',
		url:'<?= site_url('sell/upload/'.$id)?>',
		maxLength:12,
		onSubmit:function(name,index){
			
		},
		onTypeError:function(name, index){
			
		},
		onLengthError:function(name, index){
			
		},
		onComplete:function(name,index, i){
			
		}
	});

```