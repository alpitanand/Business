Dropzone.options.myAwesomeDropzone = {
    paramName: "userPhoto", // The name that will be used to transfer the file
    maxFilesize: 20, // MB
    maxFiles: 1,
    acceptedFiles: ".jpeg,.jpg",
    dictDefaultMessage: 'Drag an image here to upload, or click to select one',
    init: function () {
        // Set up any event handlers
        console.log("Alpit");
        this.on("complete", function (file) { 
                if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    
                    setTimeout(function() {
                        //your code to be executed after 1 second
                        location.reload();
                      }, 2000);
                   
                  }
              

           

          });
    }
};