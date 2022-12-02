let general = {
    usuario: 0,
    tblcronograma: null,
    elementoSeleccionado: null,
    iCodIdentificacion:0,
    accion:1
};

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario();

    var dato = {};

    dato.iCodExtensionista = general.usuario;
    //debugger;
    $.post(globals.urlWebApi + "api/Identificacion/ListarIdentificacion", dato)
        .done((respuesta) => {
            console.log("Datos Identificacion");
            console.log(respuesta);
            if (respuesta.length > 0) {
                general.iCodIdentificacion = respuesta[0].iCodIdentificacion;

                $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
                    .done((Componentes) => {
                        $('#cboComponentefiltro').empty();
                        $('#cboComponentefiltro').append("<option value='0'>Seleccione</option>");
                        $.each(Componentes, function (key, value) {
                            $('#cboComponentefiltro').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                        });

                        $('#cboComponente').empty();
                        $('#cboComponente').append("<option value='0'>Seleccione</option>");
                        $.each(Componentes, function (key, value) {
                            $('#cboComponente').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                        });                        
                    }).fail((error) => {
                    });

            }
        }).fail((error) => {
            console.log(error);
        });

    //cargarcomponente();
    $("#cboActividad").on('change', function (e) {
        console.log(e.currentTarget.value);
        $('#vmetaactividad').val($("#cboActividad").find(':selected').data('value'));
    });
    $('#cboComponente').on('change', function (e) {
        console.log(e.currentTarget.value);

        var tipoactividad = { iopcion: e.currentTarget.value, iCodExtensionista: general.usuario }
        debugger;
        $.post(globals.urlWebApi + "api/Cronograma/ListaActividades", tipoactividad)
            .done((distritos) => {
                $('#cboActividad').empty();
                $('#cboActividad').append("<option value=''>Seleccione</option>");
                $.each(distritos, function (key, value) {
                    $('#cboActividad').append("<option value='" + value.iCodActividad + "' data-value='" + value.vMeta +"' data-resumen='"+value.resumen+"'>" + value.vActividad + "</option>");
                });
            }).fail((error) => {
            });
    });

    $('#btnvistaprevia').on('click', function () {
        //alert('vista previa');
        var datos = {};
        datos.iCodExtensionista = general.usuario;

        openData('POST', globals.urlWebApi + 'api/Cronograma/ExportarCronograma', datos, '_blank');
    });
    $('#cboComponentefiltro').on('change', function () {
        general.tblcronograma.clear().draw();
    });

    //$('#cboComponentefiltro').empty();
    //$('#cboComponentefiltro').append("<option value='0'>Seleccione</option>");
    //debugger;
    //$.when(obtenerComponentes({ iCodExtensionista: general.usuario }))
    //    .done((niveles) => {
    //        debugger;
    //        $.each(niveles, function (key, value) {
    //            $('#cboComponentefiltro').append("<option value='" + value.iCodComponente + "' data-value='" + JSON.stringify(value.iCodComponente) + "'>" + value.vDescripcion + "</option>");
    //        });
    //    });

    general.tblcronograma = $("#tblcronograma").DataTable({
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
                , pvSortColumn: "iCodCronograma"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario,
                iCodComponente: $('#cboComponentefiltro').val()
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Cronograma/ListarCronograma",
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
                    //if (general.tablaproductores.data().length > 0) {
                    //    $('#btndescargar').removeAttr('disabled');
                    //}
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [
            //{ data: "Nro", title: "Nro", visible: true, orderable: false },
            { data: "iCodCronograma", title: "iCodCronograma", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
            { data: "vActividad", title: "Actividad", visible: true, orderable: false },
            { data: "vUnidadMedida", title: "Unidad Medida", visible: true, orderable: false },
            { data: "vMeta", title: "Meta", visible: true, orderable: false },
            { data: "iCantidad", title: "Cantidad", visible: true, orderable: false },
            { data: "dFecha", title: "Fecha Inicio", visible: true, orderable: false },
            { data: "dFechaFin", title: "Fecha Fin", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarCronograma(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarCronograma(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });



    $('#btnagregar').on('click', function () {
        limpiar();
        general.accion = 1;
        $('#cboComponente').attr('disabled', false);
        $('#cboActividad').attr('disabled', false);
        
        $('#modalcronograma').modal({ backdrop: 'static', keyboard: false });
        $('#modalcronograma').modal('show');        
    });

    $('#btneliminarproductor').on('click', function () {
        
        var datos = {};

        datos.iCodCronograma = general.elementoSeleccionado.iCodCronograma;
        datos.iopcion = general.accion;

        $.post(globals.urlWebApi + "api/Cronograma/InsertarCronograma", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblcronograma.clear().draw();
                $('#modaleliminarcronograma').modal('hide');
            }).fail((error) => {
                console.log(error);
            });   
    });

    $('#btnguardardetalle').on('click', function () {

        var componente = $('#cboComponente').val();
        var actividad = $('#cboActividad').val();        
        var meta = $('#vmeta').val();
        var dia = $('#vdia').val();
        var diaFin = $('#vdiaFin').val();
        if ($('#cboComponente').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Seleccionar Componente",
                type: "error"
            });
            $('#cboComponente').focus();
            return;
        }
                if ($('#cboActividad').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Seleccione Actividad",
                type: "error"
            });
                    $('#vactividad').focus();
            return;
        }
   
        if ($('#vmeta').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Valor",
                type: "error"
            });
            $('#vmeta').focus();
            return;
        } else {
            if ($('#vmeta').val() == 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El Valor 0 es Invalido",
                    type: "error"
                });
                return;
            }
        }

        if ($('#vdia').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Fecha Inicio",
                type: "error"
            });
            $('#vdia').focus();
            return;
        }

        if ($('#vdiaFin').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Fecha Fin",
                type: "error"
            });
            $('#vdiaFin').focus();
            return;
        }

        var cbocomponente = $('#cboComponente').val();
        var metaActividad = $("#cboActividad").find(':selected').data('value');
        //debugger;

        if (parseInt(cbocomponente) == 1) {
            if (parseInt(metaActividad) != parseInt(meta)) {
                notif({
                    msg: "<b>Incorrecto:</b>La Meta debe Ser Igual a " + metaActividad,
                    type: "error"
                });
                return;
            }
        } else {
            debugger;
            var resumen = $("#cboActividad").find(':selected').data('resumen');
            var sumado =parseInt(resumen) +parseInt(meta);

            console.log(resumen);

            if (sumado > metaActividad) {

                notif({
                    msg: "<b>Incorrecto:</b>El Limite es " + metaActividad + " , resumen es " +resumen,
                    type: "error"
                });
                return;
            }
        }

        var datos = {};
        datos.iCodExtensionista=general.usuario;
        datos.iCodCronograma = 0;
        datos.iCodComponente = componente;
        datos.iCodActividad = actividad;
        datos.iCantidad = meta;
        datos.dFecha = dia;
        datos.dFechaFin = diaFin;
        datos.iopcion = general.accion;
        
        if (general.accion == 2) {
            datos.iCodCronograma = general.elementoSeleccionado.iCodCronograma;
        }       

        $.post(globals.urlWebApi + "api/Cronograma/InsertarCronograma", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>"+respuesta.vMensaje,
                    type: "success"
                });
                general.tblcronograma.clear().draw();
                $('#modalcronograma').modal('hide');                
            }).fail((error) => {
                console.log(error);
            });        
    });

    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu23').css('color', '#6c5ffc');  
}

function limpiar() {
    $('#cboComponente').val('0');
    $('#cboActividad').val('');
    $('#cboActividad').empty();
    $('#cboActividad').append("<option value=''>Seleccione</option>");
    $('#vunidadmedida').val('');
    $('#vmeta').val('');
    $('#vdia').val('');

}

function eliminarfila(obj) {
    var indicefila = obj.parentElement.parentElement.rowIndex;
    let table = document.getElementById('tblobjetivo');
    table.deleteRow(indicefila);
}
function eliminarCronograma(obj) {
    general.accion = 3;
    general.elementoSeleccionado = general.tblcronograma.row($(obj).parents('tr')).data();
    $('#modaleliminarcronograma').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcronograma').modal('show');    

}
function EditarCronograma(obj) {
    general.accion = 2;
    general.elementoSeleccionado = general.tblcronograma.row($(obj).parents('tr')).data();

    $('#cboComponente').val(general.elementoSeleccionado.iCodComponente);

    $('#cboComponente').attr('readonly', true);
    $('#cboComponente').attr('disabled', true);
    $('#cboActividad').attr('disabled', true);

    console.log(general.elementoSeleccionado);

    var tipoactividad = { iopcion: general.elementoSeleccionado.iCodComponente, iCodExtensionista: general.usuario }

    $.post(globals.urlWebApi + "api/Cronograma/ListaActividades", tipoactividad)
        .done((distritos) => {
            $('#cboActividad').empty();
            $('#cboActividad').append("<option value=''>Seleccione</option>");
            $.each(distritos, function (key, value) {
                $('#cboActividad').append("<option value='" + value.iCodActividad + "' data-value='" + JSON.stringify(value.vMeta) + "'>" + value.vActividad + "</option>");
            });
            $('#cboActividad').val(general.elementoSeleccionado.iCodActividad);
        }).fail((error) => {
            console.log(error);
        });
    $('#vmeta').val(general.elementoSeleccionado.iCantidad);
    $('#vdia').val(general.elementoSeleccionado.dFecha);
    $('#vdiaFin').val(general.elementoSeleccionado.dFechaFin);
    $('#modalcronograma').modal('show');
}
function cargarcomponente() {

    var datos = { iCodExtensionista:general.usuario};

    $.post(globals.urlWebApi + "api/Cronograma/ListarComponentes", datos)
        .done((distritos) => {
            $('#cboComponente').empty();
            $('#cboComponente').append("<option value=''>Seleccione</option>");
            $.each(distritos, function (key, value) {
                $('#cboComponente').append("<option value='" + value.Codigo + "' data-value='" + JSON.stringify(value.Codigo) + "'>" + value.vDescComponente + "</option>");
            });
        }).fail((error) => {
        });
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

function obtenerComponentes(data) {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/Identificacion/ListarComponentesSelect", headers: { Accept: "application/json" }, dataType: 'json', data: data });
}