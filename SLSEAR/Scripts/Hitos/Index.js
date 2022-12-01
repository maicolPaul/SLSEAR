let general = {
    usuario: 0,
    tblcronograma: null,
    elementoSeleccionado: null,
    iCodIdentificacion: 0,
    accion: 1,
    tblPlanCapa: null,
    tblAsist: null,
    tblcosto: null,
    tblcostoPlanAT: null,
    tablaproductores: null,
    Tipo:null
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
        //debugger;
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
        //debugger;
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
                , iCodActividad: $('#cboActividades').val()// 22
                , iCodExtensionista : general.usuario
            };
            //debugger;
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
            { data: "porcentaje", title: "Porcentaje", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions" style="text-align:center">`;
                    let checked = ``;
                    if (row.iCodHito != 0) {
                        checked = ` checked `;
                    }                        
                    
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodPlanCap + `"` + checked + ` onclick='elegirhito(this,` + row.iCodPlanCap + `,"CP")'>`;
                    acciones += `<a href="javascript:void(0);" onclick ="VerProductores(this,'CP');" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    /*acciones += `<a href="javascript:void(0);" onclick ="AgregarPlanSesion(this);" data-toggle="tooltip" title="Agregar"><i class="bi bi-plus-circle-fill"></i></a>&nbsp&nbsp&nbsp`;*/
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
                , iCodExtensionista: general.usuario
            };
            //debugger;
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
            { data: "vObjetivo", title: "Objetivo", visible: false, orderable: false },
            { data: "vObjetivoCorta", title: "Objetivo", visible: true, orderable: false },            
            { data: "iMeta", title: "iMeta", visible: false, orderable: false },
            { data: "iBeneficiario", title: "iBeneficiario", visible: false, orderable: false },
            { data: "dFechaActividad", title: "Fecha Inicio", visible: true, orderable: false },
            { data: "dFechaActividadFin", title: "Fecha FIn", visible: true, orderable: false },
            { data: "iTotalTeoria", title: "H. Teoria", visible: true, orderable: false },
            { data: "iTotalPractica", title: "H. Práctica", visible: true, orderable: false },
            { data: "porcentaje", title: "porcentaje", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions" style="text-align:center">`;
                    let checked = ``;
                    if (row.iCodHito != 0) {
                        checked = ` checked `;
                    }                       
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodPlanAsistenciaTec + `"` + checked + ` onclick='elegirhito(this,` + row.iCodPlanAsistenciaTec + `,"AT")'>`;
                    acciones += `<a href="javascript:void(0);" onclick ="VerProductores(this,'AT');" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
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
            $('#tblcosto thead').attr('class', 'table-success');
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
            $('#tblcostoPlanAT thead').attr('class', 'table-success');
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
                //, 
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

    general.tablaproductores = $("#tblproductores").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: false
        ,lengthMenu: [50]
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            //$('select[name="tblComunidadOpa_length"]').formSelect();
            //$('.tooltipped').tooltip();
            $('#tblproductores thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            //let paginaActual = 1 + (parseInt(settings._iDisplayStart) / );
            let parametro = {
                piPageSize:parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodProductor"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iPerteneceOrganizacion: 1
                , vTipo :general.vTipo==null ? "" : general.vTipo
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
            { data: "vCelular", title: "Celular", visible: false, orderable: false },
            { data: "iEdad", title: "Edad", visible: false, orderable: false },
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
                    let checked = ``;
                    if (row.iCodProEje != 0) {
                        checked = ` checked `;
                    }
                    acciones += `<input type="checkbox" class="form-check-input" id="chk` + row.iCodProductor + `"` + checked + ` onclick='elegirproductor(this,` + row.iCodProductor + `)'>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    //acciones += `<a href="javascript:void(0);" onclick ="EditarProductor(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarProductor(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

}
function VerProductores(obj, vTipo) {       
    $('#dfechacapa').val('');
    general.vTipo = vTipo;
    general.tablaproductores.draw().clear();
    $('#modalproductores').modal({ backdrop: 'static', keyboard: false });
    $('#modalproductores').modal('show');
    
}
function elegirproductor(obj, icodproductor) {

    if ($('#dfechacapa').val() != "") {
        let parametro = {};

        if (general.vTipo == "CP") {
            
            parametro.iCodComponente = $('#cboComponente').val();
            parametro.iCodActividad = $('#cboActividades').val();
            parametro.iCodProductor = icodproductor;
            parametro.dFechaCapa = $('#dfechacapa').val();
            parametro.vTipo = general.vTipo;
        }else{
            parametro.iCodComponente = $('#cboComponentePlanAT').val();
            parametro.iCodActividad = $('#cboActividadesPlanAT').val();
            parametro.iCodProductor = icodproductor;
            parametro.dFechaCapa = $('#dfechacapa').val();
            parametro.vTipo = general.vTipo;
        }   

        $.ajax({
            type: "POST",
            url: globals.urlWebApi + "api/Hito/InsertarProductorEje",
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
    } else {
        debugger;
        $(obj).prop('checked', false);
        notif({
            msg: "<b>Incorrecto:</b>Ingresar Fecha Capacitacion",
            type: "error"
        });
    }
    
    //alert(icodproductor);
}

function elegirhito(obj, iCodPlanCap,vTipo)
{
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
