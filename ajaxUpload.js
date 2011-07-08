(function($){
	$.fn.ajaxUpload = function(options){
		
		var	html = '<li>'+
						'<div class="progress-bar-container">'+
							'<div class="progress-bar">'+
							'</div>'+
						'</div>'+
					'</li>';
			
		var defaults = {
			fileList : '#file-list',
			listItem: html,
			url : '',
			progressor: '',
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
					progressor = li.find(o.progressor),
					index = li.index(),
					size = parseInt(file.size/1024,10),
				 	name = file.name,
					total,
					loaded,
					progress,
					response;
					
				o.onSubmit.call(this, name, size, index);
						
				var xhr = new XMLHttpRequest();
				progressor.text('0%');
				// Update progress bar
				xhr.upload.addEventListener("progress", function (e) {
					
					if(bar.length){
						bar[0].style.width = (e.loaded / e.total) * 100 + "%";
					}
					progress = Math.round((e.loaded / e.total) * 100) + "%";
					loaded = parseInt(e.loaded/1024,10);
					total = e.total *1024;
					if(progressor.length){
						progressor.text(progress);
					}
					o.onProgress.call(this, name, size, index, loaded, progress);
				}, false);
				
				// File uploaded
				xhr.addEventListener("load", function () {
					if(bar.length){
						//update progress bar to 100% in firefox
						//update progress number to display in the view
						progress = bar[0].style.width = 100 + "%";
						bar.hide();
					}
					if(progressor.length){
						progressor.text(progress).hide();
					}
					if(cancel.length){
						cancel.hide();
					}
					// loaded should be equal total by now
					loaded = total;
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
				//xhr.setRequestHeader("Content-Type", "application/json-rpc");
				xhr.setRequestHeader("Content-Type", "multipart/form-data"); 
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
	
	$.fn.ieAjaxUpload = function(options){
	
		var	html = 	'<li>'+
						'<div class="progressor">0%</div>'+
						'<div class="progress-bar-container">'+
							'<div class="progress-bar">'+
							'</div>'+
						'</div>'+
					'</li>';
					
		var defaults = {
			responseType:'json',
			onSubmit:function(){},
			onComplete:function(){},
			onLengthError:function(){},
			allowedType:'',
			maxLength:0,
			fileList:'#files',
			url:'',
			progressor:'.progressor',
			progressBar:'.progress-bar',
			listItem:html
		},
		o = $.extend({},defaults, options);
		return this.each(function(){
				
			var input = $(this);
			var form = input.closest('form');
			var count=0;
			
			form.attr('action',o.url);
			form.attr("enctype","multipart/form-data");
			form.attr("encoding","multipart/form-data");
			form.attr('method','POST');
			
			input.change(function(){
				count++;
				var name = input.val().replace(/^.*\\/, '');// remove possible path
				var ext = name.split('.').pop().toLowerCase();
				var items = $(o.fileList).children().length;
				
				if(o.maxLength>0 && items >= o.maxLength){
					o.onLengthError.call(this, name);
				}
				else if(o.allowedType.length && o.allowedType.match(ext)==null){
					o.onTypeError.call(this, name);
				}
				else{upload(name);form[0].reset();}//in ie when click on the background it auto aupload itself again so need to reset form so it has noting to upload
			});
			function upload(name){
				
				$(o.fileList).append(o.listItem);
				
				var frameName = 'frame'+count;
				var li = $(o.fileList).children().last();//?
				var index = li.index();
				var progressor = li.find(o.progressor);
				var bar = li.find(o.progressBar); 
				var progress;
				
				o.onSubmit.call(this, name, index);
				
				input.after('<iframe id="'+frameName+'" name="'+frameName+'" style="display:none"></iframe>');
				form.attr('target',frameName).submit();
				
				//making faux progress
				bar[0].style.width = '1%';
				progressor.text('1%');
				var timer = setInterval(function(){
						bar[0].style.width = parseFloat(bar[0].style.width) + 1 + '%';
						progressor.text(parseFloat(bar[0].style.width) + '%');

					if(parseFloat(bar[0].style.width)==100){
						clearInterval(timer);
					}
				}, 1000);
				
				$('#'+frameName).load(function(){
					$('#'+frameName).contents().find("body").html();
					if(o.responseType =='json'){
						var response = JSON.parse($('#'+frameName).contents().find("body").text());
					}else{
						var response = $('#'+frameName).contents().find("body").html();
					}
					o.onComplete.call(this, name, index, response);
					progressor.text('100%').hide();
					bar.css('width','100%').hide();
				});
				return false;
			}
						
		});
	}
})(jQuery);
