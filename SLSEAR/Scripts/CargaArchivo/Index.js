function EjecutarDetalleInformacionGeneral() {
    $('#btndescargar').on('click', function (e) {
                
        //e.preventDefault();
        //window.location.href = "../../Plantilla/Prueba.xls";
    });

    $('#btncargar').on('click', function (e) {
        //$('#filedocumento').trigger('click');                      
        loadshow();
        var files = $("#file").get(0).files;
        var fileData = new FormData();
                

        fileData.append("file", files[0]);
        fileData.append("path", "SLSEAR\\");     
        fileData.append("icodExtensionista", $('#hdnusuario').val());
        fileData.append("vRutaArchivo", files[0].name);
        
        $.ajax({
            type: "POST",
            url: globals.urlInsertarArchivo,
            //dataType: "json",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,
            success: function (result, status, xhr) {
                //alert(result);
                loadhide();
                notif({
                    msg: "<b>Correcto:</b> Se Cargo Documento Correctamente",
                    type: "success"
                });
            },
            error: function (xhr, status, error) {
                alert(status);
            }
        });

    });
}