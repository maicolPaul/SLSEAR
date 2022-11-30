let general = {
    usuario: 0,
    tblcronograma: null,
    elementoSeleccionado: null,
    iCodIdentificacion: 0,
    accion: 1,
    tblPlanCapa: null,
    tblAsist: null,
    tblcosto: null,
    tblcostoPlanAT:null
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

                $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion, iTipo: 1 }))
                    .done((Componentes) => {                  

                        $('#cboComponente').empty();
                        $('#cboComponente').append("<option value='0'>Seleccione</option>");
                        $.each(Componentes, function (key, value) {
                            $('#cboComponente').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                        });
                    }).fail((error) => {
                    });
                $.when(obtenerComponentes({ iCodIdentificacion: general.iCodIdentificacion, iTipo: 2 }))
                    .done((Componentes) => {

                        $('#cboComponentePlanAT').empty();
                        $('#cboComponentePlanAT').append("<option value='0'>Seleccione</option>");
                        $.each(Componentes, function (key, value) {
                            $('#cboComponentePlanAT').append("<option value='" + value.iCodComponenteDesc + "' data-value='" + JSON.stringify(value.iCodComponenteDesc) + "'>" + value.vDescripcion + "</option>");
                        });
                    }).fail((error) => {
                    });

            }
        }).fail((error) => {
            console.log(error);
        });

    $('#cboComponente').on('change', function (e) {
        console.log(e.currentTarget.value);
        //debugger;
        let paginaActual = 1
        let parametro = {
            piPageSize: 100
            , piCurrentPage: paginaActual
            , pvSortColumn: "iCodActividad"
            , pvSortOrder: "asc"
            , iCodIdentificacion: e.currentTarget.value
        };
        debugger;
        $.ajax({
            type: "POST",
            url: globals.urlWebApi + "api/Identificacion/ListarActividadesPorComponente",
            headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
            dataType: 'json',
            data: parametro
        })
            .done(function (actividades) {
                console.log(actividades);

                $('#cboActividades').empty();
                $('#cboActividades').append("<option value='0'>Seleccione</option>");
                $.each(actividades, function (key, value) {
                    $('#cboActividades').append("<option value='" + value.iCodActividad + "' data-value='" + JSON.stringify(value.iCodActividad) + "'>" + value.vDescripcion + "</option>");
                });
                //callback({
                //    data: data,
                //    recordsTotal: data.length !== 0 ? data[0].totalRegistros : 0,
                //    recordsFiltered: data.length !== 0 ? data[0].totalRegistros : 0
                //});
            })
            .fail(function (error) {
                console.log(error);
                cuandoAjaxFalla(error.status);
            });
    });
    $('#cboComponentePlanAT').on('change', function (e) {
        console.log(e.currentTarget.value);
        //debugger;
        let paginaActual = 1
        let parametro = {
            piPageSize: 100
            , piCurrentPage: paginaActual
            , pvSortColumn: "iCodActividad"
            , pvSortOrder: "asc"
            , iCodIdentificacion: e.currentTarget.value
        };
        debugger;
        $.ajax({
            type: "POST",
            url: globals.urlWebApi + "api/Identificacion/ListarActividadesPorComponente",
            headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
            dataType: 'json',
            data: parametro
        })
            .done(function (actividades) {
                console.log(actividades);

                $('#cboActividadesPlanAT').empty();
                $('#cboActividadesPlanAT').append("<option value='0'>Seleccione</option>");
                $.each(actividades, function (key, value) {
                    $('#cboActividadesPlanAT').append("<option value='" + value.iCodActividad + "' data-value='" + JSON.stringify(value.iCodActividad) + "'>" + value.vDescripcion + "</option>");
                });
                //callback({
                //    data: data,
                //    recordsTotal: data.length !== 0 ? data[0].totalRegistros : 0,
                //    recordsFiltered: data.length !== 0 ? data[0].totalRegistros : 0
                //});
            })
            .fail(function (error) {
                console.log(error);
                cuandoAjaxFalla(error.status);
            });
    });
    $('#cboActividades').on('change', function (e) {
        general.tblPlanCapa.draw().clear();
        //general.tblAsist.draw().clear();
        general.tblcosto.draw().clear();
    });

    $('#cboActividadesPlanAT').on('change', function (e) {
        //general.tblPlanCapa.draw().clear();
        general.tblAsist.draw().clear();
        general.tblcostoPlanAT.draw().clear();
    });

    general.tblPlanCapa = $("#tblPlanCapa").DataTable({
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
            $('#tblPlanCapa thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametros = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodPlanCap"
                , pvSortOrder: "asc"
                , iCodActividad:$('#cboActividades').val()// 22
            };
            debugger;
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/PlanCapacitacion/ListarPlanCapacitacion",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametros
            })
                .done(function (data) {
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].iRecordCount : 0,
                        recordsFiltered: data.length !== 0 ? data[0].iRecordCount : 0
                        //holasjdhsjdhsjhdjshdsjhddsdsd

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
            { data: "iCodPlanCap", title: "iCodPlanCap", visible: false, orderable: false },
            { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
            { data: "vModuloTema", title: "Modulo/Tema", visible: true, orderable: false },
            { data: "vObjetivo", title: "Objetivo", visible: true, orderable: false },
            { data: "iMeta", title: "iMeta", visible: false, orderable: false },
            { data: "iBeneficiario", title: "iBeneficiario", visible: false, orderable: false },
            { data: "dFechaActividad", title: "dFechaActividad", visible: false, orderable: false },
            { data: "iTotalTeoria", title: "H. Teoria", visible: true, orderable: false },
            { data: "iTotalPractica", title: "H. Práctica", visible: true, orderable: false },

            {
                data: (row) => {
                    let acciones = `<div class="nav-actions" style="text-align:center">`;
                    let checked = ``;
                    if (row.iCodHito != 0) {
                        checked = ` checked `;
                    }                        
                    //acciones += `<a href="javascript:void(0);" onclick ="VerSesiones(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodPlanCap + `"` + checked+ ` onclick='elegirhito(this,` + row.iCodPlanCap+`,"CP")'>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="AgregarPlanSesion(this);" data-toggle="tooltip" title="Agregar"><i class="bi bi-plus-circle-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="MostrarEditarPlanCapa(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarPlanCapa(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });


    general.tblAsist = $("#tblAsist").DataTable({
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
            $('#tblAsist thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametros = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodPlanCap"
                , pvSortOrder: "asc"
                , iCodActividad: $('#cboActividadesPlanAT').val()
            };
            debugger;
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/PlanAsistenciaTec/ListarPlanAsistenciaTec",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametros
            })
                .done(function (data) {
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].iRecordCount : 0,
                        recordsFiltered: data.length !== 0 ? data[0].iRecordCount : 0
                        //holasjdhsjdhsjhdjshdsjhddsdsd

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
            { data: "iCodPlanAsistenciaTec", title: "iCodPlanAsistenciaTec", visible: false, orderable: false },
            { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
            //{ data: "vModuloTema", title: "Modulo/Tema", visible: true, orderable: false },
            { data: "vObjetivo", title: "Objetivo", visible: true, orderable: false },
            { data: "iMeta", title: "iMeta", visible: false, orderable: false },
            { data: "iBeneficiario", title: "iBeneficiario", visible: false, orderable: false },
            { data: "dFechaActividad", title: "Fecha Inicio", visible: true, orderable: false },
            { data: "dFechaActividadFin", title: "Fecha FIn", visible: true, orderable: false },
            { data: "iTotalTeoria", title: "H. Teoria", visible: true, orderable: false },
            { data: "iTotalPractica", title: "H. Práctica", visible: true, orderable: false },

            {
                data: (row) => {
                    let acciones = `<div class="nav-actions" style="text-align:center">`;
                    let checked = ``;
                    if (row.iCodHito != 0) {
                        checked = ` checked `;
                    }   
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodPlanAsistenciaTec + `"` + checked + ` onclick='elegirhito(this,` + row.iCodPlanAsistenciaTec +`,"AT")'>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerSesiones(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="AgregarPlanSesion(this);" data-toggle="tooltip" title="Agregar"><i class="bi bi-plus-circle-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="MostrarEditarPlanCapa(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarPlanCapa(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
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
                , iCodActividad: $('#cboActividades').val()
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
            { data: "dFecha", title: "Fecha", visible: true, orderable: false },
            { data: "Estado", title: "Estado", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions" style="text-align:center">`;
                    let checked = ``;
                    if (row.iCodHito != 0) {
                        checked = ` checked `;
                    }  
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodCosto + `"` + checked + ` onclick='elegirhito(this,` + row.iCodCosto +`,"CC")'>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="MostrarEditar(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCostos(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    general.tblcostoPlanAT = $("#tblcostoPlanAT").DataTable({
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
                , iCodActividad: $('#cboActividadesPlanAT').val()
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
            { data: "dFecha", title: "Fecha", visible: true, orderable: false },
            { data: "Estado", title: "Estado", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions" style="text-align:center">`;
                    let checked = ``;
                    if (row.iCodHito != 0) {
                        checked = ` checked `;
                    }
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodCosto + `"` + checked + ` onclick='elegirhito(this,` + row.iCodCosto + `,"CC")'>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="MostrarEditar(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCostos(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });
}

function elegirhito(obj, iCodPlanCap,vTipo)
{
    debugger;

    //alert($(obj).is(':checked'));
    //alert(iCodPlanCap);
    //alert(obj);
    let parametro = {};

    parametro.iCodComponente = $('#cboComponente').val();
    parametro.iCodActividad = $('#cboActividades').val();
    parametro.iCodHito = iCodPlanCap;
    parametro.vTipo = vTipo;

    $.ajax({
        type: "POST",
        url: globals.urlWebApi + "api/Hito/InsertarHito",
        headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
        dataType: 'json',
        data: parametro
    })
        .done(function (hito) {
            console.log('grabo');
            console.log(hito);
            
        })
        .fail(function (error) {
            console.log(error);
            cuandoAjaxFalla(error.status);
        });
}

function obtenerComponentes(data) {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/Identificacion/ListarComponentesSelectPlanCapa", headers: { Accept: "application/json" }, dataType: 'json', data: data });
}
