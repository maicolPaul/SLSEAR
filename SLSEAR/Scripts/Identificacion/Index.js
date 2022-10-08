
let general = {
    usuario: 0,
    listatecnologias: [],
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
    iCodComponente: null,
    tblactividades:null
};

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
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: "iCodComponente", title: "iCodComponente", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vDescripcion", title: "vDescripcion", visible: true, orderable: false },
            { data: "vIndicador", title: "vIndicador", visible: true, orderable: false },
            { data: "vUnidadMedida", title: "vUnidadMedida", visible: true, orderable: false },
            { data: "vMeta", title: "vMeta", visible: true, orderable: false },
            { data: "vMedio", title: "vMedio", visible: true, orderable: false },
            //{
            //    data: (row) => {
            //        if (row.iSexo == 1) {
            //            return "MASCULINO";
            //        } else {
            //            return "FEMENINO";
            //        }
            //    }, title: "Sexo", visible: true, orderable: false
            //},
            //{ data: "iPerteneceOrganizacion", title: "iPerteneceOrganizacion", visible: false, orderable: false },
            //{
            //    data: (row) => {
            //        if (row.iEsRepresentante) {
            //            return "SI";
            //        } else {
            //            return "NO";
            //        }
            //    }, title: "Es Representante", visible: true, orderable: false
            //},
            //{
            //    data: (row) => {
            //        if (row.iRecibioCapacitacion) {
            //            return "SI";
            //        } else {
            //            return "NO";
            //        }
            //    }, title: "Recibio Capacitación", visible: true, orderable: false
            //},
            //{ data: "vNombreOrganizacion", title: "Nombre Organizacion", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    acciones += `<a href="javascript:void(0);" onclick ="EditarProductor(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarProductor(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="agregaractividad(this);"  data-toggle="tooltip" title="Agregar Actiividad"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $('#tblcomponentes tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = general.tblcomponentes.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            console.log(row.data());
            tr.addClass('shown');
            general.tblactividades=$('#tblactividades' + row.data().iCodComponente).DataTable({
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
                    $('#tblactividades' + row.data().iCodComponente+' thead').attr('class', 'table-success');
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
                        , iCodIdentificacion: row.data().iCodComponente
                    };
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
                    { data: "iCodActividad", title: "iCodActividad", visible: false, orderable: false },
                    { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
                    { data: "vDescripcion", title: "vDescripcion", visible: true, orderable: false },
                    { data: "vActividad", title: "vActividad", visible: true, orderable: false },
                    { data: "vUnidadMedida", title: "vUnidadMedida", visible: true, orderable: false },
                    { data: "vMeta", title: "vMeta", visible: true, orderable: false },
                    { data: "vMedio", title: "vMedio", visible: true, orderable: false },         
                    {
                        data: (row) => {
                            let acciones = `<div class="nav-actions">`;                            
                            acciones += `<a href="javascript:void(0);" onclick ="EditarProductor(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;                            
                            acciones += `<a href="javascript:void(0);" onclick ="eliminaractividad(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;                            
                            acciones += `</div>`;
                            return acciones;
                        }, title: "Acciones", visible: true, orderable: false
                    }
                ]
            });
        }
    });
}
/* Formatting function for row details - modify as you need */
function format(d) {
    debugger;
    // `d` is the original data object for the row
    return (
        '<table id="tblactividades' + d.iCodComponente +'" class="table table-bordered text-nowrap border-bottom dataTable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '</table>'
    );   
}
function eliminaractividad(obj) {
    general.elementoSeleccionado = general.tblactividades.row($(obj).parents('tr')).data();

    $('#modaleliminaractividad').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminaractividad').modal('show');
    
}
function agregaractividad(obj) {

    general.elementoSeleccionado = general.tblcomponentes.row($(obj).parents('tr')).data();

    general.accion = 1;
    limpiaractividad();
    var contador = ContarActividades(1);
    console.log("actividad 1 -" + contador);
    $('#vactividadact1').val("Actividad 1." + contador);
    $('#modalactividad1').modal({ backdrop: 'static', keyboard: false });
    $('#modalactividad1').modal('show');

}
function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario();
    CargarComponentes();

    var dato = {};

    dato.iCodExtensionista = general.usuario;
    debugger;
    $.post(globals.urlWebApi + "api/Identificacion/ListarIdentificacion", dato)
        .done((respuesta) => {
            console.log("Datos Identificacion");                        
            console.log(respuesta);                        
            if (respuesta.length > 0) {
                general.iCodIdentificacion = respuesta[0].iCodIdentificacion;
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
                $('#vdesccomponente1').val(respuesta[0].vDescComponente1);
                $('#vdesccomponente2').val(respuesta[0].vDescComponente2);

                general.acciongeneral = 2;
                // *cargar tecnologias* //
                var datoidentificacion = {};
                datoidentificacion.iCodIdentificacion = general.iCodIdentificacion;

                $.post(globals.urlWebApi + "api/Identificacion/ListarTecnologias", datoidentificacion)
                    .done((respuesta) => {
                        //console.log(respuesta);
                        if (respuesta.length > 0) {
                            console.table(respuesta);
                            $.each(respuesta, function (key, value) {
                                //alert(key + ": " + value);
                                console.log(key);
                                console.log(value);
                                $("#tbltecnologias > tbody").append("<tr><td>" + value.vtecnologia1.toUpperCase() + "</td><td>" + value.vtecnologia2.toUpperCase() + "</td><td>" + value.vtecnologia3.toUpperCase() + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editartecnologia(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminartecnologia(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                                general.listatecnologias.push({ vtecnologia1: value.vtecnologia1.toUpperCase(), vtecnologia2: value.vtecnologia2.toUpperCase(), vtecnologia3: value.vtecnologia3.toUpperCase() })
                            });                          
                        }
                    });

                $.post(globals.urlWebApi + "api/Identificacion/ListarIndicadores", datoidentificacion)
                    .done((respuesta) => {
                        console.table(respuesta);
                        $.each(respuesta, function (key, value) {
                            $('#tblobjetivo > tbody').append("<tr><td id='" + value.iCodigoIdentificador + "'>" + value.vDescIdentificador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedioVerificacion + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarindicador(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                            
                            general.listaindicadores.push({ iCodigoIdentificador: value.iCodigoIdentificador, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedioVerificacion: value.vMedioVerificacion });
                        });                        
                    });
                // Listar Componentes
                //CargarComponentes();
                general.tblcomponentes.draw().clear();
                $.post(globals.urlWebApi + "api/Identificacion/ListarComponentePorUsuario", datoidentificacion)
                    .done((respuesta) => {
                        console.table(respuesta);
                        $.each(respuesta, function (key, value) {
                            if (value.nTipoComponente == 1) {
                                $('#tblcomponente > tbody').append("<tr><td id='" + value.iCodComponente + "'>" + value.vIndicador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                            } else {
                                $("#tblcomponente2 > tbody").append("<tr><td>" + value.vIndicador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");            
                            }                            
                           // $("#tblcomponente > tbody").append("<tr><td>" + indicador + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medioverificacion + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                            //general.listaindicadores.push({ iCodigoIdentificador: value.iCodigoIdentificador, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedioVerificacion: value.vMedioVerificacion });
                        });
                    });
                
                //Listar Actividades
                var cantidad1 = 0;
                var cantidad2 = 0;

                $.post(globals.urlWebApi + "api/Identificacion/ListarActividades", dato)
                    .done((respuesta) => {
                        console.table(respuesta);
                        $.each(respuesta, function (key, value) {
                            if (value.nTipoActividad == 1) {
                                cantidad1++;
                                //$('#tblcomponente > tbody').append("<tr><td id='" + value.iCodComponente + "'>" + value.vIndicador + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                                $('#tblActividades1 > tbody').append("<tr id=1" + cantidad1 + "><td>" + value.vActividad + "</td><td>" + value.vDescripcion + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editaractividad(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminaractividad(this,1);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
                                general.listaactividades.push({ id: "1" + cantidad1, vActividad: value.vActividad, vDescripcion: value.vDescripcion, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedio: value.vMedio, nTipoActividad: value.nTipoActividad });    
                            } else {
                                cantidad2++
                                $("#tblActividades2 > tbody").append("<tr id=2" + cantidad2 + "><td>" + value.vActividad + "</td><td>" + value.vDescripcion + "</td><td>" + value.vUnidadMedida + "</td><td>" + value.vMeta + "</td><td>" + value.vMedio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminaractividad(this,2);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");                                
                                general.listaactividades.push({ id: "2" +cantidad2, vActividad: value.vActividad, vDescripcion: value.vDescripcion, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedio: value.vMedio, nTipoActividad: value.nTipoActividad });
                            }                           
                        });
                    });

            }            
        });

    $('#btneliminaractividad').on('click', function () {
        //alert('elimino');
        console.log(general.elementoSeleccionado);

        let datos = {};
        datos.iCodActividad = general.elementoSeleccionado.iCodActividad;

        $.post(globals.urlWebApi + "api/Identificacion/EliminarActividad", datos)
            .done((respuesta) => {
                if (respuesta.iCodActividad != 0) {
                    general.tblactividades.draw().clear();
                    $('#modaleliminaractividad').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });

    });

    $('#btnagregarcausasdirectas').on('click', function () {
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

        AgregarCausadirecta($('#vcausadirecta').val());
        $('#modalcausasdirectas').modal('hide');   
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
        //debugger;        
            AgregarTecnologia(general.indiceseleccionado, $('#vtecnologia1').val(), $('#vtecnologia2').val(), $('#vtecnologia3').val());
             
        limpiar();
        $('#modaltecnologia').modal('hide');   
    })
    $('#btnagregartecnologia').on('click', function () {
        general.indiceseleccionado = 0;
        limpiar();
        $('#modaltecnologia').modal({ backdrop: 'static', keyboard: false });
        $('#modaltecnologia').modal('show');   
    });
    $('#btnagregarefectosdirectos').on('click', function () {

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
        AgregarEfectoIndirecto($('#vefectodirecto').val());
        $('#modalefectosdirectos').modal('hide');  
    });
    $('#btnguardar').on('click', function () {       
        //debugger;
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
        if ($('#vdesccomponente1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Componente",
                type: "error"
            });
            $('#vdesccomponente1').focus();
            return;
        }
        if ($('#vdesccomponente2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Componente",
                type: "error"
            });
            $('#vdesccomponente2').focus();
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
        datos.vDescComponente1 = $('#vdesccomponente1').val();
        datos.vDescComponente2 = $('#vdesccomponente2').val();

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

        $.each(general.listaindicadores, function (key, value)  {
            indicadores.push({ iCodigoIdentificador: value.iCodigoIdentificador, vUnidadMedida: value.vUnidadMedida, vMeta: value.vMeta, vMedioVerificacion: value.vMedioVerificacion});
        });

        datos.listaindicadores = indicadores;

        datos.listacausasdirectas = general.listacausasdirectas;

        var causasindirectas = new Array();

        $.each(general.listacausasdirectas, function (key, value) {
            var id = value.id;
            $.each(value.listacaudasindirecta, function (key1, value1) {
                causasindirectas.push({ iCodCausaDirecta: id, vDescrCausaInDirecta:value1.vdescrcausadirecta });
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

        console.log(datos);
                
        $.post(globals.urlWebApi + "api/Identificacion/InsertarIdentificacion", datos)
            .done((respuesta) => {
                if (respuesta.iCodIdentificacion != 0) {                    
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#tblcausasdirectas').on('click', '.btnaddcausaindirecta', function (event) {
        $('#vcausaindirecta').val('');
        $('#btnguardarcausasindirectas').attr('tabla', $("#" + event.target.id).attr('tabla'));
        $('#modalcausasindirectas').modal({ backdrop: 'static', keyboard: false });
        $('#modalcausasindirectas').modal('show');   
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

        var tabla = $('#' + event.target.id).attr('tabla');
        var vefectoindirecto = $('#vefectoindirecto').val();
        AgregarEfectosIndirectosaDirectos(vefectoindirecto);
        $("#" + tabla + " > tbody").append("<tr><td>" + vefectoindirecto.toUpperCase() + "</td><td><a href='javascript:void(0);' onclick ='eliminarefectoindirecto(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></td></tr>");
            
        $('#modalefectosindirectos').modal('hide');
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

        if (general.accion == 1) {
            general.listaindicadores.push({ iCodigoIdentificador: $('#cboindicador').val(), vUnidadMedida: $("#vunidadmedidaind").val(), vMeta: $("#vmeta").val(), vMedioVerificacion: $("#vmedio").val() });
            $('#tblobjetivo > tbody').append("<tr><td id=" + $('#cboindicador').val()+">" + $('#cboindicador option:selected').text() + "</td><td>" + $('#vunidadmedidaind').val() + "</td><td>" + $('#vmeta').val() + "</td><td>" + $('#vmedio').val() + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarindicador(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
        } else {
            general.tractual.cells[0].innerHTML = $('#cboindicador option:selected').text();
            general.tractual.cells[1].innerHTML = $('#vunidadmedidaind').val();
            general.tractual.cells[2].innerHTML = $('#vmeta').val();    
            general.tractual.cells[3].innerHTML = $('#vmedio').val();    


            general.listaindicadores[general.indiceseleccionado - 1].iCodigoIdentificador = $('#cboindicador').val();
            general.listaindicadores[general.indiceseleccionado - 1].vUnidadMedida = $('#vunidadmedidaind').val();
            general.listaindicadores[general.indiceseleccionado - 1].vMeta = $('#vmeta').val();
            general.listaindicadores[general.indiceseleccionado - 1].vMedioVerificacion = $('#vmedio').val();

        }        
        
        $('#modalobjetivo').modal('hide');
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

        //if (general.accion == 1) {
        //    $("#tblcomponente > tbody").append("<tr><td>" + indicador + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medioverificacion + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editarcomponente(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
        //    general.listacomponente.push({ vIndicador: indicador, vUnidadMedida: unidadmedida, vMeta: meta, vMedio: medioverificacion, nTipoComponente:1});


        //} else {
        //    general.tractual.cells[0].innerHTML = indicador;
        //    general.tractual.cells[1].innerHTML = unidadmedida;
        //    general.tractual.cells[2].innerHTML = meta;
        //    general.tractual.cells[3].innerHTML = medioverificacion;
        //}        
        let datos = {};
        datos.iCodIdentificacion = general.iCodIdentificacion;
        datos.vDescripcion = $('#vdescripcioncom').val();
        datos.vIndicador = indicador;
        datos.vUnidadMedida = unidadmedida;
        datos.vMeta = meta;

        datos.vMedio = medioverificacion;
        datos.nTipoComponente = 1;

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

        datos.iCodIdentificacion = general.elementoSeleccionado.iCodComponente;
        datos.vActividad = actividad;
        datos.vDescripcion = descripcion;
        datos.vUnidadMedida = unidadmedida;
        datos.vMeta = meta;
        datos.vMedio = medio;
        datos.nTipoActividad = 1;

        $.post(globals.urlWebApi + "api/Identificacion/InsertarActividad", datos)
            .done((respuesta) => {
                if (respuesta.iCodComponente != 0) {
                    //$('#modalcomponente1').modal('hide');
                    general.tblcomponentes.draw().clear();
                    $('#tblactividades' + datos.iCodComponente).draw().clear();
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });

        //if (general.accion == 1) {
        //    //debugger;
        //    var cantidad = general.listaactividades.length == 0 ? 1 : general.listaactividades.length+1;

        //    $('#tblactividades47 > tbody').append("<tr id=1" + cantidad + " ><td>" + descripcion + "</td><td>" + actividad + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editaractividad(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
        //    general.listaactividades.push({ id: "1" + cantidad, vDescripcion: descripcion, vActividad: actividad, vUnidadMedida: unidadmedida, vMeta: meta, vMedio: medio, nTipoActividad:1});
        //} else {
        //    general.tractual.cells[0].innerHTML = actividad;
        //    general.tractual.cells[1].innerHTML = descripcion;
        //    general.tractual.cells[2].innerHTML = unidadmedida;     
        //    general.tractual.cells[3].innerHTML = meta;     
        //    general.tractual.cells[4].innerHTML = medio;     
        //}
        
        $('#modalactividad1').modal('hide');
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
            console.log("actividad 2 - " +contador);
            $('#tblActividades2 > tbody').append("<tr id=2"+contador+"><td>" + actividad + "</td><td>" + descripcion + "</td><td>" + unidadmedida + "</td><td>" + meta + "</td><td>" + medio + "</td><td><div class='nav-actions'><a href='javascript:void(0);' onclick ='editaractividad2(this);' data-toggle='tooltip' title='Editar'><i class='bi bi-pencil'></i></a><a href='javascript:void(0);' onclick ='eliminarindicador(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></div></td></tr>");
            general.listaactividades.push({ id: "2" + contador,vActividad: actividad, vDescripcion: descripcion, vUnidadMedida: unidadmedida, vMeta: meta, vMedio: medio, nTipoActividad: 2 });
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
        console.log(event);
        var tabla = $('#' + event.target.id).attr('tabla');
        var vcausaindirecta = $('#vcausaindirecta').val();

        AgregarindirectasaDirectas(vcausaindirecta);

        $("#" + tabla + " > tbody").append("<tr><td>" + vcausaindirecta.toUpperCase() + "</td><td><a href='javascript:void(0);' onclick ='eliminarcausaindirecta(this);' data-toggle='tooltip' title='Eliminar'><i class='bi bi-trash-fill'></i></a></td></tr>");
        $('#modalcausasindirectas').modal('hide');   
    });
    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu22').css('color', '#6c5ffc');  
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
   $('#vactividadact1').val('');
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
function AgregarEfectoIndirecto(efectodirecto) {
    var cantidadfilas = 0;

    $("#tblefectosdirectos tr.clsfilaefectodirecto").each(function (index, value) {
        cantidadfilas = cantidadfilas + 1;
    });

    $("#tblefectosdirectos > tbody").append("<tr id='" + cantidadfilas +"' class='clsfilaefectodirecto'><td>" + efectodirecto.toUpperCase() + "</td><td><img src='../Content/assets/images/plus.png' alt='Agregar Causa Indirecta' onclick='fila1(this)' style='cursor: pointer'/></td></tr>");    
    
    general.listaefectosdirectos.push({ id: cantidadfilas, vdescefectodirecto: efectodirecto, listaefectoindirecto:[]});
}

//function eliminaractividad(obj, ind) {
//    debugger;
//    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
//    var indice = obj.parentElement.parentElement.parentElement.id;

//    console.log(general.indiceseleccionado);
//    let table;
//    if (ind == 1) {
//        table = document.getElementById('tblActividades1');
//    } else {
//        table = document.getElementById('tblActividades2');
//    }
    
//    table.deleteRow(general.indiceseleccionado);

//      $.each(general.listaactividades, function (key, value) {
//        if (value.id == indice & value.nTipoActividad==ind) {
//            //general.indiceseleccionado = key; 
//            general.listaactividades.splice(key, 1);
//            return false;
//        }
//    });

//}

function eliminarcausaindirecta(obj) {    
    console.log(obj.parentElement.parentElement.rowIndex);
    var indicefila = obj.parentElement.parentElement.rowIndex;
    let table = document.getElementById(obj.parentElement.parentElement.parentElement.parentElement.id);
    table.deleteRow(indicefila);    
}

function eliminarefectoindirecto(obj) {
    var indicefila = obj.parentElement.parentElement.rowIndex;
    let table = document.getElementById(obj.parentElement.parentElement.parentElement.parentElement.id);
    table.deleteRow(indicefila);
}

function editartecnologia(obj) {    
    var listafila = new Array()
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;

    listafila = obj.parentElement.parentElement.parentElement.cells;
    $('#vtecnologia1').val(listafila[0].innerText);
    $('#vtecnologia2').val(listafila[1].innerText);
    $('#vtecnologia3').val(listafila[2].innerText);
    console.table(listafila);

    $('#modaltecnologia').modal({ backdrop: 'static', keyboard: false });
    $('#modaltecnologia').modal('show');   
}

function eliminarindicador(obj) {
    
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    console.log(general.indiceseleccionado);
        
    let table = document.getElementById('tblobjetivo');
    table.deleteRow(general.indiceseleccionado);



    general.listaindicadores.splice(general.indiceseleccionado - 1, 1);

}
function editarindicador(obj) {
    limpiarindicadores();
    general.indiceseleccionado = obj.parentElement.parentElement.parentElement.rowIndex;
    general.tractual = obj.parentElement.parentElement.parentElement;
    var listafila = new Array();
    listafila = obj.parentElement.parentElement.parentElement.cells;
    console.table(listafila);
    //debugger;
    general.accion = 2;

    $('#cboindicador').val(listafila[0].id);
    $('#vunidadmedidaind').val(listafila[1].innerText);
    $('#vmeta').val(listafila[2].innerText);
    $('#vmedio').val(listafila[3].innerText);

    general.listaindicadores[general.indiceseleccionado - 1].iCodigoIdentificador = $('#cboindicador').val();
    general.listaindicadores[general.indiceseleccionado - 1].vUnidadMedida = $('#vunidadmedidaind').val();
    general.listaindicadores[general.indiceseleccionado - 1].vMeta = $('#vmeta').val();
    general.listaindicadores[general.indiceseleccionado - 1].vMedioVerificacion = $('#vmedio').val();

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