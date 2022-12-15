let general = {
    tablaproductores: null,
    accion: 1,
    elementoSeleccionado: null,
    usuario: 0
};

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 2 };

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

    $('#btnagregar').on('click', function () {            
        limpiar();
        $('#vDni').focus();
        $('#titulomodalproductor').html('Registrar Productor');
        $('#productormodal').modal({ backdrop: 'static', keyboard: false });
        $('#productormodal').modal('show');       
        
    });

    $('#btneliminarproductor').on('click', function () {
        if (general.elementoSeleccionado != null) {
            //alert('elimino');
            var entidad = {};

            entidad.iOpcion = general.accion;
            entidad.iCodProductor = general.elementoSeleccionado.iCodProductor;

            $.post(globals.urlWebApi + "api/ActaAlianzaEstrategica/InsertarProductor", entidad)
                .done((respuesta) => {
                    console.log('registro correctamente');
                    limpiar();
                    $('#modaleliminarproductor').modal('hide');
                    general.tablaproductores.clear().draw();
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });

                }).fail((error) => {
                    console.log(error);
                });
        }
    });

    $("#flexCheckDefault").change(function () {   
        //debugger;
        if (this.checked) {
            $("#vNombreOrganizacion").attr('readonly', false);            
            ControlRepresentante(2);
        } else {
            ControlRepresentante(1);
            $("#vNombreOrganizacion").attr('readonly', true);
            $("#vNombreOrganizacion").val('');            
        }
    })

    $('#btnguardarproductor').on('click', function () {     
        //debugger;
        if ($('#vDni').val().trim() == "") {
            notif({
                msg: "<b>Incorrecto:</b> Debe Ingresar Dni",
                type: "error"
            });
            $('#vDni').focus();
            return;
        }
        if ($('#vApellidosNombres').val().trim() == "") {
            notif({
                msg: "<b>Incorrecto:</b> Debe Ingresar Apellidos y Nombres",
                type: "error"
            });
            $('#vApellidosNombres').focus();
            return;
        }
        if ($('#iEdad').val().trim() == "") {
            notif({
                msg: "<b>Incorrecto:</b> Debe Ingresar Edad",
                type: "error"
            });
            $('#iEdad').focus();
            return;
        }
        if ($('#cbosexo').val() == "") {
            notif({
                msg: "<b>Incorrecto:</b> Debe Seleccionar Sexo",
                type: "error"
            });
            $('#cbosexo').focus();
            return;
        }
        if ($('#flexCheckDefault').is(':checked')) {
            if ($("#vNombreOrganizacion").val().trim() == "") {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Nombre de la Organizacioon",
                    type: "error"
                });
                $('#vNombreOrganizacion').focus();
                return;
            }            
        }

        var entidad = {};

        entidad.vApellidosNombres = $('#vApellidosNombres').val();
        entidad.vDni = $('#vDni').val();
        entidad.vCelular = $('#vCelular').val();
        entidad.iEdad = $("#iEdad").val();
        entidad.iSexo = $('#cbosexo').val();
        entidad.iPerteneceOrganizacion = $('#flexCheckDefault').is(':checked') ? 1 :0;
        entidad.vNombreOrganizacion = $('#flexCheckDefault').is(':checked') ? $("#vNombreOrganizacion").val() : "";
        entidad.iEsRepresentante = $('#flexCheckDefault1').is(':checked') ? 1 : 0;
        entidad.iRecibioCapacitacion = $('#flexCheckDefault2').is(':checked') ? 1 : 0;
        entidad.iCodExtensionista = general.usuario;

        entidad.iOpcion = general.accion;

        if (general.accion == 2) {
            entidad.iCodProductor = general.elementoSeleccionado.iCodProductor;
        }

        $.post(globals.urlWebApi + "api/ActaAlianzaEstrategica/InsertarProductor", entidad)
            .done((respuesta) => {
                console.log('registro correctamente');
                limpiar();
                $('#productormodal').modal('hide');
                general.tablaproductores.clear().draw(); 
                notif({
                    msg: "<b>Correcto:</b> se ha grabado correctamente",
                    type: "success"
                });
                                                
            }).fail((error) => {
                console.log(error);
            });

    });

    $("#ahrefdescargar").on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 2 };

        $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
            .done((respuesta) => {
                var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');
            });
    });

    $('#ahrefeliminar').on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 2 };
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

    general.tablaproductores = $("#tblComunidadOpa").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            //$('select[name="tblComunidadOpa_length"]').formSelect();
            //$('.tooltipped').tooltip();
            $('#tblComunidadOpa thead').attr('class', 'table-success');   
            $('[data-toggle="tooltip"]').tooltip();   
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodProductor"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iPerteneceOrganizacion:1                
            };      
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/ActaAlianzaEstrategica/ListarProductor",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {                    
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].totalRegistros : 0,
                        recordsFiltered: data.length !== 0 ? data[0].totalRegistros : 0                        
                    });
                    if (general.tablaproductores.data().length > 0) {
                        $('#btndescargar').removeAttr('disabled');   
                    }
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [
            //{ data: "Nro", title: "Nro", visible: true, orderable: false },
            { data: "iCodProductor", title: "iCodProductor", visible: false, orderable: false },            
            { data: "vApellidosNombres", title: "Apellidos y Nombres", visible: true, orderable: false },            
            { data: "vDni", title: "Dni", visible: true, orderable: false },
            { data: "vCelular", title: "Celular", visible: true, orderable: false },
            { data: "iEdad", title: "Edad", visible: true, orderable: false },            
             {
                 data: (row) => {
                     if (row.iSexo == 1) {
                         return "MASCULINO";
                     } else {
                         return "FEMENINO";
                     }                    
                }, title: "Sexo", visible: true, orderable: false
            },   
            { data: "iPerteneceOrganizacion", title: "iPerteneceOrganizacion", visible: false, orderable: false },
            {
                data: (row) => {
                    if (row.iEsRepresentante) {
                        return "SI";
                    } else {
                        return "NO";
                    }
                }, title: "Es Representante", visible: true, orderable: false
            },
            {
                data: (row) => {
                    if (row.iRecibioCapacitacion) {
                        return "SI";
                    } else {
                        return "NO";
                    }
                }, title: "Recibio Capacitación", visible: true, orderable: false
            },
            { data: "vNombreOrganizacion", title: "Nombre Organizacion", visible: true, orderable: false },                        
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarProductor(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarProductor(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $('#btndescargar').on('click', function () {
        if (general.tablaproductores.data().length > 0) {
            let datos = {
                piPageSize: 40
                , piCurrentPage: 1
                , pvSortColumn: "iCodProductor"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iPerteneceOrganizacion: 1
            };

            openData('POST', globals.urlWebApi +"api/ListaChequeoRequisitos/GenerarPdfAlianzaEstrategica", datos, '_blank');     
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
            fileData.append("iCodNombreArchivo", 2);
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
                    $('#file').val('');
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

    cargarusuario(12);
    //$('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    //$('#subitemmenu2').css('color', '#6c5ffc');    
}
function ControlRepresentante(op) {
    $('#divrepresentante').empty();
    var contenido = '';
    if (op == 1) {
        contenido = '<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault1" readonly="readonly" disabled onclick="javascript: return false;">';
        contenido = contenido + '<label class="form-check-label" for="flexCheckDefault1">Es Representante</label>';
    } else {
        contenido = '<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault1">';
        contenido = contenido + '<label class="form-check-label" for="flexCheckDefault1">Es Representante</label>';
    }
    $('#divrepresentante').append(contenido);
}
function ControlOrganizacion(op) {
    $('#divorganizacion').empty();
    var contenido = '';
    if (op==1) {
        contenido = '<input class="form-check-input" type="checkbox" id="flexCheckDefault">';
        contenido = contenido + '<label class="form-check-label" for="flexCheckDefault">Organizacion</label>';
    }
    $('#divorganizacion').append(contenido);
    $('#flexCheckDefault').trigger('change');
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
function EditarProductor(obj) {
    //debugger;
    limpiar();
    general.accion = 2;
    general.elementoSeleccionado = general.tablaproductores.row($(obj).parents('tr')).data();
    console.log(general.elementoSeleccionado);
    $('#vDni').val(general.elementoSeleccionado.vDni);
    $('#vApellidosNombres').val(general.elementoSeleccionado.vApellidosNombres);
    $('#vCelular').val(general.elementoSeleccionado.vCelular);
    $('#iEdad').val(general.elementoSeleccionado.iEdad);
    $('#cbosexo').val(general.elementoSeleccionado.iSexo);
    //debugger;
    if (general.elementoSeleccionado.iPerteneceOrganizacion == 1) {
        $('#flexCheckDefault').prop('checked', true);
        $("#vNombreOrganizacion").removeAttr('readonly');
    } else {
        $('#flexCheckDefault').prop('checked', false);
        $("#vNombreOrganizacion").attr('readonly', true);
        $("#vNombreOrganizacion").val('');
    }    
    if (general.elementoSeleccionado.iEsRepresentante == 1) {
        $('#flexCheckDefault1').prop('checked', true);
        $('#flexCheckDefault1').removeAttr('disabled');

    } else {
        $('#flexCheckDefault1').prop('checked', false);
    }

    if (general.elementoSeleccionado.iRecibioCapacitacion == 1) {
        $('#flexCheckDefault2').prop('checked', true);
        //$('#flexCheckDefault2').removeAttr('disabled');
    } else {
        $('#flexCheckDefault2').prop('checked', false);
    }

    $("#vNombreOrganizacion").val(general.elementoSeleccionado.vNombreOrganizacion);
    $('#titulomodalproductor').html('Editar Productor');
    $('#productormodal').modal({ backdrop: 'static', keyboard: false });
    $('#productormodal').modal('show');    
}
function eliminarProductor(obj) {
    general.accion = 3;
    general.elementoSeleccionado = general.tablaproductores.row($(obj).parents('tr')).data();

    $('#modaleliminarproductor').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarproductor').modal('show');        
}

function limpiar() {
    $('#vDni').val('');
    $('#vApellidosNombres').val('');
    $('#cbosexo').val('');
    //debugger;
    $('#flexCheckDefault').prop('checked', false);
    ControlRepresentante(1);
    $('#flexCheckDefault1').prop('checked', false);
    $('#flexCheckDefault2').prop('checked', false);
    //ControlOrganizacion(1);

    //ControlRepresentante(2);

    $('#iEdad').val('');
    $("#vNombreOrganizacion").val('');
    $('#vCelular').val('');
    //$('#flexCheckDefault').prop('checked', false);
    general.elementoSeleccionado = null;
    general.accion = 1;
}
