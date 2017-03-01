
class Upload{
	
	constructor(options){

		this.template = `<li>
							<div class="progress-container">
								<div class="progressor"></div>
								<div class="progress-bar-container">
									<div class="progress-bar">
									</div>
								</div>
								<div class="cancel">cancel</div>
							</div>
						</li>`


		this.defaults = {
			list : '',
			item: this.template,
			url : '',
			dropZone:'',
			progressor: '',
			progressBar:'.progress-bar',
			onSubmit:function(){},
			onProgress:function(){},
			onComplete:function(){},
			onSizeError:function(){},
			onTypeError:function(){},
			onLengthError:function(){},
			onDimensionError:function(){},
			onCancel:function(){},
			onCancelAll:function(){},
			onPause:function(){},
			onQueueComplete:function(){},
			allowedType:0,
			maxLength:0,
			minWidth:0,
			minHeight:0,
			minSize:0,
			maxSize:0
		}

		this.option = Object.assign(this.defaults, options)
		this.list = document.querySelector(this.option.list)
		this.ongoingCollection = []
		this.completedCollection = []
	}
	uploadFile(file){

		let list = this.list
		let object = this.createDomFromString(this.option.item)
		list.appendChild(object)

		let bar = object.querySelector(this.option.progressBar)
		let progressor = object.querySelector(this.option.progressor)
		progressor.innerHTML = '0%'

		let	size = parseInt(file.size/1024,10)
		let name = file.name
		let	total
		let	loaded = 0
		let	progress = '0%'
		let	progessFlow = '0%'
		let	path = URL.createObjectURL(file)
		let	index = Array.prototype.slice.call(list.children).indexOf(object)
		let	response
		let xhr = new XMLHttpRequest()
		this.ongoingCollection.push(xhr)

		console.log(index)

		object.name = name
		object.size = size
		object.path = path
		object.index = index
		object.progress = progress
		object.progessFlow = progessFlow
		object.loaded = loaded

		this.option.onSubmit.call(this, object)
				
		
		xhr.upload.onprogress = (e) => {
			object.progessFlow = progessFlow = (e.loaded / e.total) * 100 + '%'
			object.progress = progress = Math.round((e.loaded / e.total) * 100) + '%'
			object.loaded = loaded = parseInt(e.loaded/1024,10)
			// total = e.total *1024;

			// if(bar.length) bar.style.width = progessFlow;
			if(document.contains(bar)) bar.style.width = progessFlow
			if(document.contains(progressor)) progressor.innerHTML = progress

			this.option.onProgress.call(this, object)

		}

		xhr.onload = () => {
			if(document.contains(bar)) progress = bar.style.width = 100 + '%'
			if(document.contains(progressor)) progressor.innerHTML = progress

			// check if response is json object or text
			response = this.sortResponse(xhr.responseText)
			this.option.onComplete.call(this, object, response)
			this.completedCollection.push(object.index)
			if (this.completedCollection.length === this.ongoingCollection.length) {
				this.option.onQueueComplete.call(this)
			}
		}


		xhr.open('post', this.option.url, true)
		xhr.setRequestHeader('Content-Type', 'multipart/form-data') 
		// fix unicode character file name bug
		xhr.setRequestHeader('X-File-Name', unescape(encodeURIComponent(file.name))) 
		xhr.setRequestHeader('X-File-Size', file.size)
		xhr.setRequestHeader('X-File-Type', file.type)


		xhr.send(file)

		return xhr
		
	}
	cancel(object){
		// need to check first
		this.ongoingCollection[object.index].abort()
		this.ongoingCollection.splice(object.index, 1)
		this.option.onCancel.call(this, object)
		
	}
	validate(file){
		let valid = true

		let type= this.getFileType(file)

		var itemCount = this.list.children.length

		if(this.option.allowedType.length && !this.option.allowedType.match(type)){
			this.option.onTypeError.call(this, {name: file.name} )
			valid = false
		}

		if(this.option.maxSize >0 && parseInt(file.size/1024) > this.option.maxSize){
			this.option.onSizeError.call(this, {name: file.name})
			valid = false
		}
		if(this.option.maxLength>0 && itemCount >= this.option.maxLength){
			this.option.onLengthError.call(this, itemCount)
			valid = false
		}
		
		this.getImageSize(file, (file, width, height) => {

			if(this.option.minWidth>0 && width<this.option.minWidth){
				this.option.onDimensionError.call(this, {name :file.name, width: width, height: height})
				valid = false
			}
			if(this.option.minHeight>0 && height<this.option.minHeight){
				this.option.onDimensionError.call(this, {name :file.name, width: width, height: height})
				valid = false
			}
			if(itemCount >= this.option.maxLength){//needed double check items length
				this.option.onLengthError.call(this, itemCount)	
				valid = false
			}
		})

		return valid

	}
	traverseFile(files) {
		for (let i=0; i<files.length; i++) {
			this.validate(files[i]) && this.uploadFile(files[i])
		}
	}
	isImage(img){

	}
	createDomFromString(string){
		let div = document.createElement('div')
		div.innerHTML = string
		return div.firstChild
	}

	getImageSize(file, callback){
		let reader = new FileReader()  
		reader.onload = function(evt) {
			let image = new Image()
			image.onload = function(evt) {
				let width = this.width
				let height = this.height
				callback && callback(file, width, height)
			}
			image.src = evt.target.result 
		}
		reader.readAsDataURL(file)
	}

	getFileType(file){
		if(file.type.length>0) {
			return file.type.split('/')[1].toLowerCase().trim()
		}else{ return ''}
		// some file might have empty string, emptry string doesn't work with split, so throw error
	}
	sortResponse(response){
		let isJSON = true
		try {JSON.parse(response)} catch (e) {isJSON = false}
		return isJSON ? JSON.parse(response) : response
	}
}




