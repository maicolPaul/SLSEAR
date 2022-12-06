let general = {
    usuario: 0,
    iCodActividad:0,
    tblactividad: null,
    tblcosto: null,
    elementoSeleccionado: null,
    costoSeleccionado:null,
    accion:1
};

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    /**************************************************/

    $('#cboComponente').empty();
    $('#cboComponente').append("<option value=''>Seleccione</option>");
    debugger;
    $.when(obtenerComponentes({ iCodExtensionista: general.usuario }))
        .done((niveles) => {
            debugger;
            $.each(niveles, function (key, value) {
                $('#cboComponente').append("<option value='" + value.iCodComponente + "' data-value='" + JSON.stringify(value.iCodComponente) + "'>" + value.vDescripcion + "</option>");
            });
        });
    /***************************************************/

    $("#cboComponente").on('change', function (e) {
        general.tblactividad.clear().draw();
    });

    cargarusuario();
    //cargarcomponente();
    //$("#cboActividad").on('change', function (e) {
    //    console.log(e.currentTarget.value);
    //    $('#vmetaactividad').val($("#cboActividad").find(':selected').data('value'));
    //});
    //$('#cboComponente').on('change', function (e) {
    //    console.log(e.currentTarget.value);

    //    var tipoactividad = { iopcion: e.currentTarget.value, iCodExtensionista: general.usuario }

    //    $.post(globals.urlWebApi + "api/Cronograma/ListaActividades", tipoactividad)
    //        .done((distritos) => {
    //            $('#cboActividad').empty();
    //            $('#cboActividad').append("<option value=''>Seleccione</option>");
    //            $.each(distritos, function (key, value) {
    //                $('#cboActividad').append("<option value='" + value.iCodActividad + "' data-value='" + value.vMeta +"' data-resumen='"+value.resumen+"'>" + value.vActividad + "</option>");
    //            });
    //        }).fail((error) => {
    //        });
    //});

    $('#btnvistaprevia').on('click', function () {
        var datos = {};
        datos.iCodExtensionista = general.usuario;

        openData('POST', globals.urlWebApi + 'api/Costo/ExportarCosto', datos, '_blank');
    });

    $('#btnvistaprevia1').on('click', function () {
        var datos = {};
        datos.iCodExtensionista = general.usuario;

        openData('POST', globals.urlWebApi + 'api/Costo/ExportarFichaTecnica', datos, '_blank');
    });

    

    general.tblactividad = $("#tblactividad").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: false
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
                , pvSortColumn: "iCodActividad"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iCodIdentificacion: $("#cboComponente").val()
            };
            debugger;
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Costo/ListarActividad",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {
                    debugger;
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].iRecordCount : 0,
                        recordsFiltered: data.length !== 0 ? data[0].iRecordCount : 0
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
          /*  { data: "iCodCosto", title: "iCodCosto", visible: false, orderable: false },*/
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
           /* { data: "iCodComponente", title: "iCodComponente", visible: false, orderable: false },*/
            { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
            //{ data: "iTipoMatServ", title: "iTipoMatServ", visible: false, orderable: false },
            { data: "vActividad", title: "Actividad", visible: true, orderable: false },
            { data: "vDescripcion", title: "Descripcion", visible: false, orderable: false },
            { data: "vUnidadMedida", title: "Unidad Medida", visible: false, orderable: false },
            { data: "vMeta", title: "Meta", visible: false, orderable: false },
            { data: "vMedio", title: "Medio", visible: false, orderable: false },
            { data: "vDescripcionCorta", title: "Descripcion", visible: true, orderable: false },
            { data: "vUnidadMedidaCorta", title: "Unidad Medida", visible: true, orderable: false },
            { data: "vMetaCorta", title: "Meta", visible: true, orderable: false },
            { data: "vMedioCorta", title: "Medio", visible: false, orderable: false },
            { data: "dFecha", title: "Fecha Inicio", visible: true, orderable: false },
            { data: "dFechaFin", title: "Fecha Fin", visible: true, orderable: false },
            //{ data: "Estado", title: "Estado", visible: false, orderable: false },

            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick ="VerCostos(this);" data-toggle="tooltip" title="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="AgregarCosto(this);" data-toggle="tooltip" title="Agregar"><i class="bi bi-plus-circle-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCosto(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    general.tblcosto = $("#tblcosto").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: false
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
                , pvSortColumn: "iCodCosto"
                , pvSortOrder: "asc"
                , iCodActividad:general.elementoSeleccionado !== null ? general.elementoSeleccionado.iCodActividad : 0            
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Costo/ListarCosto",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].iRecordCount : 0,
                        recordsFiltered: data.length !== 0 ? data[0].iRecordCount : 0
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
            { data: "iCodCosto", title: "iCodCosto", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "iCodComponente", title: "iCodComponente", visible: false, orderable: false },
            { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
            { data: "iTipoMatServ", title: "iTipoMatServ", visible: false, orderable: false },
            { data: "TipoMatServ", title: "Tipo Mat/Serv", visible: true, orderable: false },
            { data: "vDescripcion", title: "Descripcion", visible: true, orderable: false },
            { data: "vUnidadMedida", title: "U. Med", visible: true, orderable: false },
            { data: "iCantidad", title: "Cant.", visible: true, orderable: false },
            { data: "dCostoUnitario", title: "Costo Unid", visible: true, orderable: false },
            //{ data: "dFecha", title: "Fecha", visible: false, orderable: false },
            { data: "Estado", title: "Estado", visible: false, orderable: false },           
             
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="MostrarEditar(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarCostos(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });



    //$('#btnagregar').on('click', function () {
    //    limpiar();
    //    general.accion = 1;
    //    $('#cboComponente').attr('disabled', false);
    //    $('#cboActividad').attr('disabled', false);
        
    //    $('#modalcostos').modal({ backdrop: 'static', keyboard: false });
    //    $('#modalcostos').modal('show');        
    //});

    $('#btneliminarcosto').on('click', function () {
        
        var datos = {};

        datos.iCodCosto = general.costoSeleccionado.iCodCosto;
        datos.iopcion = general.accion;

        $.post(globals.urlWebApi + "api/Costo/InsertarCosto", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblcosto.clear().draw();
                $('#modaleliminarcostos').modal('hide');
            }).fail((error) => {
                console.log(error);
            });   
    });

    $('#btnguardar').on('click', function () {
        var iCodCosto = general.costoSeleccionado == null ? 0 : general.costoSeleccionado.iCodCosto;
        var iTipoMatServ = $('#cboTipoServMat').val();
        var vDescripcion = $('#vdescripcion').val(); 
        var vUnidadMedida = $('#vUnidadMedida').val(); 
        var iCantidad = $('#iCantidad').val(); 
        var dCostoUnitario = $('#dCostoUnitario').val();
        //var dia = $('#vdia').val();

        if (iTipoMatServ == '') {
            notif({
                msg: "<b>Incorrecto:</b>Seleccionar Componente",
                type: "error"
            });
            $('#cboTipoServMat').focus();
            return;
        }

        if (vDescripcion.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar descripcion",
                type: "error"
            });
            $('#vDescripcion').focus();
            return;
        }

        if (vUnidadMedida.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar unidad de medida",
                type: "error"
            });
            $('#vUnidadMedida').focus();
            return;
        } 

        if (iCantidad.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar cantidad",
                type: "error"
            });
            $('#iCantidad').focus();
            return;
        } else {
            if (iCantidad <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El Valor de la cantidad debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }

        if (dCostoUnitario.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar costo unitario",
                type: "error"
            });
            $('#dCostoUnitario').focus();
            return;
        } else {
            if (parseFloat(dCostoUnitario) <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El valor del costo unitario debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }
        //sdsdsds

        //if ($('#vdia').val().trim() == '') {
        //    notif({
        //        msg: "<b>Incorrecto:</b>Ingresar Dia",
        //        type: "error"
        //    });
        //    $('#vdia').focus();
        //    return;
        //}



        //var cbocomponente = $('#cboComponente').val();
        //var metaActividad = $("#cboActividad").find(':selected').data('value');
        //debugger;

        //if (parseInt(iTipoMatServ) == 1) {
        //    if (parseInt(metaActividad) != parseInt(meta)) {
        //        notif({
        //            msg: "<b>Incorrecto:</b>La Meta debe Ser Igual a " + metaActividad,
        //            type: "error"
        //        });
        //        return;
        //    }
        //} else {
        //    var resumen = $("#cboActividad").find(':selected').data('resumen');
        //    var sumado =parseInt(resumen) +parseInt(meta);

        //    console.log(resumen);

        //    if (sumado > metaActividad) {

        //        notif({
        //            msg: "<b>Incorrecto:</b>El Limite es " + metaActividad + " , resumen es " +resumen,
        //            type: "error"
        //        });
        //        return;
        //    }
        //}

        var datos = {};
        datos.iCodCosto = general.elementoSeleccionado != null ? iCodCosto : 0;
        datos.iCodActividad = general.elementoSeleccionado.iCodActividad;
        datos.iTipoMatServ = parseInt(iTipoMatServ);
        datos.vDescripcion = vDescripcion;
        datos.vUnidadMedida = vUnidadMedida;
        datos.iCantidad = parseInt(iCantidad);
        datos.dCostoUnitario = parseFloat(dCostoUnitario);
        //datos.dFecha= dia;
        datos.iopcion = general.accion;
        
        if (general.accion == 2) {
            datos.iCodCosto = general.costoSeleccionado.iCodCosto;
        }       

        $.post(globals.urlWebApi + "api/Costo/InsertarCosto", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblcosto.clear().draw();
                $('#modalcostos').modal('hide');                
            }).fail((error) => {
                console.log(error);
            });        
    });
        
    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu24').css('color', '#6c5ffc');
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

function VerCostos(obj) {
    debugger;
    general.elementoSeleccionado = general.tblactividad.row($(obj).parents('tr')).data();
    general.tblcosto.clear().draw();
//    let table = document.getElementById('tblobjetivo');
//    table.deleteRow(indicefila);
}

function obtenerComponentes(data) {
    
    return $.ajax({
        type: "POST",
        url: globals.urlWebApi + "api/PlanCapacitacion/ComponentesPorExtensionista",
        headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ },
        dataType: 'json',
        data: data
    });
}

function limpiar() {
    $('#cboTipoServMat').val('');
    $('#vdescripcion').val('');
    $('#vUnidadMedida').val('');
    $('#iCantidad').val('');
    $('#dCostoUnitario').val('');
    //$('#vdia').val('');
   
}

function AgregarCosto(obj) {
    debugger;
    limpiar();
    general.accion = 1;
    general.elementoSeleccionado = general.tblactividad.row($(obj).parents('tr')).data();
    $('#vActividad').val(general.elementoSeleccionado.vActividad);
    //$('#vdia').val(general.elementoSeleccionado.dFecha);
    //$('#vdiaFin').val(general.elementoSeleccionado.dFechaFin);
    $('#modalcostos').modal({ backdrop: 'static', keyboard: false });
    $('#modalcostos').modal('show'); 
}

//function eliminarCostos(obj) {
//    var indicefila = obj.parentElement.parentElement.rowIndex;
//    let table = document.getElementById('tblobjetivo');
//    table.deleteRow(indicefila);
//}


function eliminarCostos(obj) {
    general.accion = 3;
    general.costoSeleccionado = general.tblcosto.row($(obj).parents('tr')).data();
    $('#modaleliminarcostos').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcostos').modal('show');    
}

function MostrarEditar(obj) {
    general.accion = 2;
    debugger;
    general.costoSeleccionado = general.tblcosto.row($(obj).parents('tr')).data();
    $('#cboTipoServMat').val(general.costoSeleccionado.iTipoMatServ);
    $('#vdescripcion').val(general.costoSeleccionado.vDescripcion);
    $('#vUnidadMedida').val(general.costoSeleccionado.vUnidadMedida);
    $('#iCantidad').val(general.costoSeleccionado.iCantidad);
    $('#dCostoUnitario').val(general.costoSeleccionado.dCostoUnitario);
    //$('#vdia').val(general.costoSeleccionado.dFecha);
    $('#modalcostos').modal({ backdrop: 'static', keyboard: false });
    $('#modalcostos').modal('show');
}

function EditarCosto(obj) {
    general.accion = 2;
    general.costoSeleccionado = general.tblcosto.row($(obj).parents('tr')).data();

    //$('#cboComponente').val(general.elementoSeleccionado.iCodComponente);

    //$('#cboComponente').attr('readonly', true);
    //$('#cboComponente').attr('disabled', true);
    //$('#cboActividad').attr('disabled', true);

    console.log(general.costoSeleccionado);

    var tipoactividad = { iopcion: general.elementoSeleccionado.iCodComponente, iCodExtensionista: general.usuario }

    $.post(globals.urlWebApi + "api/Costo/InsertarCosto", tipoactividad)
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

    $('#modalcronograma').modal('show');
}

//function cargarcomponente() {

//    var datos = { iCodExtensionista:general.usuario};

//    $.post(globals.urlWebApi + "api/Cronograma/ListarComponentes", datos)
//        .done((distritos) => {
//            $('#cboComponente').empty();
//            $('#cboComponente').append("<option value=''>Seleccione</option>");
//            $.each(distritos, function (key, value) {
//                $('#cboComponente').append("<option value='" + value.Codigo + "' data-value='" + JSON.stringify(value.Codigo) + "'>" + value.vDescComponente + "</option>");
//            });
//        }).fail((error) => {
//        });
//}

//function openData(verb, url, data, target) {
//    var form = document.createElement("form");
//    form.action = url;
//    form.method = verb;
//    form.target = target || "_self";
//    if (data) {
//        for (var key in data) {
//            var input = document.createElement("textarea");
//            input.name = key;
//            input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
//            form.appendChild(input);
//        }
//    }
//    form.style.display = 'none';
//    document.body.appendChild(form);
//    form.submit();
//}