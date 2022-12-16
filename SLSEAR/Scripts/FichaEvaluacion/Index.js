let general = {
    usuario: 0,
    iCodActividad:0,
    tblSearEvaluador: null,
    tblFichaEvaluacion: null,
    elementoSeleccionado: null,
    FichaEvaluacionSeleccionado:null,
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

    cargarusuario(11);
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
        //var datos = {};
        //datos.iCodExtensionista = general.usuario;

        //openData('POST', globals.urlWebApi + 'api/Costo/ExportarCosto', datos, '_blank');
    });

    

    general.tblSearEvaluador = $("#tblSearEvaluador").DataTable({
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
                , iCodComiteEvaluador: general.usuario
                , iCodIdentificacion: $("#cboComponente").val()
            };
            debugger;
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/FichaEvaluacion/ListarComiteIdentificacion",
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
            { data: "iCodComiteIdentificacion", title: "iCodComiteIdentificacion", visible: false, orderable: false },
            { data: "iCodComiteEvaluador", title: "iCodComiteEvaluador", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vNombreSearT1", title: "Nombre Sear", visible: true, orderable: false },
            { data: "vDireccionT2", title: "Direccion", visible: false, orderable: false },
            { data: "iCodUbigeoT1", title: "iCodUbigeoT1", visible: false, orderable: false },
            { data: "vNomDepartamento", title: "Departamento", visible: true, orderable: false },
            { data: "vNomProvincia", title: "Provincia", visible: true, orderable: false },
            { data: "vNomDistrito", title: "Distrito", visible: true, orderable: false },
            { data: "iCodExtensionista", title: "iCodExtensionista", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick ="VerFichaEvaluacion(this);" data-toggle="tooltip" title="Ver Evaluacion"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="DescargarFicha(this);" data-toggle="tooltip" title="Descargar Ficha"><i class="fa fa-print"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="DescargarG(this);" data-toggle="tooltip" title="Descargar Ficha"><i class="fa fa-print"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCosto(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    general.tblFichaEvaluacion = $("#tblFichaEvaluacion").DataTable({
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
                , iCodComiteEvaluador: general.elementoSeleccionado !== null ? general.elementoSeleccionado.iCodComiteEvaluador : 0   
                , iCodIdentificacion: general.elementoSeleccionado !== null ? general.elementoSeleccionado.iCodIdentificacion : 0  
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/FichaEvaluacion/ListarFichaEvaluacion",
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
            { data: "iCodFichaEvaluacion", title: "iCodFichaEvaluacion", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "iCodComiteEvaluador", title: "iCodComiteEvaluador", visible: false, orderable: false },
            { data: "iCodCategoria", title: "iCodCategoria", visible: false, orderable: false },
            { data: "vCategoria", title: "Categoria", visible: true, orderable: false },
            { data: "iCodCriterio", title: "iCodCriterio", visible: false, orderable: false },
            { data: "vCriterio", title: "Criterio", visible: true, orderable: false },
            { data: "vCriterio1", title: "vCriterio1", visible: false, orderable: false },
            { data: "PuntajeMaximo", title: "Puntaje Max.", visible: true, orderable: false },
            { data: "dPuntajeEvaluacion", title: "Puntaje Evaluacion", visible: true, orderable: false },
            { data: "vJustificacion", title: "Justificacion", visible: true, orderable: false },
            //{ data: "iCodExtensionista", title: "iCodExtensionista", visible: false, orderable: false },
            //{ data: "Estado", title: "Estado", visible: false, orderable: false },           
             
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="MostrarEditar(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCostos(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
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
        var iCodFichaEvaluacion = general.FichaEvaluacionSeleccionado == null ? 0 : general.FichaEvaluacionSeleccionado.iCodFichaEvaluacion;
        var iCodIdentificacion = general.elementoSeleccionado.iCodIdentificacion;
        var iCodComiteEvaluador = general.usuario;
        var iCodCategoria = general.FichaEvaluacionSeleccionado.iCodCategoria;
        var iCodCriterio = general.FichaEvaluacionSeleccionado.iCodCriterio;
        var PuntajeMaximo = general.FichaEvaluacionSeleccionado.PuntajeMaximo;
        var dPuntajeEvaluacion = $('#dPuntajeEvaluacion').val();
        var vJustificacion = $('#vJustificacion').val();
        //var iopcion = general.accion;

        if (parseFloat(PuntajeMaximo) < parseFloat(dPuntajeEvaluacion)) {
            notif({
                msg: "<b>Incorrecto:</b> El puntaje de evaluacion debe ser menor o igual al puntaje maximo",
                type: "error"
            });
            $('#dPuntajeEvaluacion').focus();
            return;
        }

        
        var datos = {};
        datos.iCodFichaEvaluacion = iCodFichaEvaluacion;
        datos.iCodIdentificacion = iCodIdentificacion;
        datos.iCodComiteEvaluador = iCodComiteEvaluador;
        datos.iCodCategoria = iCodCategoria;
        datos.iCodCriterio = iCodCriterio;
        datos.dPuntajeEvaluacion = parseFloat(dPuntajeEvaluacion);
        datos.vJustificacion = vJustificacion;
        //datos.dFecha= dia;
        
        
        if (datos.iCodFichaEvaluacion == 0) {
            datos.iopcion = 1;
        } else {
            datos.iopcion = 2;   
        }       

        $.post(globals.urlWebApi + "api/fichaEvaluacion/InsertarFichaEvaluacion", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblFichaEvaluacion.clear().draw();
                $('#modalFichaEva').modal('hide');                
            }).fail((error) => {
                console.log(error);
        });        
    });

    

    //$('#menuformulacion').addClass('is-expanded');
    ////$('#submenuacreditacion').addClass('is-expanded');
    //$('#subfichatecnica').addClass('is-expanded');
    //$('#subitemmenu23').css('color', '#6c5ffc');  
    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu27').css('color', '#6c5ffc');
}

function DescargarFicha(obj) {
    general.elementoSeleccionado = general.tblSearEvaluador.row($(obj).parents('tr')).data();
    var datos = {};
    datos.iCodExtensionista = general.elementoSeleccionado.iCodExtensionista;
    openData('POST', globals.urlWebApi + 'api/Costo/ExportarFichaTecnica', datos, '_blank');
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

function VerFichaEvaluacion(obj) {
    debugger;
    general.elementoSeleccionado = general.tblSearEvaluador.row($(obj).parents('tr')).data();
    general.tblFichaEvaluacion.clear().draw();
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
    $('#dPuntajeEvaluacion').val('');
    $('#vJustificacion').val('');
}

function AgregarCosto(obj) {
    //debugger;
    limpiar();
    general.elementoSeleccionado = general.tblactividad.row($(obj).parents('tr')).data();
    $('#vActividad').val(general.elementoSeleccionado.vActividad);
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
    $('#modaleliminarFichaEva').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcostos').modal('show');    
}

function MostrarEditar(obj) {
    //general.accion = 2;
    //debugger;
    general.FichaEvaluacionSeleccionado = general.tblFichaEvaluacion.row($(obj).parents('tr')).data();
    $('#vCategoria').val(general.FichaEvaluacionSeleccionado.vCategoria);
    $('#vCriterio').val(general.FichaEvaluacionSeleccionado.vCriterio1);
    $('#PuntajeMaximo').val(general.FichaEvaluacionSeleccionado.PuntajeMaximo);
    $('#dPuntajeEvaluacion').val(general.FichaEvaluacionSeleccionado.dPuntajeEvaluacion);
    $('#vJustificacion').val(general.FichaEvaluacionSeleccionado.vJustificacion);
    if (general.FichaEvaluacionSeleccionado.iCodFichaEvaluacion == 0) {
        limpiar();
    }
    //$('#vdia').val(general.costoSeleccionado.dFecha);
    $('#modalFichaEva').modal({ backdrop: 'static', keyboard: false });
    $('#modalFichaEva').modal('show');
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