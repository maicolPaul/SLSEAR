let general= {
    tblcomiteevaluador: null,
    elementoSeleccionado: null,
    accion:1
};

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario();

    general.tblcomiteevaluador = $("#tblcomiteevaluador").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            $('#tblobjetivo thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodComiteEvaluador"
                , pvSortOrder: "asc"               
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/ComiteEvaluador/ListarComiteEvaluador",
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
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [
            { data: "iCodComiteEvaluador", title: "iCodComiteEvaluador", visible: false, orderable: false },
            { data: "vNombres", title: "Nombres", visible: true, orderable: false },
            { data: "vApellidoPat", title: "Apellido Paterno", visible: true, orderable: false },
            { data: "vApellidoMat", title: "Apellido Materno", visible: true, orderable: false },
            { data: "iCodTipoDoc", title: "iCodTipoDoc", visible: false, orderable: false },
            { data: "vNroDocumento", title: "Nro Documento", visible: true, orderable: false },
            { data: "vCodUbigeo", title: "Ubigeo", visible: false, orderable: false },
            { data: "vNomDepartamento", title: "Departamento", visible: true, orderable: false },
            { data: "vNomProvincia", title: "Provincia", visible: true, orderable: false },
            { data: "vNomDistrito", title: "Distrito", visible: true, orderable: false },
            { data: "iCodCargo", title: "iCodCargo", visible: false, orderable: false },
            { data: "vDescripcionCargo", title: "Cargo", visible: true, orderable: false },
            { data: "vCelular", title: "Celular", visible: true, orderable: false },
            { data: "vCorreo", title: "Correo", visible: true, orderable: false },
            { data: "iCodArchivos", title: "iCodArchivos", visible: false, orderable: false },
            { data: "Estado", title: "Estado", visible: true, orderable: false },            
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarIndicador(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarComiteEvaluador(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $('#btneliminarcomite').on('click', function () {
        //alert('elimino');

        let datos = {};

        datos.iopcion = general.accion;
        datos.iCodComiteEvaluador = general.elementoSeleccionado.iCodComiteEvaluador;

        $.post(globals.urlWebApi + "api/ComiteEvaluador/InsertarComiteEvaluador", datos)
            .done((respuesta) => {
                if (respuesta.iCodComiteEvaluador != 0) {
                    //debugger;
                    general.tblcomiteevaluador.draw().clear();
                    $('#modaleliminarcomite').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });

    });
    $('#btngrabarcomite').on('click', function () {
        
        if ($('#cbotipodocumento').val() == '') {
            $('#cbotipodocumento').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe seleccionar Tipo de Documento",
                type: "error"
            });
            return;
        }

        if ($('#txtdni').val() == '') {
            $('#txtdni').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe ingresar Nro Documento",
                type: "error"
            });
            return;
        }

        if ($('#txtnombres').val() == '') {
            $('#txtnombres').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe ingresar Nombres",
                type: "error"
            });
            return;
        }

        if ($('#txtapemat').val() == '') {
            $('#txtapemat').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe ingresar Apellido Materno",
                type: "error"
            });
            return;
        }

        if ($('#txtapepat').val() == '') {
            $('#txtapepat').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe ingresar Apellido Materno",
                type: "error"
            });
            return;
        }

        if ($('#cbodepartamento').val() == '') {
            $('#cbodepartamento').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe seleccionar Departamento",
                type: "error"
            });
            return;
        }

        if ($('#cboprovincia').val() == '') {
            $('#cboprovincia').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe seleccionar Provincia",
                type: "error"
            });
            return;
        }

        if ($('#cbodistrito').val() == '') {
            $('#cbodistrito').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe seleccionar Distrito",
                type: "error"
            });
            return;
        }

        if ($('#cbocargo').val() == '') {
            $('#cbocargo').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe seleccionar Cargo",
                type: "error"
            });
            return;
        }

        if ($('#txtcelular').val() == '') {
            $('#txtcelular').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe ingresar celular",
                type: "error"
            });
            return;
        }

        if ($('#txtcorreo').val() == '') {
            $('#txtcorreo').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe ingresar correo",
                type: "error"
            });
            return;
        }


        let datos = {};

        datos.iopcion = general.accion;
        datos.vNombres = $('#txtnombres').val();
        datos.vApellidoPat = $('#txtapepat').val();
        datos.vApellidoMat = $('#txtnombres').val();
        datos.iCodTipoDoc = $('#cbotipodocumento').val();
        datos.vNroDocumento = $('#txtdni').val();
        datos.vCodUbigeo = $('#cbodistrito').val();
        datos.iCodCargo = $('#cbocargo').val();
        datos.vCelular = $('#txtcelular').val();
        datos.vCorreo = $('#txtcorreo').val();
        datos.iCodArchivos = 0;
        datos.iopcion = 1;

        if ($("#file").get(0).files.length > 0) {
            alert('adjunto archivo');
        } else {
            alert('no adjunto archivo');
        }

        if ($("#file").get(0).files.length > 0) {
            //loadshow();
            var files = $("#file").get(0).files;
            var fileData = new FormData();

            fileData.append("file", files[0]);
            fileData.append("path", "SLSEAR\\");
            fileData.append("icodExtensionista", general.usuario);
            fileData.append("vRutaArchivo", files[0].name);
            fileData.append("iCodNombreArchivo", 6); // 6 : documento CV
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Archivo/InsertarArchivo",
                //dataType: "json",
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: fileData,
                success: function (result, status, xhr) {
                    //alert(result);
                    console.log(result);
                    //loadhide();                   
                    if (result.iCodArchivos > 0) {
                        datos.iCodArchivos = result.iCodArchivos;
                         $.post(globals.urlWebApi + "api/ComiteEvaluador/InsertarComiteEvaluador", datos)
                            .done((respuesta) => {
                                if (respuesta.iCodComiteEvaluador != 0) {
                                    debugger;
                                    general.tblcomiteevaluador.draw().clear();
                                    $('#modalcomiteevaluador').modal('hide');
                                    notif({
                                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                                        type: "success"
                                    });
                                }
                            });
                    }

                    $('#file').val('');
                    //debugger;
                    //$('#ahrefdescargar').removeAttr('style');
                    //$('#ahrefeliminar').removeAttr('style');
                    //$('#btncargar').attr('disabled', 'disabled');
                    notif({
                        msg: "<b>Correcto:</b> Se Cargo Documento Correctamente",
                        type: "success"
                    });
                },
                error: function (xhr, status, error) {
                    alert(status);
                }
            });
        }

       
    });

    $('#btnagregarcomite').on('click', function () {
        general.accion = 1;        
        limpiar();
        $('#modalcomiteevaluador').modal({ backdrop: 'static', keyboard: false });
        $('#modalcomiteevaluador').modal('show');          
    });

    $('#cbodepartamento').on('change', function (e) {             
        $('#cboprovincia').empty();
        $('#cboprovincia').append("<option value='' label='Seleccione'>Seleccione</option>");

        $('#cbodistrito').empty();
        $('#cbodistrito').append("<option value='' label='Seleccione'>Seleccione</option>");

        $.post(globals.urlUbigeoProvincia, { vCodDepartamento: e.target.value })
            .done((respuesta) => {                
                $.each(respuesta, function (key, value) {
                    $('#cboprovincia').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                });
            });
    });

    $('#cboprovincia').on('change', function (e) {
        $('#cbodistrito').empty();
        $('#cbodistrito').append("<option value='' label='Seleccione'>Seleccione</option>");

        $.post(globals.urlUbigeoDistrito, { vCodProvincia: e.target.value })
            .done((respuesta) => {
                $.each(respuesta, function (key, value) {
                    //$('#cbodistrito').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                    $('#cbodistrito').append("<option value='" + value.vCodDistrito + "' data-value='" + JSON.stringify(value.vCodDistrito) + "'>" + value.vNomDistrito + "</option>");
                });
            });

    });

    $.post(globals.urlUbigeoDepartamento)
        .done((respuesta) => {
            //debugger;
            $.each(respuesta, function (key, value) {
                $('#cbodepartamento').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
            });
        });

    $.post(globals.urlWebApi + "api/ComiteEvaluador/ListarCargo")
        .done((respuesta) => {
            //debugger;
            $.each(respuesta, function (key, value) {
                $('#cbocargo').append("<option value='" + value.iCodCargo + "' data-value='" + JSON.stringify(value.iCodCargo) + "'>" + value.vDescripcion + "</option>");
            });
        });
}

function EliminarComiteEvaluador(obj) {
    general.elementoSeleccionado = general.tblcomiteevaluador.row($(obj).parents('tr')).data();    
    console.log(general.elementoSeleccionado);
    general.accion = 3;
    $('#modaleliminarcomite').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcomite').modal('show');      
}

function obtenerRegion(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoDepartamento, headers: { Accept: "application/json" }, dataType: 'json', data: data });
}

function limpiar() {
    $('#cbotipodocumento').val('');
    $('#txtdni').val('');
    $('#txtnombres').val('');
    $('#txtapemat').val('');
    $('#txtapepat').val('');
    $('#cbodepartamento').val('');
    $('#cboprovincia').val('');
    $('#cbodistrito').val('');
    $('#cbocargo').val('');
    $('#txtcelular').val('');
    $('#txtcorreo').val('');
}