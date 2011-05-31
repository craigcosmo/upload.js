(function($){
	$.fn.ieAjaxUpload = function(options){
					
		var defaults = {
			responseType:'json',
			onSubmit:function(){},
			onComplete:function(){},
			onLengthError:function(){},
			allowedType:'',
			maxLength:0,
			fileList:'#files',
			url:''
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
				var index = $(o.fileList).children(':last').index() +1;
				if(o.maxLength>0 && items >= o.maxLength){
					o.onLengthError.call(this, name);
				}
				else if(o.allowedType.length && o.allowedType.match(ext)==null){
					o.onTypeError.call(this, name);
				}
				else{upload(name, index);form[0].reset();}//in ie when click on the background it auto aupload itself again so need to reset form so it has noting to upload
			});
			function upload(name, index){
				o.onSubmit.call(this, name, index);
				var frameName = 'frame'+count;
				input.after('<iframe id="'+frameName+'" name="'+frameName+'" style="display:none"></iframe>');
				form.attr('target',frameName).submit();
				$('#'+frameName).load(function(){
					$('#'+frameName).contents().find("body").html();
					var response = JSON.parse($('#'+frameName).contents().find("body").text());
//					if(o.responseType =='json'){
//						reponse  = JSON.parse(response);
//					}
					o.onComplete.call(this, name, index, response);
				});
				return false;
			}
						
		});
	}
})(jQuery);
