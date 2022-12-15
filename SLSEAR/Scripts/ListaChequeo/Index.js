let general = {
    accion: 1,
    usuario: 0,
    cantcumple:0
};

function EjecutarDetalleInformacionGeneral() {
    
    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    var usuario = { iCodExtensionista: parseInt(general.usuario) };  

    //$('#propuesta').val(arreglousuario[6]);

    var entidad = {};
    entidad.iCodExtensionista = general.usuario;
    $.post(globals.urlWebApi + "api/Extensionista/ListarExtensionistaPorCodigo", entidad)
        .done((respuesta) => {
            $('#propuesta').val(respuesta.vNombrePropuesta);
        });


    $.post(globals.urlListarRequisitos, usuario)
        .done((respuesta) => {
            if (respuesta.length > 0) {                
                if (respuesta[0].iCodRequisito == 1) {                 
                    if (respuesta[0].bCumple) {
                        $('#ra').prop('checked', true);     
                        general.cantcumple++;
                    } else {
                        $('#rb').prop('checked', true);                    
                    }                        
                }
                if (respuesta[1].iCodRequisito == 2) {
                    if (respuesta[1].bCumple) {
                        $('#rc').prop('checked', true);
                        general.cantcumple++;
                    } else {
                        $('#rd').prop('checked', true);
                    }
                }
                if (respuesta[2].iCodRequisito == 3) {
                    if (respuesta[2].bCumple) {
                        $('#re').prop('checked', true);
                        general.cantcumple++;
                    } else {
                        $('#rf').prop('checked', true);
                    }
                }
                if (respuesta[3].iCodRequisito == 4) {
                    if (respuesta[3].bCumple) {
                        $('#rg').prop('checked', true);
                        general.cantcumple++;
                    } else {
                        $('#rh').prop('checked', true);
                    }
                }
                if (respuesta[4].iCodRequisito == 5) {
                    if (respuesta[4].bCumple) {
                        $('#ri').prop('checked', true);
                        general.cantcumple++;
                    } else {
                        $('#rj').prop('checked', true);
                    }
                }
                if (respuesta[5].iCodRequisito == 6) {
                    if (respuesta[5].bCumple) {
                        $('#rk').prop('checked', true);
                        general.cantcumple++;
                    } else {
                        $('#rl').prop('checked', true);
                    }
                }               
                //console.log("cantidad cumple"+general.cantcumple);
                general.accion = 2;
                $('#btndescargarrequisitos').removeAttr('disabled');      
            }            
        });

    var file = { iCodExtensionista: parseInt(general.usuario), iCodNombreArchivo: 1 };

    $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
        .done((respuesta) => {                
            //debugger;
            if (respuesta.length == 0) {
                $('#ahrefdescargar').attr('style', 'visibility:hidden');
                $('#ahrefeliminar').attr('style', 'visibility:hidden');
                $('#btncargarrequitos').removeAttr('disabled');
            } else {
                $('#btncargarrequitos').attr('disabled', 'disabled');
            }           
        });

    $('#btnguardar').on('click', function (e) {
        debugger;
        console.log($("input:radio:checked").length);
        
        if ($("input:radio:checked").length != 6) {
            notif({
                msg: "<b>Incorrecto:</b> Debe Seleccionar Requisitos",
                type: "error"
            });
        } else {
            general.cantcumple = 0;
            loadshow();
            var valorA = ObtenerValorRequisitos('radioA');
            var valorB = ObtenerValorRequisitos('radioB');
            var valorC = ObtenerValorRequisitos('radioC');
            var valorD = ObtenerValorRequisitos('radioD');
            var valorE = ObtenerValorRequisitos('radioE');
            var valorF = ObtenerValorRequisitos('radioF');

            var lista = new Array();

            var iCodExtensionista = parseInt(general.usuario);

            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorA.split('-')[1], bCumple: valorA.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorB.split('-')[1], bCumple: valorB.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorC.split('-')[1], bCumple: valorC.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorD.split('-')[1], bCumple: valorD.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorE.split('-')[1], bCumple: valorE.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorF.split('-')[1], bCumple: valorF.split('-')[0] == 1 ? true : false });

            $(lista).each(function (index, value) {
                if (value.bCumple) {
                    general.cantcumple++;
                }                
            })
            //console.log(general.cantcumple);
            //debugger;
            if (general.accion == 1) {
                $(lista).each(function (index, value) {
                    //console.log(value);
                    debugger;
                    $.post(globals.urlWebApi +"api/ListaChequeoRequisitos/InsertarListaChequeoRequisitos", value)
                        .done((respuesta) => {
                            if (respuesta.iCodListaChequeo == 0) {
                                loadhide();
                                notif({
                                    msg: "<b>Incorrecto:</b>Error al Registrar",
                                    type: "error"
                                });
                                return;
                            } else {
                                // grabacion de propuesta - inicio
                                var datos = { iCodExtensionista: general.usuario, vNombrePropuesta: $('#propuesta').val() };

                                $.post(globals.urlWebApi + "api/Extensionista/ActualizarPropuestaExtensionista", datos)
                                    .done((respuesta) => {
                                        console.log('registro propuesta');
                                        console.log(respuesta);
                                    }).fail((error) => {
                                        console.log(error);
                                    });
                                // grabacion de propuesta - fin
                                loadhide();
                                notif({
                                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                                    type: "success"
                                });
                                general.cantcumple = 0;
                                //$('#btnguardar').attr('disabled', true);
                                $('#btndescargarrequisitos').removeAttr('disabled');
                            }
                        }).fail((error) => {
                            console.log(error);
                        });
                });
            } else {

                $.post(globals.urlWebApi + "api/ListaChequeoRequisitos/ActualizarDardeBajaListaChequeoRequisitos", usuario)
                    .done((respuesta) => {            
                        debugger;
                        if (respuesta.iCodListaChequeo == 1) {

                            //debugger;
                            // grabacion de propuesta - inicio
                            var datos = { iCodExtensionista: general.usuario, vNombrePropuesta: $('#propuesta').val() };

                            $.post(globals.urlWebApi + "api/Extensionista/ActualizarPropuestaExtensionista", datos)
                                .done((respuesta) => {
                                    console.log('registro propuesta');
                                    console.log(respuesta);
                                }).fail((error) => {
                                    console.log(error);
                                });
                                                // grabacion de propuesta - fin

                            $(lista).each(function (index, value) {
                                //console.log(value);
                                $.post(globals.urlWebApi +"api/ListaChequeoRequisitos/InsertarListaChequeoRequisitos", value)
                                    .done((respuesta) => {
                                        if (respuesta.iCodListaChequeo == 0) {
                                            loadhide();
                                                                                     
                                            notif({
                                                msg: "<b>Incorrecto:</b>Error al Registrar",
                                                type: "error"
                                            });
                                            return;
                                        } else {
                                           

                                            loadhide();
                                            notif({
                                                msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                                                type: "success"
                                            });
                                            //$('#btnguardar').attr('disabled', true);
                                            $('#btndescargarrequisitos').removeAttr('disabled');
                                        }
                                    }).fail((error) => {
                                        console.log(error);
                                    });
                            });
                        }
                    });
            }
        }
    });
    $('#file').on('change', function () {
        var fileInput = document.getElementById('file');
        var filePath = fileInput.value;
        var allowedExtensions = /(.pdf)$/i;
        if (!allowedExtensions.exec(filePath)) {            
            notif({
                msg: "<b>Incorrecto:</b> Solo se Permite Archivos Pdf" ,
                type: "error"
            });
            fileInput.value = '';
            return false;
        } else {
            return true;
            //Image preview
            //if (fileInput.files && fileInput.files[0]) {
            //    var reader = new FileReader();
            //    reader.onload = function (e) {
            //        document.getElementById('imagePreview').innerHTML = '<img src="' + e.target.result + '"/>';
            //    };
            //    reader.readAsDataURL(fileInput.files[0]);
            //}
        }
    });
    $('#btndescargarrequisitos').on('click', function (e) {
        //debugger;
        if (general.cantcumple == 6) {
            var datos = { iCodExtensionista: general.usuario };

            openData('POST', globals.urldescargarrequisito, datos, '_blank');
        } else {
            notif({
                msg: "<b>InCorrecto:</b>Todos Los Requisitos Debe Cumplir",
                type: "error"
            });
        }        
    });

    $("#ahrefdescargar").on('click', function () {      
        //debugger;
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo:1  };

        $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
            .done((respuesta) => {                
                var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');                
            });
    });

    $('#ahrefeliminar').on('click', function () {        
                var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 1 };                
        $.post(globals.urlWebApi + "api/Archivo/EliminarArchivo", file)
                    .done((respuesta) => {
                        if (respuesta.iCodArchivos == 1) {                                                        
                            $('#ahrefdescargar').attr('style', 'visibility:hidden');
                            $('#ahrefeliminar').attr('style', 'visibility:hidden');
                            $('#btncargarrequitos').removeAttr('disabled');
                            notif({
                                msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                                type: "success"
                            });
                        }
                    });        
    });

    $('#btncargarrequitos').on('click', function (e) {
            
        if ($("#file").get(0).files.length > 0) {
            loadshow();
            var files = $("#file").get(0).files;
            var fileData = new FormData();

            fileData.append("file", files[0]);
            fileData.append("path", "SLSEAR\\");
            fileData.append("icodExtensionista", general.usuario);
            fileData.append("vRutaArchivo", files[0].name);
            fileData.append("iCodNombreArchivo", 1);
            $.ajax({
                type: "POST",
                url: globals.urlInsertarArchivo,                
                contentType: false, 
                processData: false, 
                data: fileData,
                success: function (result, status, xhr) {
                    //alert(result);
                    loadhide();
                    $('#file').val('');
                    $('#ahrefdescargar').removeAttr('style');
                    $('#ahrefeliminar').removeAttr('style');  
                    $('#btncargarrequitos').attr('disabled', 'disabled');
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
    
    function ObtenerValorRequisitos(grupo) {
        var valor = "";

        $("input:radio[name=" + grupo + "]:checked").each(function () {
            //debugger;
            var name = $(this).attr("id");
            valor = $("#" + name).val() + "-" + $(this).attr('data-idrequisito');;
        });

        console.log(valor);
        return valor
    }  
        
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

    cargarusuario(11);
    
    //$('#subitemmenu1').add("style", "color: #6c5ffc !important;");
    //$('#subitemmenu1').add("style", "background: #6c5ffc !important;");
}

