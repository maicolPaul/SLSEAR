let general = {
    tablaproductores: null,
    accion: 1,
    elementoSeleccionado: null,
    usuario:0
};

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 3 };

    $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
        .done((respuesta) => {
            if (respuesta.length == 0) {
                $('#ahrefdescargar').attr('style', 'visibility:hidden');
                $('#ahrefeliminar').attr('style', 'visibility:hidden');
                $('#btncargar').removeAttr('disabled');
            } else {
                $('#btncargar').attr('disabled', 'disabled');
            } 
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
            $('#tblComunidadOpa thead').attr('class', 'table-success');   
            //$('select[name="tblComunidadOpa_length"]').formSelect();
            //$('.tooltipped').tooltip();
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
                , iPerteneceOrganizacion: 0
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
                    if (row.iRecibioCapacitacion) {
                        return "SI";
                    } else {
                        return "NO";
                    }
                }, title: "Recibio Capacitación", visible: true, orderable: false
            },
            { data: "vNombreOrganizacion", title: "Nombre Organizacion", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarProductor(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarProductor(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: false, orderable: false
            }
        ]
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

    $('#btndescargar').on('click', function () {
        if (general.tablaproductores.data().length > 0) {
            let datos = {
                piPageSize: 40
                , piCurrentPage: 1
                , pvSortColumn: "iCodProductor"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iPerteneceOrganizacion: 0
            };

            openData('POST', globals.urlWebApi +"api/ListaChequeoRequisitos/GenerarPdfActaCompromiso", datos, '_blank');
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
            fileData.append("iCodNombreArchivo", 3);
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

    $("#ahrefdescargar").on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 3 };

        $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
            .done((respuesta) => {
                var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');
            });
    });

    $('#ahrefeliminar').on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 3 };
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

    cargarusuario();
    $('#menuformulacion').addClass('is-expanded');
    $('#submenuacreditacion').addClass('is-expanded');    
    $('#subitemmenu3').css('color', '#6c5ffc');    
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