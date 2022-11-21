let general = {
    usuario: 0,
    iCodActividad:0,
    tblactividad: null,
    tblPlanCapa: null,
    tblPlanSesion: null,
    elementoSeleccionado: null,
    planCapaSeleccionado: null,
    planSesionSeleccionado: null,
    accion:1
};

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    /**************************************************/

    //$('#cboComponente').empty();
    //$('#cboComponente').append("<option value=''>Seleccione</option>");
    //debugger;
    //$.when(obtenerComponentes({ iCodExtensionista: general.usuario }))
    //    .done((niveles) => {
    //        debugger;
    //        $.each(niveles, function (key, value) {
    //            $('#cboComponente').append("<option value='" + value.iCodComponente + "' data-value='" + JSON.stringify(value.iCodComponente) + "'>" + value.vDescripcion + "</option>");
    //        });
    //    });
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

    //$('#btnvistaprevia').on('click', function () {
    //    var datos = {};
    //    datos.iCodExtensionista = general.usuario;

    //    openData('POST', globals.urlWebApi + 'api/costo/ExportarCostos', datos, '_blank');
    //});

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
            { data: "vDescripcion", title: "Descripcion", visible: true, orderable: false },
            { data: "vUnidadMedida", title: "Unidad Medida", visible: true, orderable: false },
            { data: "vMeta", title: "Meta", visible: true, orderable: false },
            { data: "vMedio", title: "Medio", visible: true, orderable: false },
            //{ data: "dFecha", title: "Fecha", visible: true, orderable: false },
            //{ data: "Estado", title: "Estado", visible: false, orderable: false },

            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick ="VerPlanCapa(this);" data-toggle="tooltip" title="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="AgregarPlanCapa(this);" data-toggle="tooltip" title="Agregar"><i class="bi bi-plus-circle-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCosto(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
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
            $('#tblComunidadOpa1 thead').attr('class', 'table-success');
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
               , iCodActividad: general.elementoSeleccionado !== null ? general.elementoSeleccionado.iCodActividad : 0            
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
                    let acciones = `<div class="nav-actions">`;
                    acciones += `<a href="javascript:void(0);" onclick ="VerSesiones(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="AgregarPlanSesion(this);" data-toggle="tooltip" title="Agregar"><i class="bi bi-plus-circle-fill"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="MostrarEditarPlanCapa(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarPlanCapa(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    general.tblPlanSesion = $("#tblPlanSesion").DataTable({
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
            $('#tblComunidadOpa1 thead').attr('class', 'table-success');
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
                , iCodPlanCap: general.planCapaSeleccionado !== null ? general.planCapaSeleccionado.iCodPlanCap : 0
            };
            debugger;
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/PlanCapacitacion/ListarPlanSesion",
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
            { data: "iCodPlanSesion", title: "iCodPlanSesion", visible: false, orderable: false },
            { data: "iCodPlanCap", title: "iCodPlanCap", visible: false, orderable: false },
            { data: "iDuracion", title: "Duracion", visible: true, orderable: false },
            { data: "vTematica", title: "Tematica", visible: true, orderable: false },
            { data: "vDescripMetodologia", title: "Descripción Metodologia", visible: true, orderable: false },
            { data: "vMateriales", title: "Materiales", visible: true, orderable: false },
         

            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    acciones += `<a href="javascript:void(0);" onclick ="VerSesiones(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="MostrarEditarPlanSesion(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarPlanSesion(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
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
        debugger;
        var datos = {};

        datos.iCodPlanCap = general.planCapaSeleccionado.iCodPlanCap;
        datos.dFechaActividad = general.planCapaSeleccionado.dFechaActividad;
        datos.iopcion = general.accion;

        $.post(globals.urlWebApi + "api/PlanCapacitacion/InsertarPlanCapacitacion", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblPlanCapa.clear().draw();
                $('#modaleliminarPlanCapa').modal('hide');
            }).fail((error) => {
                console.log(error);
            });   
    });

    $('#btnguardar').on('click', function () {
        var vModuloTema = $('#vModuloTema').val();
        var vObjetivo = $('#vObjetivo').val();
        var iMeta = $('#iMeta').val();
        var iBeneficiario = $('#iBeneficiario').val();
        var vdia = $('#vdia').val();
        var iTotalTeoria = $('#iTotalTeoria').val();
        var iTotalPractica = $('#iTotalPractica').val();

        var iCodPlanCap = general.planCapaSeleccionado == null ? 0 : general.planCapaSeleccionado.iCodPlanCap;

        if (vModuloTema.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Modulo/Tema",
                type: "error"
            });
            $('#vModuloTema').focus();
            return;
        }

        if (vObjetivo.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Objetivo",
                type: "error"
            });
            $('#vObjetivo').focus();
            return;
        } 

        if (iMeta.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Meta",
                type: "error"
            });
            $('#iMeta').focus();
            return;
        } else {
            if (iMeta <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El Valor de la meta debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }

        if (iBeneficiario.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Cantidad Beneficiarios",
                type: "error"
            });
            $('#iBeneficiario').focus();
            return;
        } else {
            if (iMeta <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El Valor de la cantidad de los beneficiarios debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }

        if ($('#vdia').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Dia",
                type: "error"
            });
            $('#vdia').focus();
            return;
        }

        if (iTotalTeoria.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Total de Horas Teóricas",
                type: "error"
            });
            $('#iTotalTeoria').focus();
            return;
        } else {
            if (parseInt(iTotalTeoria) <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El valor del Horas Teóricas debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }

        if (iTotalPractica.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Total de Horas Prácticas",
                type: "error"
            });
            $('#iTotalPractica').focus();
            return;
        } else {
            if (parseInt(iTotalPractica) <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El valor del Horas Prácticas debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }

        
        var datos = {};
        datos.iCodPlanCap = iCodPlanCap;
        datos.iCodActividad = general.elementoSeleccionado.iCodActividad;
        datos.vModuloTema = vModuloTema;
        datos.vObjetivo = vObjetivo;
        datos.iMeta = parseInt(iMeta);
        datos.iBeneficiario = parseInt(iBeneficiario);
        datos.dFechaActividad = vdia;
        datos.iTotalTeoria = parseInt(iTotalTeoria);
        datos.iTotalPractica = parseInt(iTotalPractica);
        datos.iopcion = general.accion;
        
        //if (general.accion == 2) {
        //    datos.iCodPlanCap = general.costoSeleccionado.iCodPlanCap;
        //}       

        $.post(globals.urlWebApi + "api/PlanCapacitacion/InsertarPlanCapacitacion", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblPlanCapa.clear().draw();
                $('#modalplan').modal('hide');                
            }).fail((error) => {
                console.log(error);
            });        
    });

    $('#btnguardarsesion').on('click', function () {
        var iDuracion = $('#iDuracion').val();
        var vTematica = $('#vTematica').val();
        var vDescripMetodologia = $('#vDescripMetodologia').val();
        var vMateriales = $('#vMateriales').val();
     

        var iCodPlanSesion = general.planSesionSeleccionado == null ? 0 : general.planSesionSeleccionado.iCodPlanSesion;

        if (vTematica.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Tematica/Tema",
                type: "error"
            });
            $('#vTematica').focus();
            return;
        }

        if (vDescripMetodologia.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar descrip de metodologia",
                type: "error"
            });
            $('#vDescripMetodologia').focus();
            return;
        }

        if (iDuracion.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Duración",
                type: "error"
            });
            $('#iDuracion').focus();
            return;
        } else {
            if (iDuracion <= 0) {
                notif({
                    msg: "<b>Incorrecto:</b>El Valor de la Duración debe ser mayor a 0",
                    type: "error"
                });
                return;
            }
        }

        if (vMateriales.trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b>Ingresar Materiales",
                type: "error"
            });
            $('#vMateriales').focus();
            return;
        }

        debugger;
        var datos = {};
        datos.iCodPlanSesion = iCodPlanSesion;
        datos.iDuracion = parseInt(iDuracion);
        datos.iCodPlanCap = general.planCapaSeleccionado.iCodPlanCap;
        datos.vTematica = vTematica;
        datos.vDescripMetodologia = vDescripMetodologia;
        datos.vMateriales = vMateriales;
        datos.iopcion = general.accion;

        //if (general.accion == 2) {
        //    datos.iCodPlanCap = general.costoSeleccionado.iCodPlanCap;
        //}       

        $.post(globals.urlWebApi + "api/PlanCapacitacion/InsertarPlanSesion", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblPlanSesion.clear().draw();
                $('#modalplanSesion').modal('hide');
            }).fail((error) => {
                console.log(error);
            });
    });

    $('#btneliminarcosto1').on('click', function () {
        debugger;
        var datos = {};

        datos.iCodPlanSesion = general.planSesionSeleccionado.iCodPlanSesion;
        datos.dFechaActividad = general.planSesionSeleccionado.dFechaActividad;
        //datos.dFechaActividadFin = general.planSesionSeleccionado.dFechaActividadFin;
        datos.iopcion = general.accion;

        $.post(globals.urlWebApi + "api/PlanCapacitacion/InsertarPlanSesion", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                general.tblPlanSesion.clear().draw();
                $('#modaleliminarPlanCapa1').modal('hide');
            }).fail((error) => {
                console.log(error);
            });
    });
    

    $('#btnvistaprevia').on('click', function () {
        //alert('vista previa');
        var datos = {};
        datos.iCodExtensionista = general.usuario;

        openData('POST', globals.urlWebApi + 'api/PlanCapacitacion/ExportarPlanCapa', datos, '_blank');
    });


    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu25').css('color', '#6c5ffc');
}

function eliminarPlanSesion(obj) {
    general.accion = 3;
    general.planSesionSeleccionado = general.tblPlanSesion.row($(obj).parents('tr')).data();
    $('#modaleliminarPlanCapa1').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarPlanCapa1').modal('show');
}

function MostrarEditarPlanSesion(obj) {
    //debugger;
    general.accion = 2;
    general.planSesionSeleccionado = general.tblPlanSesion.row($(obj).parents('tr')).data();
    $("#vModulo").val(general.planCapaSeleccionado.vModuloTema);
    $("#iDuracion").val(general.planSesionSeleccionado.iDuracion);
    $("#vTematica").val(general.planSesionSeleccionado.vTematica);
    $("#vDescripMetodologia").val(general.planSesionSeleccionado.vDescripMetodologia);
    $("#vMateriales").val(general.planSesionSeleccionado.vMateriales);

    $('#modalplanSesion').modal({ backdrop: 'static', keyboard: false });
    $('#modalplanSesion').modal('show');
}

function MostrarEditarPlanCapa(obj) {
    debugger;
    general.accion = 2;
    general.planCapaSeleccionado = general.tblPlanCapa.row($(obj).parents('tr')).data();
    $("#vActividad").val(general.elementoSeleccionado.vActividad);
    $("#vModuloTema").val(general.planCapaSeleccionado.vModuloTema);
    $("#vObjetivo").val(general.planCapaSeleccionado.vObjetivo);
    $("#iMeta").val(general.planCapaSeleccionado.iMeta);
    $("#iBeneficiario").val(general.planCapaSeleccionado.iBeneficiario);
    $("#vdia").val(general.planCapaSeleccionado.dFechaActividad);
    $("#iTotalTeoria").val(general.planCapaSeleccionado.iTotalTeoria);
    $("#iTotalPractica").val(general.planCapaSeleccionado.iTotalPractica);

    $('#modalplan').modal({ backdrop: 'static', keyboard: false });
    $('#modalplan').modal('show');
}

//function obtenerComponentes(data) {

//    return $.ajax({
//        type: "POST",
//        url: globals.urlWebApi + "api/PlanCapacitacion/ComponentesPorExtensionista",
//        headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ },
//        dataType: 'json',
//        data: data
//    });
//}
function obtenerComponentes(data) {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/Identificacion/ListarComponentesSelect", headers: { Accept: "application/json" }, dataType: 'json', data: data });
}

function VerSesiones(obj) {
    general.planCapaSeleccionado = general.tblPlanCapa.row($(obj).parents('tr')).data();
    general.tblPlanSesion.clear().draw();
}

function modalplanSesion(obj) {
    general.planCapaSeleccionado = general.tblPlanCapa.row($(obj).parents('tr')).data();
    general.tblPlanSesion.clear().draw();
}

function AgregarPlanSesion(obj) {
    //debugger;
    general.accion = 1;
    general.planCapaSeleccionado = general.tblPlanCapa.row($(obj).parents('tr')).data();
    $('#vModulo').val(general.planCapaSeleccionado.vModuloTema);
    $('#modalplanSesion').modal({ backdrop: 'static', keyboard: false });
    $('#modalplanSesion').modal('show');
}

function VerPlanCapa(obj) {
    general.elementoSeleccionado = general.tblactividad.row($(obj).parents('tr')).data();
    general.tblPlanCapa.clear().draw();
    general.tblPlanSesion.clear().draw();
}

function limpiar() {
    $('#vActividad').val('');
    $('#vModuloTema').val('');
    $('#vObjetivo').val('');
    $('#iMeta').val('');
    $('#iBeneficiario').val('');
    $('#vdia').val('');
    $('#iTotalTeoria').val('');
    $('#iTotalPractica').val('');
   
}

function AgregarPlanCapa(obj) {
    limpiar();
    general.accion = 1;
    general.elementoSeleccionado = general.tblactividad.row($(obj).parents('tr')).data();
    //$('#vActividad').val(general.elementoSeleccionado.vActividad);
    $('#modalplan').modal({ backdrop: 'static', keyboard: false });
    $('#modalplan').modal('show'); 
}

//function eliminarCostos(obj) {
//    var indicefila = obj.parentElement.parentElement.rowIndex;
//    let table = document.getElementById('tblobjetivo');
//    table.deleteRow(indicefila);
//}


function eliminarPlanCapa(obj) {
    general.accion = 3;
    general.planCapaSeleccionado = general.tblPlanCapa.row($(obj).parents('tr')).data();
    $('#modaleliminarPlanCapa').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarPlanCapa').modal('show');    
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
    $('#vdia').val(general.costoSeleccionado.vFecha);
    $('#modalplan').modal({ backdrop: 'static', keyboard: false });
    $('#modalplan').modal('show');
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