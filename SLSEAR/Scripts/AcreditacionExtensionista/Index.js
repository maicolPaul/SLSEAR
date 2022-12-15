let general = {
    usuario: 0
}

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 9 };

    $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
        .done((respuesta) => {
            //debugger;
            if (respuesta.length == 0) {
                $('#ahrefdescargar').attr('style', 'visibility:hidden');
                $('#ahrefeliminar').attr('style', 'visibility:hidden');
                $('#btncargar').removeAttr('disabled');
            } else {
                $('#btncargar').attr('disabled', 'disabled');
            }
        });

    $('#btncargar').on('click', function () {
        if ($("#file").get(0).files.length > 0) {
            loadshow();
            var files = $("#file").get(0).files;
            var fileData = new FormData();

            fileData.append("file", files[0]);
            fileData.append("path", "SLSEAR\\");
            fileData.append("icodExtensionista", general.usuario);
            fileData.append("vRutaArchivo", files[0].name);
            fileData.append("iCodNombreArchivo", 9);
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Archivo/InsertarArchivo",
                //dataType: "json",
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: fileData,
                success: function (result, status, xhr) {
                    //alert(result);
                    loadhide();
                    $('#file').val('');
                    //debugger;
                    $('#ahrefdescargar').removeAttr('style');
                    $('#ahrefeliminar').removeAttr('style');
                    $('#btncargar').attr('disabled', 'disabled');
                    notif({
                        msg: "<b>Correcto:</b> Se Cargo Documento Correctamente",
                        type: "success"
                    });
                },
                error: function (xhr, status, error) {
                    alert(status);
                }
            });
        } else {
            notif({
                msg: "<b>Incorrecto:</b> Debe Adjuntar Archivo",
                type: "error"
            });
        }
    });

    $("#ahrefdescargar").on('click', function () {

        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 9 };

        $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
            .done((respuesta) => {
                var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');
            });
    });
    $('#file').on('change', function () {
        var fileInput = document.getElementById('file');
        var filePath = fileInput.value;
        var allowedExtensions = /(.pdf)$/i;
        if (!allowedExtensions.exec(filePath)) {
            notif({
                msg: "<b>Incorrecto:</b> Solo se Permite Archivos Pdf",
                type: "error"
            });
            fileInput.value = '';
            return false;
        } else {
            return true;
        }
    });
    $('#ahrefeliminar').on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 9 };
        $.post(globals.urlWebApi + "api/Archivo/EliminarArchivo", file)
            .done((respuesta) => {
                if (respuesta.iCodArchivos == 1) {
                    $('#ahrefdescargar').attr('style', 'visibility:hidden');
                    $('#ahrefeliminar').attr('style', 'visibility:hidden');
                    $('#btncargar').removeAttr('disabled');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });
    function openData(verb, url, data, target) {
        var form = document.createElement("form");
        form.action = url;
        form.method = verb;
        form.target = target || "_self";
        if (data) {
            for (var key in data) {
                var input = document.createElement("textarea");
                input.name = key;
                input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                form.appendChild(input);
            }
        }
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
    }
 
    cargarusuario(18);
    //$('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    //$('#subitemmenu8').css('color', '#6c5ffc');    
}