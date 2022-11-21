
let general = {
    usuario: 0,
    tbltecnologias:null,
    listaindicadores:[],
    indiceseleccionado: 0,
    tractual: null,
    iCodIdentificacion: 0,
    accion: 1,
    acciongeneral: 1,
    listacausasdirectas: [],
    indiceseleccionadodirecta: 0,
    listaefectosdirectos: [],
    listacomponente: [],
    listaactividades: [],
    tblcomponentes: null,
    elementoSeleccionado: null,
    elementoSeleccionadoActividad: null,
    elementoSeleccionadoTecnologia:null,
    iCodComponente: null,
    tblactividades: null,
    iCodActividad: null,
    tblcausadirectas: null,
    elementoSeleccionadoCausaDirecta: null,
    tblcausasindirectas: null,
    iCodCausaDirecta: null,
    iCodCausaIndirecta: null,
    tblefectosdirectos: null,
    elementoSeleccinadoEfectoDirecto: null,
    tblcausasefectosindirectas: null,
    iCodEfecto: null,
    iCodEfectoIndirecto: null,
    tblindicadores: null,
    elementoSeleccionadoIndicador:null
};

function Indicadores() {

    //tblobjetivo
    general.tblindicadores = $("#tblobjetivo").DataTable({
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
                , pvSortColumn: "iCodIndicador"
                , pvSortOrder: "asc"
                , iCodIdentificacion: general.iCodIdentificacion
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Identificacion/ListarIndicadoresPaginado",
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
            { data: "iCodIndicador", title: "iCodIndicador", visible: false, orderable: false },
            { data: "iCodigoIdentificador", title: "iCodigoIdentificador", visible: false, orderable: false },
            { data: "vDescIdentificador", title: "Descripcion", visible: true, orderable: false },
            { data: "vUnidadMedida", title: "Unidad Medida", visible: true, orderable: false },
            { data: "vMeta", title: "Meta", visible: true, orderable: false },
            { data: "vMedioVerificacion", title: "Medio Verificacion", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarIndicador(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarIndicador(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;                    
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });


}

function EfectosDirectos() {
    general.tblefectosdirectos = $("#tblefectosdirectos").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            $('#tblefectosdirectos thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodEfecto"
                , pvSortOrder: "asc"
                , iCodIdentificacion: general.iCodIdentificacion
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Identificacion/ListarEfectoDirecto",
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
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: "iCodEfecto", title: "iCodEfecto", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vDescEfecto", title: "Descripcion", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarEfectoDirecto(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarEfectoDirecto(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="agregarEfectoIndirecto(${row.iCodEfecto});"  data-toggle="tooltip" title="Agregar Efecto Indirecto"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $('#tblefectosdirectos tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = general.tblefectosdirectos.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format2(row.data())).show();
            console.log(row.data());
            tr.addClass('shown');
            CargarEfectosIndirectos(row.data().iCodEfecto);
        }
    });
}

function CargarEfectosIndirectos(iCodEfecto) {
    if (!$.fn.dataTable.isDataTable('#tblcausasefectosindirectas' + iCodEfecto)) {
        general.tblcausasefectosindirectas = $('#tblcausasefectosindirectas' + iCodEfecto).DataTable({
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
                $('#tblcausasefectosindirectas' + iCodEfecto + ' thead').attr('class', 'table-success');
                $('[data-toggle="tooltip"]').tooltip();
            }
            , language: globals.lenguajeDataTable
            , ajax: function (data, callback, settings) {
                let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
                let parametro = {
                    piPageSize: parseInt(settings._iDisplayLength)
                    , piCurrentPage: paginaActual
                    , pvSortColumn: "iCodEfectoIndirecto"
                    , pvSortOrder: "asc"
                    , iCodIdentificacion: general.iCodIdentificacion,
                      iCodEfectoDirecto: iCodEfecto
                };
                $.ajax({
                    type: "POST",
                    url: globals.urlWebApi + "api/Identificacion/ListarEfectoIndirecto",
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
                { data: "iCodEfectoIndirecto", title: "iCodEfectoIndirecto", visible: false, orderable: false },
                { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
                { data: "iCodEfectoDirecto", title: "iCodEfectoDirecto", visible: false, orderable: false },
                { data: "vDescEfectoIndirecto", title: "vDescEfectoIndirecto", visible: true, orderable: false },
                {
                    data: (row) => {
                        let acciones = `<div class="nav-actions">`;
                        acciones += `<a href="javascript:void(0);" onclick ="EditarEfectoIndirecto(${row.iCodEfectoIndirecto},${row.iCodEfectoDirecto},'${row.vDescEfectoIndirecto}');" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                        acciones += `<a href="javascript:void(0);" onclick ="EliminarEfectoIndirecto(${row.iCodEfectoIndirecto},${row.iCodEfectoDirecto});"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                        acciones += `</div>`;
                        return acciones;
                    }, title: "Acciones", visible: true, orderable: false
                }
            ]
        });
    } else {
        general.tblcausasindirectas.draw().clear();
    }
}
function CausasDirectas() {
    general.tblcausasdirectas = $("#tblcausasdirectas").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {            
            $('#tblcausasdirectas thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodCausaDirecta"
                , pvSortOrder: "asc"
                , iCodIdentificacion: general.iCodIdentificacion
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Identificacion/ListarCausasDirectas",
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
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: "iCodCausaDirecta", title: "iCodCausaDirecta", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vdescrcausadirecta", title: "Descripcion", visible: true, orderable: false },            
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="EditarCausaDirecta(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarCausaDirecta(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="agregarCausaIndirecta(${row.iCodCausaDirecta},${row.iCodIdentificacion});"  data-toggle="tooltip" title="Agregar Causa Indirecta"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;                    
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $('#tblcausasdirectas tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = general.tblcausasdirectas.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format1(row.data())).show();
            console.log(row.data());
            tr.addClass('shown');
            CargarCausasIndirectas(row.data().iCodCausaDirecta, row.data().iCodIdentificacion);
        }
    });

}
function CargarCausasIndirectas(iCodCausaDirecta, iCodComponente) {
    if (!$.fn.dataTable.isDataTable('#tblcausasindirectas' + iCodCausaDirecta)) {
        general.tblcausasindirectas = $('#tblcausasindirectas' + iCodCausaDirecta).DataTable({
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
                $('#tblcausasindirectas' + iCodCausaDirecta + ' thead').attr('class', 'table-success');
                $('[data-toggle="tooltip"]').tooltip();
            }
            , language: globals.lenguajeDataTable
            , ajax: function (data, callback, settings) {
                let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
                let parametro = {
                    piPageSize: parseInt(settings._iDisplayLength)
                    , piCurrentPage: paginaActual
                    , pvSortColumn: "iCodCausaIndirecta"
                    , pvSortOrder: "asc"
                    , iCodIdentificacion: iCodComponente,
                    iCodCausaDirecta:iCodCausaDirecta
                };
                $.ajax({
                    type: "POST",
                    url: globals.urlWebApi + "api/Identificacion/ListarCausasIndirectas",
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
                { data: "iCodCausaIndirecta", title: "iCodCausaIndirecta", visible: false, orderable: false },
                { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
                { data: "iCodCausaDirecta", title: "iCodCausaDirecta", visible: false, orderable: false },                
                { data: "vDescrCausaInDirecta", title: "Descripciòn", visible: true, orderable: false },                
                {
                    data: (row) => {
                        let acciones = `<div class="nav-actions">`;
                        acciones += `<a href="javascript:void(0);" onclick ="EditarCausaIndirecta(${row.iCodCausaIndirecta},${row.iCodCausaDirecta},${row.iCodIdentificacion},'${row.vDescrCausaInDirecta}');" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                        acciones += `<a href="javascript:void(0);" onclick ="EliminarCausaIndirecta(${row.iCodCausaIndirecta},${row.iCodCausaDirecta});"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                        acciones += `</div>`;
                        return acciones;
                    }, title: "Acciones", visible: true, orderable: false
                }
            ]
        });
    } else {
        general.tblcausasindirectas.draw().clear();
    }
}

function CargarActividades(iCodComponente) {    
    debugger;    
    //if (!$.fn.dataTable.isDataTable('#tblactividades' + iCodComponente)) {        
        general.tblactividades = $('#tblactividades').DataTable({
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
                $('#tblactividades thead').attr('class', 'table-success');
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
                    , iCodIdentificacion: $("#cboComponenteSelectAct").val()
                };
                debugger;
                $.ajax({
                    type: "POST",
                    url: globals.urlWebApi + "api/Identificacion/ListarActividadesPorComponente",
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
                { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
                { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
                { data: "vDescripcion", title: "vDescripcion", visible: false, orderable: false },
                //{ data: "vDescripcion_", title: "vDescripcion", visible: false, orderable: false },
                { data: "vDescripcionCorta", title: "Descripcion", visible: true, orderable: false },
                { data: "vActividad", title: "Actividad", visible: true, orderable: false },
                { data: "vUnidadMedida", title: "Unidad Medida", visible: true, orderable: false },
                { data: "vMeta", title: "Meta", visible: true, orderable: false },
                { data: "vMedio", title: "Medio", visible: false, orderable: false },
                { data: "vMedio_", title: "Medio", visible: true, orderable: false },
                {
                    data: (row) => {
                        let acciones = `<div class="nav-actions">`;
                        acciones += `<a href="javascript:void(0);" onclick ="EditarActividad(${row.iCodActividad},${row.iCodIdentificacion},'${row.vDescripcion}','${row.vUnidadMedida}','${row.vMeta}','${row.vMedio}','${row.vActividad}');" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                        acciones += `<a href="javascript:void(0);" onclick ="EliminarActividad(${row.iCodActividad},${row.iCodIdentificacion});"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                        acciones += `</div>`;
                        return acciones;
                    }, title: "Acciones", visible: true, orderable: false
                }
            ]
        });
    //} else {
    //    general.tblactividades.draw().clear();
    //}
}

function CargarComponentes() {
    //tblcomponentes
    general.tblcomponentes = $("#tblcomponentes").DataTable({
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
            $('#tblcomponentes thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodComponente"
                , pvSortOrder: "asc"
                , iCodIdentificacion: general.iCodIdentificacion 
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Identificacion/ListarComponentesPaginadoPorUsuario",
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
            //{
            //    className: 'dt-control',
            //    orderable: false,
            //    data: null,
            //    defaultContent: '',
            //},
            { data: "iCodComponente", title: "iCodComponente", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vDescripcion", title: "Descripcion", visible: false, orderable: false },
            { data: "vDescripcionCorta", title: "Descripcion", visible: true, orderable: false },
            { data: "vIndicador", title: "Indicador", visible: true, orderable: false },
            { data: "vUnidadMedida", title: "Unidad Medida", visible: true, orderable: false },
            { data: "vMeta", title: "Meta", visible: true, orderable: false },
            { data: "vMedio", title: "Medio", visible: false, orderable: false },
            { data: "vMedio_", title: "Medio", visible: true, orderable: false },
            { data: "nTipoComponente", title: "nTipoComponente", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarComponente(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarComponente(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="agregaractividad(${row.iCodComponente});"  data-toggle="tooltip" title="Agregar Actividad"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    //$('#tblcomponentes tbody').on('click', 'td.dt-control', function () {
    //    var tr = $(this).closest('tr');
    //    var row = general.tblcomponentes.row(tr);

    //    if (row.child.isShown()) {
    //        // This row is already open - close it
    //        row.child.hide();
    //        tr.removeClass('shown');
    //    } else {
    //        // Open this row
    //        row.child(format(row.data())).show();
    //        console.log(row.data());
    //        tr.addClass('shown');
    //        CargarActividades(row.data().iCodComponente);
    //    }
    //});
}
/* Formatting function for row details - modify as you need */
function format(d) {
    //debugger;
    // `d` is the original data object for the row
    return (
        '<table id="tblactividades class="table table-bordered text-nowrap border-bottom dataTable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '</table>'
    );   
}
function format1(d) {
    //debugger;
    // `d` is the original data object for the row
    return (
        '<table id="tblcausasindirectas' + d.iCodCausaDirecta + '" class="table table-bordered text-nowrap border-bottom dataTable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '</table>'
    );
}
function format2(d) {
    //debugger;
    // `d` is the original data object for the row
    return (
        '<table id="tblcausasefectosindirectas' + d.iCodEfecto + '" class="table table-bordered text-nowrap border-bottom dataTable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '</table>'
    );
}
function EliminarComponente(obj) {

    general.elementoSeleccionado = general.tblcomponentes.row($(obj).parents('tr')).data();
    console.log(general.elementoSeleccionado);
       
    $('#modaleliminarcomponente').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcomponente').modal('show');

}
function EditarComponente(obj) {

    general.elementoSeleccionado = general.tblcomponentes.row($(obj).parents('tr')).data();

    general.accion = 2;

    $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
        .done((Componentes) => {
            $('#cboComponenteSelect').empty();
            $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
            $.each(Componentes, function (key, value) {
                $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
            });
            $('#vdescripcioncom').val('');

            $('#cboComponenteSelectAct').empty();
            $('#cboComponenteSelectAct').append("<option value='0'>Seleccione</option>");
            $.each(Componentes, function (key, value) {
                $('#cboComponenteSelectAct').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
            });
            $('#vdescripcioncom').val('');
            $("#cboComponenteSelect").val(general.elementoSeleccionado.nTipoComponente);
        }).fail((error) => {
        });
    debugger;

    
    $('#vdescripcioncom').val(general.elementoSeleccionado.vDescripcion);
    $('#vindicadorcomp1').val(general.elementoSeleccionado.vIndicador);
    $('#vunidadmedidaindcomp1').val(general.elementoSeleccionado.vUnidadMedida);
    $('#vmetacomp1').val(general.elementoSeleccionado.vMeta);
    $('#vmediocomp1').val(general.elementoSeleccionado.vMedio);

    $('#modalcomponente1').modal({ backdrop: 'static', keyboard: false });
    $('#modalcomponente1').modal('show');
}

function EditarCausaIndirecta(iCodCausaIndirecta, iCodCausaDirecta, iCodIdentificacion, vDescrCausaInDirecta) {
    general.iCodCausaIndirecta = iCodCausaIndirecta;
    general.iCodCausaDirecta = iCodCausaDirecta;
    general.accion = 2;
    $('#vcausaindirecta').val(vDescrCausaInDirecta);
    //    $('#btnguardarcausasindirectas').attr('tabla', $("#" + event.target.id).attr('tabla'));
    $('#modalcausasindirectas').modal({ backdrop: 'static', keyboard: false });
    $('#modalcausasindirectas').modal('show');  
}
function EditarEfectoIndirecto(iCodEfectoIndirecto, iCodEfectoDirecto ,vDescEfectoIndirecto) {
    general.iCodEfecto = iCodEfectoDirecto;
    general.accion = 2;
    general.iCodEfectoIndirecto = iCodEfectoIndirecto;
    $('#vefectoindirecto').val(vDescEfectoIndirecto);
    $('#modalefectosindirectos').modal({ backdrop: 'static', keyboard: false });
    $('#modalefectosindirectos').modal('show');
}
function EliminarCausaIndirecta(iCodCausaIndirecta,iCodCausaDirecta) {
    general.iCodCausaIndirecta = iCodCausaIndirecta;
    general.iCodCausaDirecta = iCodCausaDirecta;
    $('#modaleliminarcausaindirecta').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcausaindirecta').modal('show');      
}
function EditarCausaDirecta(obj) {
    general.accion = 2;
    general.elementoSeleccionadoCausaDirecta = general.tblcausasdirectas.row($(obj).parents('tr')).data();
    $('#vcausadirecta').val(general.elementoSeleccionadoCausaDirecta.vdescrcausadirecta);
    $('#modalcausasdirectas').modal({ backdrop: 'static', keyboard: false });
    $('#modalcausasdirectas').modal('show');
}
function EliminarActividad(iCodActividad,iCodComponente) { 
    general.iCodActividad = iCodActividad;
    general.iCodComponente = iCodComponente;
    $('#modaleliminaractividad').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminaractividad').modal('show');    
}

function EliminarCausaDirecta(obj) {
    //general.accion = 2;
    general.elementoSeleccionadoCausaDirecta = general.tblcausasdirectas.row($(obj).parents('tr')).data();
    //$('#vcausadirecta').val(general.elementoSeleccionadoCausaDirecta.vdescrcausadirecta);
    $('#modaleliminarcausadirecta').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcausadirecta').modal('show');    
}

function EliminarEfectoDirecto(obj) {
    general.elementoSeleccinadoEfectoDirecto = general.tblefectosdirectos.row($(obj).parents('tr')).data();
        
    $('#modaleliminarefectodirecto').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarefectodirecto').modal('show');
}

function agregarCausaIndirecta(iCodCausaDirecta, iCodIdentificacion) {
    general.iCodCausaDirecta = iCodCausaDirecta;    
        general.accion = 1;
            $('#vcausaindirecta').val('');
    //    $('#btnguardarcausasindirectas').attr('tabla', $("#" + event.target.id).attr('tabla'));
        $('#modalcausasindirectas').modal({ backdrop: 'static', keyboard: false });
        $('#modalcausasindirectas').modal('show');   
}
function agregaractividad(iCodComponente) {
    general.iCodComponente = iCodComponente;
    
    general.accion = 1;
    limpiaractividad();
    var contador = ContarActividades(1);
    console.log("actividad 1 -" + contador);
    $('#vactividadact1').val("Actividad 1." + contador);
    $('#modalactividad1').modal({ backdrop: 'static', keyboard: false });
    $('#modalactividad1').modal('show');
}

function EditarActividad(iCodActividad, iCodIdentificacion, vDescripcion, vUnidadMedida, vMeta, vMedio, vActividad) {
    general.iCodActividad = iCodActividad;
    general.iCodComponente = iCodIdentificacion;

    console.log(iCodActividad);
    console.log(iCodIdentificacion);
    console.log(vDescripcion);
    console.log(vUnidadMedida);
    console.log(vMeta);
    console.log(vMedio);
    general.accion = 2;
    $('#vdescactividadact1').val(vDescripcion);
    $('#vunidadmedidadact1').val(vUnidadMedida);
    $('#vmetaact1').val(vMeta);
    $('#vmedioact1').val(vMedio);
    $('#vactividadact1').val(vActividad);

    $('#modalactividad1').modal({ backdrop: 'static', keyboard: false });
    $('#modalactividad1').modal('show');
}

function EditarTecnologia(obj) {
    //debugger;
    general.accion = 2;
    limpiar();
    general.elementoSeleccionadoTecnologia = general.tbltecnologias.row($(obj).parents('tr')).data();
    console.log(general.elementoSeleccionadoTecnologia);
    $('#vtecnologia1').val(general.elementoSeleccionadoTecnologia.vtecnologia1);
    $('#vtecnologia2').val(general.elementoSeleccionadoTecnologia.vtecnologia2);
    $('#vtecnologia3').val(general.elementoSeleccionadoTecnologia.vtecnologia3);    

    $('#modaltecnologia').modal({ backdrop: 'static', keyboard: false });
    $('#modaltecnologia').modal('show');  
}
function EditarEfectoDirecto(obj) {
    general.elementoSeleccinadoEfectoDirecto = general.tblefectosdirectos.row($(obj).parents('tr')).data();

    console.log(general.elementoSeleccinadoEfectoDirecto);
    general.accion = 2;
    $('#vefectodirecto').val(general.elementoSeleccinadoEfectoDirecto.vDescEfecto);
    $('#modalefectosdirectos').modal({ backdrop: 'static', keyboard: false });
    $('#modalefectosdirectos').modal('show');
}
function EliminarTecnologia(obj) {
    general.elementoSeleccionadoTecnologia = general.tbltecnologias.row($(obj).parents('tr')).data();
    $('#modaleliminaratecnologia').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminaratecnologia').modal('show');  
    
}
function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario();
    CargarComponentes();
    CausasDirectas();
    EfectosDirectos();
    Indicadores();
    general.tbltecnologias = $("#tbltecnologias").DataTable({
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
            $('#tbltecnologias thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodTecnologia"
                , pvSortOrder: "asc"
                , iCodIdentificacion: general.iCodIdentificacion
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Identificacion/ListarTecnologiasPaginado",
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
            { data: "iCodTecnologia", title: "iCodTecnologia", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vtecnologia1", title: "Tecnologia 1", visible: false, orderable: false },
            { data: "vtecnologia2", title: "Tecnologia 2", visible: false, orderable: false },
            { data: "vtecnologia3", title: "Tecnologia 3", visible: false, orderable: false },
            { data: "vtecnologia1Corta", title: "Tecnologia 1", visible: true, orderable: false },
            { data: "vtecnologia2Corta", title: "Tecnologia 2", visible: true, orderable: false },
            { data: "vtecnologia3Corta", title: "Tecnologia 3", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarTecnologia(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarTecnologia(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="agregaractividad(${row.iCodComponente});"  data-toggle="tooltip" title="Agregar Actividad"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    var dato = {};

    dato.iCodExtensionista = general.usuario;
    //debugger;
    $.post(globals.urlWebApi + "api/Identificacion/ListarIdentificacion", dato)
        .done((respuesta) => {
            console.log("Datos Identificacion");
            console.log(respuesta);
            if (respuesta.length > 0) {
                general.iCodIdentificacion = respuesta[0].iCodIdentificacion;

                /**************************************************/


                $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
                    .done((Componentes) => {
                        $('#cboComponenteSelect').empty();
                        $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
                        $.each(Componentes, function (key, value) {
                            $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                        });
                        $('#vdescripcioncom').val('');

                        $('#cboComponenteSelectAct').empty();
                        $('#cboComponenteSelectAct').append("<option value='0'>Seleccione</option>");
                        $.each(Componentes, function (key, value) {
                            $('#cboComponenteSelectAct').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                        });
                        $('#vdescripcioncom').val('');
                    }).fail((error) => {
                    });
                /***************************************************/
                $('#vLimitaciones').val(respuesta[0].vLimitaciones);
                $('#vEstadoSituacional').val(respuesta[0].vEstadoSituacional);
                $('#vproblemacentral').val(respuesta[0].vProblemacentral);
                $('#vnumerounidadesproductivas').val(respuesta[0].vNumeroUnidadesProductivas);
                $('#vunidadmedidaproductivas').val(respuesta[0].vUnidadMedidaProductivas);
                $('#vnumerosfamiliares').val(respuesta[0].vNumerosFamiliares);
                $('#vcantidad').val(respuesta[0].vCantidad);
                $('#vunidadmedida').val(respuesta[0].vUnidadMedida);
                $('#vrendimientocadenaproductiva').val(respuesta[0].vRendimientoCadenaProductiva);
                $('#vgremios').val(respuesta[0].vGremios);
                $('#vobjetivocentral').val(respuesta[0].vObjetivoCentral);
                ActivarBotones(false);

                general.acciongeneral = 2;
                // *cargar tecnologias* //
                var datoidentificacion = {};
                datoidentificacion.iCodIdentificacion = general.iCodIdentificacion;
                general.tblcomponentes.draw().clear();
                general.tbltecnologias.draw().clear();
                general.tblcausasdirectas.draw().clear();
                general.tblefectosdirectos.draw().clear();
                general.tblindicadores.draw().clear();

                //$.post(globals.urlWebApi + "api/Identificacion/ListarTecnologias", datoidentificacion)
                //    .done((respuesta) => {
                //        //console.log(respuesta);
                //        if (respuesta.length > 0) {
                //            //console.table(respuesta);
                //            $.each(respuesta, function (key, value) {
                //                //alert(key + ": " + value);
                //                console.log(key);
                //                console.log(value);
                //                $("#tbltecnologias > tbody").append("<tr><td>" + value.vtecnologia1.toUpperCase() + "</td><td>" + value.vtecnologia2.toUpperCase() + "</td><td>" + value.vtecnologia3.toUpperCase() + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editartecnologia(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminartecnologia(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                //                general.listatecnologias.push({ vtecnologia1: value.vtecnologia1.toUpperCase(), vtecnologia2: value.vtecnologia2.toUpperCase(), vtecnologia3: value.vtecnologia3.toUpperCase() })
                //            });                          
                //        }
                //    });

                //$.post(globals.urlWebApi + "api/Identificacion/ListarIndicadores", datoidentificacion)
                //    .done((respuesta) => {
                //        //console.table(respuesta);
                //        $.each(respuesta, function (key, value) {
                //            $('#tblobjetivo > tbody').append("<tr><td id='" + value.iCodigoIdentificador + "'>" + value.vDescIdentificador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedioVerificacion + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarindicador(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");

                //            general.listaindicadores.push({ iCodigoIdentificador: value.iCodigoIdentificador, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedioVerificacion: value.vMedioVerificacion });
                //        });                        
                //    });
                // Listar Componentes
                //CargarComponentes();


                //$.post(globals.urlWebApi + "api/Identificacion/ListarComponentePorUsuario", datoidentificacion)
                //    .done((respuesta) => {
                //        //console.table(respuesta);
                //        $.each(respuesta, function (key, value) {
                //            if (value.nTipoComponente == 1) {
                //                $('#tblcomponente > tbody').append("<tr><td id='" + value.iCodComponente + "'>" + value.vIndicador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                //            } else {
                //                $("#tblcomponente2 > tbody").append("<tr><td>" + value.vIndicador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");            
                //            }                            
                //           // $("#tblcomponente > tbody").append("<tr><td>" + indicador + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medioverificacion + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                //            //general.listaindicadores.push({ iCodigoIdentificador: value.iCodigoIdentificador, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedioVerificacion: value.vMedioVerificacion });
                //        });
                //    });

                //Listar Actividades
                //var cantidad1 = 0;
                //var cantidad2 = 0;

                //$.post(globals.urlWebApi + "api/Identificacion/ListarActividades", dato)
                //    .done((respuesta) => {
                //        //console.table(respuesta);
                //        $.each(respuesta, function (key, value) {
                //            if (value.nTipoActividad == 1) {
                //                cantidad1++;
                //                //$('#tblcomponente > tbody').append("<tr><td id='" + value.iCodComponente + "'>" + value.vIndicador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                //                $('#tblActividades1 > tbody').append("<tr id=1" + cantidad1 + "><td>" + value.vActividad + "</td><td>" + value.vDescripcion + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editaractividad(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminaractividad(this,1);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                //                general.listaactividades.push({ id: "1" + cantidad1, vActividad: value.vActividad, vDescripcion: value.vDescripcion, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedio: value.vMedio, nTipoActividad: value.nTipoActividad });    
                //            } else {
                //                cantidad2++
                //                $("#tblActividades2 > tbody").append("<tr id=2" + cantidad2 + "><td>" + value.vActividad + "</td><td>" + value.vDescripcion + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminaractividad(this,2);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");                                
                //                general.listaactividades.push({ id: "2" +cantidad2, vActividad: value.vActividad, vDescripcion: value.vDescripcion, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedio: value.vMedio, nTipoActividad: value.nTipoActividad });
                //            }                           
                //        });
                //    });

            }
        });

    $('#btneliminarcausadirecta').on('click', function () {
        //alert('elimino');
        console.log(general.elementoSeleccionadoCausaDirecta);
        $.post(globals.urlWebApi + "api/Identificacion/EliminarCausasDirectas", general.elementoSeleccionadoCausaDirecta)
            .done((respuesta) => {
                if (respuesta.iCodCausaDirecta != 0) {
                    debugger;
                    general.tblcausasdirectas.draw().clear();
                    $('#modaleliminarcausadirecta').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btneliminarcausaindirecta').on('click', function () {
        debugger;
        let datos = {};
        datos.iCodCausaIndirecta = general.iCodCausaIndirecta;
        datos.iCodCausaDirecta = general.iCodCausaDirecta;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarCausasIndirectas", datos)
            .done((respuesta) => {
                if (respuesta.iCodCausaIndirecta != 0) {
                    debugger;
                    $('#tblcausasindirectas' + general.iCodCausaDirecta).DataTable().draw().clear();
                    $('#modaleliminarcausaindirecta').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btneliminaractividad').on('click', function () {
        debugger;
        console.log(general.iCodActividad);

        let datos = {};
        datos.iCodActividad = general.iCodActividad;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarActividad", datos)
            .done((respuesta) => {
                if (respuesta.iCodActividad != 0) {
                    debugger;
                    $('#tblactividades' + general.iCodComponente).DataTable().draw().clear();
                    $('#modaleliminaractividad').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btneliminartecnologia').on('click', function () {
        //general.elementoSeleccionadoTecnologia 
        $.post(globals.urlWebApi + "api/Identificacion/EliminarTecnologia", general.elementoSeleccionadoTecnologia)
            .done((respuesta) => {
                if (respuesta.iCodTecnologia != 0) {
                    debugger;
                    general.tbltecnologias.draw().clear();
                    $('#modaleliminaratecnologia').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btnagregarcausasdirectas').on('click', function () {
        general.accion = 1;
        $('#vcausadirecta').val('');
        $('#modalcausasdirectas').modal({ backdrop: 'static', keyboard: false });
        $('#modalcausasdirectas').modal('show');
    });

    $('#btnguardarcausasdirectas').on('click', function () {

        if ($('#vcausadirecta').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Causa Indirecta",
                type: "error"
            });
            $('#vcausadirecta').focus();
            return;
        }

        let datos = {};

        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.vdescrcausadirecta = $('#vcausadirecta').val();

        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarCausasDirectas", datos)
                .done((respuesta) => {
                    if (respuesta.iCodCausaDirecta != 0) {
                        debugger;
                        general.tblcausasdirectas.draw().clear();
                        $('#modalcausasdirectas').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {
            datos.iCodCausaDirecta = general.elementoSeleccionadoCausaDirecta.iCodCausaDirecta;

            $.post(globals.urlWebApi + "api/Identificacion/EditarCausasDirectas", datos)
                .done((respuesta) => {
                    if (respuesta.iCodCausaDirecta != 0) {
                        debugger;
                        general.tblcausasdirectas.draw().clear();
                        $('#modalcausasdirectas').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        }
    });

    $('#btnguardartecnologia').on('click', function () {

        if ($('#vtecnologia1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Tecnologias/practicas usadas en la situacion actual",
                type: "error"
            });
            $('#vtecnologia1').focus();
            return;
        }
        if ($('#vtecnologia2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Tecnologias/practicas presentes en el mercado",
                type: "error"
            });
            $('#vtecnologia2').focus();
            return;
        }
        if ($('#vtecnologia3').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Tecnologia idonea para los productores (las que necesita el productor)",
                type: "error"
            });
            $('#vtecnologia3').focus();
            return;
        }

        let datos = {};

        datos.vtecnologia1 = $('#vtecnologia1').val();
        datos.vtecnologia2 = $('#vtecnologia2').val();
        datos.vtecnologia3 = $('#vtecnologia3').val();
        datos.iCodIdentificacion = general.iCodIdentificacion;
        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarTecnologia", datos)
                .done((respuesta) => {
                    if (respuesta.iCodTecnologia != 0) {
                        debugger;
                        general.tbltecnologias.draw().clear();
                        $('#modaltecnologia').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {

            datos.iCodTecnologia = general.elementoSeleccionadoTecnologia.iCodTecnologia;

            $.post(globals.urlWebApi + "api/Identificacion/EditarTecnologia", datos)
                .done((respuesta) => {
                    if (respuesta.iCodTecnologia != 0) {
                        debugger;
                        general.tbltecnologias.draw().clear();
                        $('#modaltecnologia').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        }




    })

    $('#btnagregartecnologia').on('click', function () {
        general.accion = 1;
        limpiar();
        $('#modaltecnologia').modal({ backdrop: 'static', keyboard: false });
        $('#modaltecnologia').modal('show');
    });

    $('#btnagregarefectosdirectos').on('click', function () {
        general.accion = 1;
        $('#vefectodirecto').val('');
        $('#modalefectosdirectos').modal({ backdrop: 'static', keyboard: false });
        $('#modalefectosdirectos').modal('show');

    });

    $('#btnguardarefectodirecto').on('click', function () {
        if ($('#vefectodirecto').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Efecto Directo",
                type: "error"
            });
            $('#vefectodirecto').focus();
            return;
        }

        let datos = {};
        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.vDescEfecto = $('#vefectodirecto').val();

        if (general.accion == 1) {

            $.post(globals.urlWebApi + "api/Identificacion/InsertarEfectoDirecto", datos)
                .done((respuesta) => {
                    if (respuesta.iCodEfecto != 0) {
                        debugger;
                        general.tblefectosdirectos.draw().clear();
                        $('#modalefectosdirectos').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {

            datos.iCodEfecto = general.elementoSeleccinadoEfectoDirecto.iCodEfecto;
            $.post(globals.urlWebApi + "api/Identificacion/EditarEfectoDirecto", datos)
                .done((respuesta) => {
                    if (respuesta.iCodEfecto != 0) {
                        debugger;
                        general.tblefectosdirectos.draw().clear();
                        $('#modalefectosdirectos').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        }
    });

    $('#btnguardar').on('click', function () {
        if ($('#vLimitaciones').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Limitacion",
                type: "error"
            });
            $('#vLimitaciones').focus();
            return;
        }
        if ($('#vEstadoSituacional').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Estado Situcacional",
                type: "error"
            });
            $('#vEstadoSituacional').focus();
            return;
        }

        if ($('#vproblemacentral').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Problema Central",
                type: "error"
            });
            $('#vproblemacentral').focus();
            return;
        }

        if ($('#vnumerounidadesproductivas').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Numero de Unidades Productivas",
                type: "error"
            });
            $('#vnumerounidadesproductivas').focus();
            return;
        }

        if ($('#vunidadmedidaproductivas').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Unidad Medida Productiva",
                type: "error"
            });
            $('#vunidadmedidaproductivas').focus();
            return;
        }

        if ($('#vnumerosfamiliares').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Numero Familiares",
                type: "error"
            });
            $('#vnumerosfamiliares').focus();
            return;
        }

        if ($('#vcantidad').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Cantidad",
                type: "error"
            });
            $('#vcantidad').focus();
            return;
        }

        if ($('#vunidadmedida').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Unidad de Medida",
                type: "error"
            });
            $('#vunidadmedida').focus();
            return;
        }

        if ($('#vrendimientocadenaproductiva').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Rendimiento cadena productiva",
                type: "error"
            });
            $('#vrendimientocadenaproductiva').focus();
            return;
        }

        if ($('#vgremios').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Gremio",
                type: "error"
            });
            $('#vgremios').focus();
            return;
        }

        if ($('#vobjetivocentral').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Objetivo Central",
                type: "error"
            });
            $('#vobjetivocentral').focus();
            return;
        }

        var datos = {};
        datos.vLimitaciones = $('#vLimitaciones').val();
        datos.vEstadoSituacional = $('#vEstadoSituacional').val();
        datos.vProblemacentral = $('#vproblemacentral').val();

        datos.vNumeroUnidadesProductivas = $('#vnumerounidadesproductivas').val();
        datos.vUnidadMedidaProductivas = $('#vunidadmedidaproductivas').val();
        datos.vNumerosFamiliares = $('#vnumerosfamiliares').val();
        datos.vCantidad = $('#vcantidad').val();
        datos.vUnidadMedida = $('#vunidadmedida').val();
        datos.vRendimientoCadenaProductiva = $('#vrendimientocadenaproductiva').val();
        datos.vGremios = $('#vgremios').val();
        datos.vObjetivoCentral = $('#vobjetivocentral').val();


        datos.iCodExtensionista = general.usuario;
        datos.iOpcion = general.acciongeneral;
        if (general.acciongeneral == 2) {
            datos.iCodIdentificacion = general.iCodIdentificacion;
        }
        var tecnologias = new Array();

        $.each(general.listatecnologias, function (key, value) {
            tecnologias.push({ vtecnologia1: value.vtecnologia1, vtecnologia2: value.vtecnologia2, vtecnologia3: value.vtecnologia3 });
        });

        datos.listatecnologias = tecnologias;
        var indicadores = new Array();

        $.each(general.listaindicadores, function (key, value) {
            indicadores.push({ iCodigoIdentificador: value.iCodigoIdentificador, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedioVerificacion: value.vMedioVerificacion });
        });

        datos.listaindicadores = indicadores;

        datos.listacausasdirectas = general.listacausasdirectas;

        var causasindirectas = new Array();

        $.each(general.listacausasdirectas, function (key, value) {
            var id = value.id;
            $.each(value.listacaudasindirecta, function (key1, value1) {
                causasindirectas.push({ iCodCausaDirecta: id, vDescrCausaInDirecta: value1.vdescrcausadirecta });
            });
        });

        datos.listacausasindirectas = causasindirectas;

        datos.listaefectosdirectos = general.listaefectosdirectos;

        var efectosindirectos = new Array();

        $.each(general.listaefectosdirectos, function (key, value) {
            var id = value.id;
            $.each(value.listaefectoindirecto, function (key1, value1) {
                efectosindirectos.push({ iCodEfectoDirecto: id, vdescrefectoindirecto: value1.vdescrefectoindirecto });
            });
        });
        datos.listaefectoindirectos = efectosindirectos;

        datos.listacomponente = general.listacomponente;

        datos.listaactividad = general.listaactividades;

        $.post(globals.urlWebApi + "api/Identificacion/InsertarIdentificacion", datos)
            .done((respuesta) => {
                if (respuesta.iCodIdentificacion != 0) {
                    general.iCodIdentificacion = respuesta.iCodIdentificacion;
                    ActivarBotones(false);
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#tblefectosdirectos').on('click', '.btnaddefectoindirecto', function (event) {

        console.log(event.target.id);
        $('#vefectoindirecto').val('');
        $('#btnguardarefectoindirecto').attr('tabla', $("#" + event.target.id).attr('tabla'));
        $('#modalefectosindirectos').modal({ backdrop: 'static', keyboard: false });
        $('#modalefectosindirectos').modal('show');
    });

    $('#btnguardarefectoindirecto').on('click', function () {
        if ($('#vefectoindirecto').val() == '') {
            notif({
                msg: "<b>Correcto:</b>Ingresar Efecto Indirecto",
                type: "error"
            });
            $('#vefectoindirecto').focus();
            return;
        }

        let datos = {};

        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.vDescEfectoIndirecto = $('#vefectoindirecto').val();
        datos.iCodEfectoDirecto = general.iCodEfecto;

        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarEfectoIndirecto", datos)
                .done((respuesta) => {
                    if (respuesta.iCodEfecto != 0) {
                        debugger;
                        //general.tblefectosdirectos.draw().clear();
                        $('#tblcausasefectosindirectas' + general.iCodEfecto).DataTable().draw().clear();
                        $('#modalefectosindirectos').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {
            datos.iCodEfectoIndirecto = general.iCodEfectoIndirecto;

            $.post(globals.urlWebApi + "api/Identificacion/EditarEfectoIndirecto", datos)
                .done((respuesta) => {
                    if (respuesta.iCodEfecto != 0) {
                        debugger;
                        //general.tblefectosdirectos.draw().clear();
                        $('#tblcausasefectosindirectas' + general.iCodEfecto).DataTable().draw().clear();
                        $('#modalefectosindirectos').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        }

    });

    $('#btnguardarobjetivo').on('click', function () {
        //debugger;
        if ($('#cboindicador').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Seleccione Indicador",
                type: "error"
            });
            $('#cboindicador').focus();
            return;
        }
        if ($('#vunidadmedidaind').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Unidad de Medida",
                type: "error"
            });
            $('#vunidadmedidaind').focus();
            return;
        }
        if ($('#vmeta').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Meta",
                type: "error"
            });
            $('#vmeta').focus();
            return;
        }
        if ($('#vmedio').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Medio de Verificación",
                type: "error"
            });
            $('#vmedio').focus();
            return;
        }


        let datos = {};
        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.iCodigoIdentificador = $('#cboindicador').val();
        datos.vUnidadMedida = $('#vunidadmedidaind').val();
        datos.vMeta = $('#vmeta').val();
        datos.vMedioVerificacion = $('#vmedio').val();

        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarIndicador", datos)
                .done((respuesta) => {
                    if (respuesta.iCodIndicador != 0) {
                        debugger;
                        general.tblindicadores.draw().clear();
                        $('#modalobjetivo').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {
            datos.iCodIndicador = general.elementoSeleccionadoIndicador.iCodIndicador;

            $.post(globals.urlWebApi + "api/Identificacion/EditarIndicador", datos)
                .done((respuesta) => {
                    if (respuesta.iCodIndicador != 0) {
                        debugger;
                        general.tblindicadores.draw().clear();
                        $('#modalobjetivo').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });

        }
    });

    $('#btnagregarobjetivo').on('click', function () {
        limpiarindicadores();
        general.accion = 1;
        $('#modalobjetivo').modal({ backdrop: 'static', keyboard: false });
        $('#modalobjetivo').modal('show');
    });

    $('#btnagregarcomponente1').on('click', function () {
        limpiarcomponente1();
        general.accion = 1;
        $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
            .done((Componentes) => {
                $('#cboComponenteSelect').empty();
                $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
                $.each(Componentes, function (key, value) {
                    $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                });
                $('#vdescripcioncom').val('');

                $('#cboComponenteSelectAct').empty();
                $('#cboComponenteSelectAct').append("<option value='0'>Seleccione</option>");
                $.each(Componentes, function (key, value) {
                    $('#cboComponenteSelectAct').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                });
                $('#vdescripcioncom').val('');
            }).fail((error) => {
        });
        $('#modalcomponente1').modal({ backdrop: 'static', keyboard: false });
        $('#modalcomponente1').modal('show');
    });

    $('#btnagregarcomponente2').on('click', function () {
        limpiarcomponente2();
        general.accion = 1;
        $('#modalcomponente2').modal({ backdrop: 'static', keyboard: false });
        $('#modalcomponente2').modal('show');
    });


    $('#btnagregaractividad1').on('click', function () {
        general.accion = 1;
        limpiaractividad();
        var contador = ContarActividades(1);
        console.log("actividad 1 -" + contador);
        $('#vactividadact1').val("Actividad 1." + contador);
        $('#modalactividad1').modal({ backdrop: 'static', keyboard: false });
        $('#modalactividad1').modal('show');
    });

    $('#btnguardarcomp1').on('click', function () {

        if ($('#cboComponenteSelect').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b>Seleccionar Componente",
                type: "error"
            });
            $('#cboComponenteSelect').focus();
            return;
        }

        if ($('#vindicadorcomp1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Indicador",
                type: "error"
            });
            $('#vindicadorcomp1').focus();
            return;
        }

        if ($('#vunidadmedidaindcomp1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Unidad Medida",
                type: "error"
            });
            $('#vunidadmedidaindcomp1').focus();
            return;
        }

        if ($('#vmetacomp1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Meta",
                type: "error"
            });
            $('#vmetacomp1').focus();
            return;
        }

        if ($('#vmediocomp1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Medio de Verificación",
                type: "error"
            });
            $('#vmediocomp1').focus();
            return;
        }


        var indicador = $('#vindicadorcomp1').val();
        var unidadmedida = $('#vunidadmedidaindcomp1').val();
        var meta = $('#vmetacomp1').val();
        var medioverificacion = $('#vmediocomp1').val();


        
        let datos = {};
        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.vDescripcion =  $("#cboComponenteSelect option:selected").text();
        datos.vIndicador = indicador;
        datos.vUnidadMedida = unidadmedida;
        datos.vMeta = meta;

        datos.vMedio = medioverificacion;
        datos.nTipoComponente = $("#cboComponenteSelect").val();

        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarComponente", datos)
                .done((respuesta) => {
                    if (respuesta.iCodComponente != 0) {
                        $('#modalcomponente1').modal('hide');
                        general.tblcomponentes.draw().clear();
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {
            datos.iCodComponente = general.elementoSeleccionado.iCodComponente;

            $.post(globals.urlWebApi + "api/Identificacion/ActualizarComponente", datos)
                .done((respuesta) => {
                    if (respuesta.iCodComponente != 0) {
                        $('#modalcomponente1').modal('hide');
                        general.tblcomponentes.draw().clear();
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });

        }

    });

    $('#btnguardarcomp2').on('click', function () {

        if ($('#vindicadorcomp2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Indicador",
                type: "error"
            });
            $('#vindicadorcomp2').focus();
            return;
        }

        if ($('#vunidadmedidaindcomp2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Unidad Medida",
                type: "error"
            });
            $('#vunidadmedidaindcomp2').focus();
            return;
        }

        if ($('#vmetacomp2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Meta",
                type: "error"
            });
            $('#vmetacomp2').focus();
            return;
        }

        if ($('#vmediocomp2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Medio de Verificación",
                type: "error"
            });
            $('#vmediocomp2').focus();
            return;
        }

        var indicador = $('#vindicadorcomp2').val();
        var unidadmedida = $('#vunidadmedidaindcomp2').val();
        var meta = $('#vmetacomp2').val();
        var medioverificacion = $('#vmediocomp2').val();

        if (general.accion == 1) {
            $("#tblcomponente2 > tbody").append("<tr><td>" + indicador + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medioverificacion + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
            general.listacomponente.push({ vIndicador: indicador, vUnidadMedida: unidadmedida, vMeta: meta, vMedio: medioverificacion, nTipoComponente: 2 });
        } else {
            general.tractual.cells[0].innerHTML = indicador;
            general.tractual.cells[1].innerHTML = unidadmedida;
            general.tractual.cells[2].innerHTML = meta;
            general.tractual.cells[3].innerHTML = medioverificacion;
        }
        $('#modalcomponente2').modal('hide');
    });

    $('#btnguardaractividad').on('click', function () {

        if ($('#vactividadact1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Actividad",
                type: "error"
            });
            $('#vactividadact1').focus();
            return;
        }

        if ($('#vdescactividadact1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Descripción",
                type: "error"
            });
            $('#vdescactividadact1').focus();
            return;
        }

        if ($('#vunidadmedidadact1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Unidad Medida",
                type: "error"
            });
            $('#vunidadmedidadact1').focus();
            return;
        }

        if ($('#vmetaact1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Meta",
                type: "error"
            });
            $('#vmetaact1').focus();
            return;
        }

        if ($('#vmedioact1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Medio de Verificacion",
                type: "error"
            });
            $('#vmedioact1').focus();
            return;
        }
        debugger;
        //elementoSeleccionado
        let datos = {};

        var actividad = $('#vactividadact1').val();
        var descripcion = $('#vdescactividadact1').val();
        var unidadmedida = $('#vunidadmedidadact1').val();
        var meta = $('#vmetaact1').val();
        var medio = $('#vmedioact1').val();

        datos.iCodIdentificacion = $("#cboComponenteSelectAct").val(); // general.iCodComponente;
        datos.vActividad = actividad;
        datos.vDescripcion = descripcion;
        datos.vUnidadMedida = unidadmedida;
        datos.vMeta = meta;
        datos.vMedio = medio;
        datos.nTipoActividad = 1;
        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarActividad", datos)
                .done((respuesta) => {
                    if (respuesta.iCodActividad != 0) {
                        $('#tblactividades').DataTable().draw().clear();
                        $('#modalactividad1').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {
            datos.iCodIdentificacion = general.iCodComponente;
            datos.iCodActividad = general.iCodActividad;

            $.post(globals.urlWebApi + "api/Identificacion/ActualizarActividad", datos)
                .done((respuesta) => {
                    if (respuesta.iCodActividad != 0) {
                        $('#tblactividades').DataTable().draw().clear();
                        $('#modalactividad1').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        }


    });

    $('#btnguardaractividad2').on('click', function () {

        if ($('#vactividadact2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Actividad",
                type: "error"
            });
            $('#vactividadact2').focus();
            return;
        }

        if ($('#vdescactividadact2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Descripción",
                type: "error"
            });
            $('#vdescactividadact2').focus();
            return;
        }

        if ($('#vunidadmedidadact2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Unidad de Medida",
                type: "error"
            });
            $('#vunidadmedidadact2').focus();
            return;
        }

        if ($('#vmetaact2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Meta",
                type: "error"
            });
            $('#vmetaact2').focus();
            return;
        }

        if ($('#vmedioact2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingrese Medio de Verificacion",
                type: "error"
            });
            $('#vmedioact2').focus();
            return;
        }


        var actividad = $('#vactividadact2').val();
        var descripcion = $('#vdescactividadact2').val();
        var unidadmedida = $('#vunidadmedidadact2').val();
        var meta = $('#vmetaact2').val();
        var medio = $('#vmedioact2').val();

        if (general.accion == 1) {
            var contador = ContarActividades(2);
            console.log("actividad 2 - " + contador);
            $('#tblActividades2 > tbody').append("<tr id=2" + contador + "><td>" + actividad + "</td><td>" + descripcion + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editaractividad2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
            general.listaactividades.push({ id: "2" + contador, vActividad: actividad, vDescripcion: descripcion, vUnidadMedida: unidadmedida, vMeta: meta, vMedio: medio, nTipoActividad: 2 });
        } else {
            general.tractual.cells[0].innerHTML = actividad;
            general.tractual.cells[1].innerHTML = descripcion;
            general.tractual.cells[2].innerHTML = unidadmedida;
            general.tractual.cells[3].innerHTML = meta;
            general.tractual.cells[4].innerHTML = medio;
        }

        $('#modalactividad2').modal('hide');
    });

    $('#btnagregaractividad2').on('click', function () {
        general.accion = 1;
        limpiaractividad2();
        var contador = ContarActividades(2);
        console.log("actividad 1 -" + contador);
        $('#vactividadact2').val("Actividad 1." + contador);
        $('#modalactividad2').modal({ backdrop: 'static', keyboard: false });
        $('#modalactividad2').modal('show');
    });

    $('#btnguardarcausasindirectas').on('click', function (event) {
        if ($('#vcausaindirecta').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Causa Indirecta",
                type: "error"
            });
            return;
        }

        let datos = {};

        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.iCodCausaDirecta = general.iCodCausaDirecta;
        datos.vDescrCausaInDirecta = $('#vcausaindirecta').val();

        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarCausasIndirectas", datos)
                .done((respuesta) => {
                    if (respuesta.iCodCausaIndirecta != 0) {
                        //$('#tblactividades' + general.iCodComponente).DataTable().draw().clear();
                        $('#tblcausasindirectas' + general.iCodCausaDirecta).DataTable().draw().clear();
                        $('#modalcausasindirectas').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });
        } else {
            datos.iCodCausaIndirecta = general.iCodCausaIndirecta;

            $.post(globals.urlWebApi + "api/Identificacion/EditarCausasIndirectas", datos)
                .done((respuesta) => {
                    if (respuesta.iCodCausaIndirecta != 0) {
                        //$('#tblactividades' + general.iCodComponente).DataTable().draw().clear();
                        $('#tblcausasindirectas' + general.iCodCausaDirecta).DataTable().draw().clear();
                        $('#modalcausasindirectas').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                    }
                });

        }
    });

    $('#btneliminarefectodirecto').on('click', function () {
        //alert('elimino');
        //general.
        let datos = {};
        datos.iCodEfecto = general.elementoSeleccinadoEfectoDirecto.iCodEfecto;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarEfectoDirecto", datos)
            .done((respuesta) => {
                if (respuesta.iCodEfecto != 0) {
                    debugger;
                    general.tblefectosdirectos.draw().clear();
                    $('#modaleliminarefectodirecto').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btneliminarefectoindirecto').on('click', function () {
        let datos = {};
        datos.iCodEfectoIndirecto = general.iCodEfectoIndirecto;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarIndirecto", datos)
            .done((respuesta) => {
                if (respuesta.iCodEfectoIndirecto != 0) {
                    debugger;
                    //general.tblefectosdirectos.draw().clear();
                    $('#tblcausasefectosindirectas' + general.iCodEfecto).DataTable().draw().clear();
                    $('#modaleliminarefectoindirecto').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btneliminarindicador').on('click', function () {

        let datos = {};
        datos.iCodIndicador = general.elementoSeleccionadoIndicador.iCodIndicador;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarIndicador", datos)
            .done((respuesta) => {
                if (respuesta.iCodIndicador != 0) {
                    debugger;
                    general.tblindicadores.draw().clear();
                    //$('#tblcausasefectosindirectas' + general.iCodEfecto).DataTable().draw().clear();
                    $('#modaleliminarindicador').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#btneliminarcomponente').on('click', function () {

        let datos = {};
        datos.iCodComponente = general.elementoSeleccionado.iCodComponente;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarComponente", datos)
            .done((respuesta) => {
                if (respuesta.iCodComponente != 0) {
                    $('#modaleliminarcomponente').modal('hide');
                    general.tblcomponentes.draw().clear();
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu22').css('color', '#6c5ffc');

    $('#btnagregarDescripComp').on('click', function (event) {
        if ($('#vdescripcioncom').val() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Descripcion de Componente",
                type: "error"
            });
            return;
        }

        let datos = {};

        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.vDescripcion = $('#vdescripcioncom').val();
        datos.accion = 1;
        datos.iOpcion = 1;

        if (general.accion == 1) {
            $.post(globals.urlWebApi + "api/Identificacion/InsertarCompDescrip", datos)
                .done((respuesta) => {
                    if (respuesta.iCodComponenteDesc != 0) {
                        //$('#modalcomponente1').modal('hide');
                        notif({
                            msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                            type: "success"
                        });
                        debugger;
                        // Listar Select Nuevamente
                        $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
                            .done((Componentes) => {
                                $('#cboComponenteSelect').empty();
                                $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
                                $.each(Componentes, function (key, value) {
                                    $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                                });
                                $('#vdescripcioncom').val('');
                            }).fail((error) => {
                        });
                    }
                });
        }
    });

    CargarActividades(0);

   

    $("#cboComponenteSelectAct").on('change', function (e) {
        $("#vComponenteAct").val($("#cboComponenteSelectAct option:selected").text());
        general.tblactividades.draw().clear();
        

    });

    $('#btnagregarActividad').on('click', function (event) {
        //debugger;
        if ($("#cboComponenteSelectAct").val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar un componente, para agregar una actividad.",
                type: "error"
            });
            $('#modalactividad1').modal('hide');
            $('#cboComponenteSelectAct').focus();
            return;
        }
        limpiaractividad();
        $.when(obtenerCorrelativo({ iCodIdentificacion: $("#cboComponenteSelectAct").val() }))
            .done((Componentes) => {
                debugger;
                $("#vactividadact1").val(Componentes.vActividadCorrelativo);
                $('#modalactividad1').modal('show');
            }).fail((error) => {
            });
        
        //if ($('#vdescripcioncom').val() == '') {
        //    notif({
        //        msg: "<b>Incorrecto:</b>Ingresar Descripcion de Componente",
        //        type: "error"
        //    });
        //    return;
        //}

        //let datos = {};

        //datos.iCodIdentificacion = general.iCodIdentificacion;
        //datos.vDescripcion = $('#vdescripcioncom').val();
        //datos.accion = 1;
        //datos.iOpcion = 1;

        //if (general.accion == 1) {
        //    $.post(globals.urlWebApi + "api/Identificacion/InsertarCompDescrip", datos)
        //        .done((respuesta) => {
        //            if (respuesta.iCodComponenteDesc != 0) {
        //                //$('#modalcomponente1').modal('hide');
        //                notif({
        //                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
        //                    type: "success"
        //                });
        //                debugger;
        //                // Listar Select Nuevamente
        //                $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
        //                    .done((Componentes) => {
        //                        $('#cboComponenteSelect').empty();
        //                        $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
        //                        $.each(Componentes, function (key, value) {
        //                            $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
        //                        });
        //                        $('#vdescripcioncom').val('');
        //                    }).fail((error) => {
        //                    });
        //            }
        //        });
        //}
    });

    $('#btnEliminarDescripComp').on('click', function (event) {
        //debugger;
        if ($("#cboComponenteSelect").val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar un componente para eliminarlo.",
                type: "error"
            });
            //$('#modalactividad1').modal('hide');
            $('#cboComponenteSelect').focus();
            return;
        }
        let datos = {};
        datos.iCodComponenteDesc = $("#cboComponenteSelect").val();
        datos.iOpcion = 3;
        $.post(globals.urlWebApi + "api/Identificacion/InsertarCompDescrip", datos)
            .done((respuesta) => {
                if (respuesta.iCodComponenteDesc != 0) {
                    debugger;
                    $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
                        .done((Componentes) => {
                            $('#cboComponenteSelect').empty();
                            $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
                            $.each(Componentes, function (key, value) {
                                $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                            });
                            $('#vdescripcioncom').val('');

                            $('#cboComponenteSelectAct').empty();
                            $('#cboComponenteSelectAct').append("<option value='0'>Seleccione</option>");
                            $.each(Componentes, function (key, value) {
                                $('#cboComponenteSelectAct').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                            });
                            $('#vdescripcioncom').val('');
                        }).fail((error) => {
                        });

                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });


    });
    

}

function obtenerCorrelativo(data) {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/Identificacion/ActividadCorrelativo", headers: { Accept: "application/json" }, dataType: 'json', data: data });
    
}

function obtenerComponentes(data) {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/Identificacion/ListarComponentesSelect", headers: { Accept: "application/json" }, dataType: 'json', data: data });
}

function ContarActividades(tipo) {
    var contador = 0;
    $.each(general.listaactividades, function (key, value) {
        if (value.nTipoActividad == tipo) {
            contador++;
        }
    });
    return contador+1;
}

function editarcomponente(obj) {
    //debugger;
    var listafila = new Array()

    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;    
    listafila = obj.parentElement.parentElement.parentElement.cells;
    console.log(listafila);
    general.accion = 2;
    limpiarcomponente1();

    //$.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion }))
    //    .done((Componentes) => {
    //        $('#cboComponenteSelect').empty();
    //        $('#cboComponenteSelect').append("<option value='0'>Seleccione</option>");
    //        $.each(Componentes, function (key, value) {
    //            $('#cboComponenteSelect').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
    //        });
    //        $('#vdescripcioncom').val('');

    //        $('#cboComponenteSelectAct').empty();
    //        $('#cboComponenteSelectAct').append("<option value='0'>Seleccione</option>");
    //        $.each(Componentes, function (key, value) {
    //            $('#cboComponenteSelectAct').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
    //        });
    //        $('#vdescripcioncom').val('');
    //    }).fail((error) => {
    //});
    debugger; 
    
    $('#vindicadorcomp1').val(listafila[0].innerText);
    $('#vunidadmedidaindcomp1').val(listafila[1].innerText);
    $('#vmetacomp1').val(listafila[2].innerText);
    $('#vmediocomp1').val(listafila[3].innerText);

    $('#modalcomponente1').modal({ backdrop: 'static', keyboard: false });
    $('#modalcomponente1').modal('show');
}

function editarcomponente2(obj) {
    var listafila = new Array()
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;
    listafila = obj.parentElement.parentElement.parentElement.cells;
    console.log(listafila);
    general.accion = 2;
    limpiarcomponente2();

    $('#vindicadorcomp2').val(listafila[0].innerText);
    $('#vunidadmedidaindcomp2').val(listafila[1].innerText);
    $('#vmetacomp2').val(listafila[2].innerText);
    $('#vmediocomp2').val(listafila[3].innerText);

    //$('#modalcomponente2').modal({ backdrop: 'static', keyboard: false });
    $('#modalcomponente2').modal('show');
}

function editaractividad(obj) {
    var listafila = new Array()
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;
    listafila = obj.parentElement.parentElement.parentElement.cells;
    general.accion = 2;
    limpiaractividad();
    $('#vactividadact1').val(listafila[0].innerText);
    $('#vdescactividadact1').val(listafila[1].innerText);
    $('#vunidadmedidadact1').val(listafila[2].innerText)
    $('#vmetaact1').val(listafila[3].innerText);
    $('#vmedioact1').val(listafila[4].innerText);

    $('#modalactividad1').modal('show');
}

function editaractividad2(obj) {
    var listafila = new Array()
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;
    listafila = obj.parentElement.parentElement.parentElement.cells;
    general.accion = 2;
    limpiaractividad2();
    $('#vactividadact2').val(listafila[0].innerText);
    $('#vdescactividadact2').val(listafila[1].innerText);
    $('#vunidadmedidadact2').val(listafila[2].innerText)
    $('#vmetaact2').val(listafila[3].innerText);
    $('#vmedioact2').val(listafila[4].innerText);

    $('#modalactividad2').modal('show');
}

function limpiaractividad() {
   //$('#cboComponenteSelectAct').val('');
   $('#vdescactividadact1').val('');
    $('#vunidadmedidadact1').val('');
   $('#vmetaact1').val('');
   $('#vmedioact1').val('');
}

function limpiaractividad2() {
    $('#vactividadact2').val('');
    $('#vdescactividadact2').val('');
    $('#vunidadmedidadact2').val('');
    $('#vmetaact2').val('');
    $('#vmedioact2').val('');
}

function limpiarcomponente1() {
    $('#vdescripcioncom').val('');
    $('#vindicadorcomp1').val('');
    $('#vunidadmedidaindcomp1').val('');
     $('#vmetacomp1').val('');
     $('#vmediocomp1').val('');
}

function limpiarcomponente2() {
    $('#vindicadorcomp2').val('');
    $('#vunidadmedidaindcomp2').val('');
    $('#vmetacomp2').val('');
    $('#vmediocomp2').val('');
}

function AgregarindirectasaDirectas(texto) {

    $.each(general.listacausasdirectas, function (key, value) {
        if (value.id == general.indiceseleccionadodirecta) {
            value.listacaudasindirecta.push({ vdescrcausadirecta: texto });
        }
    });
}

function AgregarEfectosIndirectosaDirectos(texto) {
    $.each(general.listaefectosdirectos, function (key, value) {
        if (value.id == general.indiceseleccionadodirecta) {
            value.listaefectoindirecto.push({ vdescrefectoindirecto: texto });
        }
    });
}

function limpiar() {
    $('#vtecnologia1').val('');
    $('#vtecnologia2').val('');
    $('#vtecnologia3').val('');
}

function limpiarindicadores() {
    $('#cboindicador').val('');
    $('#vunidadmedidaind').val('');
    $('#vmeta').val('');
    $('#vmedio').val('');
}

function AgregarTecnologia(indice,vtecnologia1, vtecnologia2, vtecnologia3) {

    if (indice == 0) {
        var indice = general.listatecnologias.length == 0 ? 1 : general.listatecnologias.length + 1;

        general.listatecnologias.push({ indice: indice, vtecnologia1: vtecnologia1, vtecnologia2: vtecnologia2, vtecnologia3: vtecnologia3 });
        $("#tbltecnologias > tbody").append("<tr><td>" + vtecnologia1.toUpperCase() + "</td><td>" + vtecnologia2.toUpperCase() + "</td><td>" + vtecnologia3.toUpperCase() + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editartecnologia(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminartecnologia(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
    } else {
        general.listatecnologias[indice-1].vtecnologia1 = vtecnologia1;
        general.listatecnologias[indice-1].vtecnologia2 = vtecnologia2;
        general.listatecnologias[indice - 1].vtecnologia3 = vtecnologia3;
        
        general.tractual.cells[0].innerHTML = vtecnologia1;
        general.tractual.cells[1].innerHTML = vtecnologia2;
        general.tractual.cells[2].innerHTML = vtecnologia3;        
    }    
}

function AgregarCausadirecta(causadirecta) {
    var cantidadfilas = 0;

    $("#tblcausasdirectas tr.clsfilacausadirecta").each(function (index, value) {
        cantidadfilas = cantidadfilas + 1;
    });

    console.log('cantidad de filas causas directas');
    console.log(cantidadfilas);

    general.listacausasdirectas.push({ id:cantidadfilas , vdescrcausadirecta: $('#vcausadirecta').val(),listacaudasindirecta :[] });

    $("#tblcausasdirectas > tbody").append("<tr id='"+cantidadfilas+"' class='clsfilacausadirecta'><td>" + causadirecta.toUpperCase() + "</td><td><img src='../Content/assets/images/plus.png' alt='Agregar Causa Indirecta' onclick='fila(this)' style='cursor: pointer'/></td></tr>");
}

function agregarEfectoIndirecto(iCodEfecto) {
    console.log(iCodEfecto);
    general.iCodEfecto = iCodEfecto;
    general.accion = 1;
    $('#vefectoindirecto').val('');
    $('#modalefectosindirectos').modal({ backdrop: 'static', keyboard: false });
    $('#modalefectosindirectos').modal('show');  
}

function EliminarEfectoIndirecto(iCodEfectoIndirecto, iCodEfecto) { 
    general.iCodEfectoIndirecto = iCodEfectoIndirecto;
    general.iCodEfecto = iCodEfecto;
    $('#modaleliminarefectoindirecto').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarefectoindirecto').modal('show');  
    
}

function editartecnologia(obj) {    
    var listafila = new Array()
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;

    listafila = obj.parentElement.parentElement.parentElement.cells;
    $('#vtecnologia1').val(listafila[0].innerText);
    $('#vtecnologia2').val(listafila[1].innerText);
    $('#vtecnologia3').val(listafila[2].innerText);

    $('#modaltecnologia').modal({ backdrop: 'static', keyboard: false });
    $('#modaltecnologia').modal('show');   
}

function EliminarIndicador(obj) {
    general.elementoSeleccionadoIndicador = general.tblindicadores.row($(obj).parents('tr')).data();
    console.log(general.elementoSeleccionadoIndicador);
    $('#modaleliminarindicador').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarindicador').modal('show');
}

function EditarIndicador(obj) {
    general.elementoSeleccionadoIndicador = general.tblindicadores.row($(obj).parents('tr')).data();
    general.accion = 2;        
    $('#cboindicador').val(general.elementoSeleccionadoIndicador.iCodigoIdentificador);
    $('#vunidadmedidaind').val(general.elementoSeleccionadoIndicador.vUnidadMedida);
    $('#vmeta').val(general.elementoSeleccionadoIndicador.vMeta);
    $('#vmedio').val(general.elementoSeleccionadoIndicador.vMedioVerificacion);
    
    $('#modalobjetivo').modal({ backdrop: 'static', keyboard: false });
    $('#modalobjetivo').modal('show');
}

function eliminartecnologia(obj) {
    //debugger;
    var indicefila = obj.parentElement.parentElement.parentElement.rowIndex;
    let table = document.getElementById('tbltecnologias');
    table.deleteRow(indicefila);
    general.listatecnologias.splice(indicefila-1, 1);
    //console.log(indicefila);
}

function fila(obj) {
    //debugger;
    //console.log(obj);
    var table = document.getElementById("tblcausasdirectas");
    var indicefila = obj.parentElement.parentElement.rowIndex;
    general.indiceseleccionadodirecta = obj.parentElement.parentElement.id;
    //console.log(obj.parentElement.parentElement.rowIndex);    
    var row = table.insertRow(indicefila+1);
    var cell1 = row.insertCell(0);        
    //var cell2 = row.insertCell(1);
    cell1.colSpan = "2";
    //cell1.innerHTML = "NEW CELL1";
    //cell1.appendChild("<table><tr><td>1</td><td>2</td></tr><table>");

    let newText = document.createTextNode('Causas Indirectas');

    //<img src="~/Content/assets/images/add.png" id="btnagregarcausasdirectas" style="cursor:pointer" />

    var tablecausasindirectas = document.createElement("table");
    tablecausasindirectas.id = "tblcausasindirectas" + indicefila;

    let imgadd = document.createElement("img");
    imgadd.src = "../Content/assets/images/add.png";
    imgadd.className = "btnaddcausaindirecta";
    imgadd.id = "btnaddcausaindirecta" + indicefila;
    imgadd.setAttribute("tabla", tablecausasindirectas.id);
    cell1.appendChild(newText);
    cell1.appendChild(imgadd);
    
   
    tablecausasindirectas.className = "table table-bordered text-nowrap border-bottom";
    //var rowci = tablecausasindirectas.insertRow(0);
    var header = tablecausasindirectas.createTHead();
    var body = tablecausasindirectas.createTBody();

    header.className = "table-success";
    var rowci = header.insertRow(0);  
    var cell1ci = rowci.insertCell(0);   
    var cell2ci = rowci.insertCell(1);   
    cell1ci.innerHTML = "DESCRIPCION";

    cell1.appendChild(tablecausasindirectas);
    //cell2.innerHTML = "NEW CELL2";
}

function fila1(obj) {
    console.log(obj);
    var table = document.getElementById("tblefectosdirectos");
    var indicefila = obj.parentElement.parentElement.rowIndex;
    general.indiceseleccionadodirecta = obj.parentElement.parentElement.id;
    console.log(obj.parentElement.parentElement.rowIndex);
    var row = table.insertRow(indicefila + 1);
    var cell1 = row.insertCell(0);
    //var cell2 = row.insertCell(1);
    cell1.colSpan = "2";
    //cell1.innerHTML = "NEW CELL1";
    //cell1.appendChild("<table><tr><td>1</td><td>2</td></tr><table>");

    let newText = document.createTextNode('Efectos Indirectos');

    //<img src="~/Content/assets/images/add.png" id="btnagregarcausasdirectas" style="cursor:pointer" />

    var tablecausasindirectas = document.createElement("table");
    tablecausasindirectas.id = "tblefectosindirectos" + indicefila;

    let imgadd = document.createElement("img");
    imgadd.src = "../Content/assets/images/add.png";
    imgadd.className = "btnaddefectoindirecto";
    imgadd.id = "btnaddefectoindirecto" + indicefila;
    imgadd.setAttribute("tabla", tablecausasindirectas.id);
    cell1.appendChild(newText);
    cell1.appendChild(imgadd);

    tablecausasindirectas.className = "table table-bordered text-nowrap border-bottom";
    //var rowci = tablecausasindirectas.insertRow(0);
    var header = tablecausasindirectas.createTHead();
    var body = tablecausasindirectas.createTBody();

    header.className = "table-success";
    var rowci = header.insertRow(0);
    var cell1ci = rowci.insertCell(0);
    var cell2ci = rowci.insertCell(1);
    cell1ci.innerHTML = "DESCRIPCION";

    cell1.appendChild(tablecausasindirectas);
}

function ActivarBotones(sw) {
    $('#btnagregartecnologia').prop('disabled', sw);
    $('#btnagregarobjetivo').prop('disabled', sw);
    $('#btnagregarcomponente1').prop('disabled', sw);    
    $('#btnagregarcausasdirectas').prop('disabled', sw);  
    $('#btnagregarefectosdirectos').prop('disabled', sw);  
    
}