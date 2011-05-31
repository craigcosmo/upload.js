(function($){
	$.fn.ajaxUpload = function(options){
		
		var	html = '<li>';
				html += '<div class="progress-bar-container">';
					html +='<div class="progress-bar">';
					html +='</div>';
				html +='</div>';
			html +='</li>';
			
		var defaults = {
			fileList : '#file-list',
			listItem: html,
			url : '',
			progressBar:'.progress-bar',
			cancelButton:'.cancel-upload',
			browseButton:'#uploadLink',
			onSubmit:function(){},
			onProgress:function(){},
			onComplete:function(){},
			onCancel:function(){},
			onSizeError:function(){},
			onTypeError:function(){},
			onLengthError:function(){},
			onDimensionError:function(){},
			allowedType:0,
			maxLength:0,
			minWidth:0,
			minHeight:0,
			minSize:0,
			maxSize:0
		},
		o = $.extend({},defaults, options);
		return this.each(function(){
			
			var input = $(this);

			function uploadFile(file){
				$(o.fileList).append(o.listItem);
				var li = $(o.fileList).children().last(),
					cancel = li.find(o.cancelButton),
					bar = li.find(o.progressBar),
					index = li.index(),
					size = parseInt(file.size/1024,10),
				 	name = file.name,
					total,
					loaded,
					progress,
					response;
					
				o.onSubmit.call(this, name, size, index);
						
				var xhr = new XMLHttpRequest();
				
				// Update progress bar
				xhr.upload.addEventListener("progress", function (e) {
					if(bar.length){
						bar[0].style.width = (e.loaded / e.total) * 100 + "%";
					}
					progress = Math.round((e.loaded / e.total) * 100) + "%";
					loaded = parseInt(e.loaded/1024,10);
					o.onProgress.call(this, name, size, index, loaded, progress);
				}, false);
				
				// File uploaded
				xhr.addEventListener("load", function () {
					if(bar.length){
						bar[0].style.width = 100 + "%";//update progress bar to 100% in firefox
					}
					response = JSON.parse(xhr.responseText);
					o.onComplete.call(this, name, size, index, response);
				}, false);

				if(cancel.length){
					cancel[0].addEventListener("click", function(){
						xhr.abort();
						o.onCancel.call(this, name, size, index, loaded, progress);
					}, false);
				}

				xhr.open("post", o.url, true);
				
				// Set appropriate headers
				xhr.setRequestHeader("Content-Type", "application/json-rpc");
				xhr.setRequestHeader("X-File-Name", file.fileName);
				xhr.setRequestHeader("X-File-Size", file.fileSize);
				xhr.setRequestHeader("X-File-Type", file.type);
	
				// Send the file
				xhr.send(file);
			}
			
			function traverseFiles (files) {
				for (var i=0, l=files.length; i<l; i++) {
					if(o.allowedType.length && o.allowedType.match(files[i].type.toLowerCase().replace('image/', ''))==null){
						o.onTypeError.call(this, files[i].name);
					}
					else if(o.maxSize >0 && parseInt(files[i].size/1024) > o.maxSize){
						o.onSizeError.call(this, files[i].name);
					}
					else if(o.maxLength>0 && $(o.fileList).children().length >= o.maxLength){
						o.onLengthError.call(this, $(o.fileList).children().length);
					}
					else if (typeof FileReader !== "undefined"){
						getImgSize(files[i], function(file, width, height){
							if(o.minWidth>0 && width<o.minWidth){
								o.onDimensionError.call(this, file.name, width, height);
							}
							else if(o.minHeight>0 && height<o.minHeight){
								o.onDimensionError.call(this, file.name, width, height);
							}
							else if($(o.fileList).children().length >= o.maxLength){//needed double check items length
								o.onLengthError.call(this, $(o.fileList).children().length);	
							}
							else {
								uploadFile(file);
							}
						});
					}
					// safari5 not yet support file api so we need this line
					else{
						uploadFile(files[i]);
					}
				}
			}
			
			function getImgSize(file, whenReady){
				var reader = new FileReader();  
				reader.onload = function(evt) {
					var image = new Image();
					image.onload = function(evt) {
						var width = this.width;
						var height = this.height;
						if (whenReady) whenReady(file, width, height);
					};
					image.src = evt.target.result; 
				};
				reader.readAsDataURL(file);
			}

			input[0].addEventListener("change", function () {
				traverseFiles(this.files);
			}, false);
			
		});
	}
})(jQuery);
