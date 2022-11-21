let general = {
    usuario: 0,
    iCodCorte: 0,
    tblcortes: null,
    iCodCorteDetalle:0
}
function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario();

    let datos = {};
    datos.iCodExtensionista = general.usuario;

    $.post(globals.urlWebApi + "api/FichaTecnica/ListarFichaTecnica", datos)
        .done((respuesta) => {
            debugger;
            if (respuesta.length > 0) {
                if (respuesta[0].iCodFichaTecnica != 0) {
                    console.log('Ficha Tecnica');
                    console.log(respuesta[0].iCodFichaTecnica);
                    //Inicio de Obtener Corte Cabecera

                    let datos1 = {};

                    datos1.iCodFichaTecnica = respuesta[0].iCodFichaTecnica;

                    $.post(globals.urlWebApi + "api/Cortes/ObtenerCorteCabecera", datos1)
                        .done((respuesta) => {
                            debugger;                     
                            if (respuesta.iCodCorte != 0) {
                                console.log('Corte Cabecera');
                                general.iCodCorte = respuesta.iCodCorte;
                                $('#dFechaInicio').val(respuesta.dFechaInicioReal);
                                $('#dFechaFin').val(respuesta.dFechaFinReal);
                                general.tblcortes.draw().clear();
                                $('#btnagregarcorte').attr('disabled', false);
                                retornarcalculomeses();
                            } else {
                                $('#btnagregarcorte').attr('disabled', true);
                            }
                        });

                    // Fin de Obtener Corte Cabecera

                }
            }            
        });

    $('#btneliminarcorteOK').on('click', function () {
        //alert(general.iCodCorteDetalle);
        let datos = {};

        datos.iCodCorteDetalle = general.iCodCorteDetalle;

        $.post(globals.urlWebApi + "api/Cortes/EliminarCorteDetalle", datos)
            .done((respuesta) => {
                if (respuesta.iCodCorteDetalle != 0) {
                    $('#modaleliminarcorte').modal('hide');
                    general.tblcortes.draw().clear();
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });

    });

    $('#dFechaInicio').on('change', function (e) {
        retornarcalculomeses();
    });   

    $('#dFechaFin').on('change', function (e) {
        retornarcalculomeses();
    });   
    

    $('#btnagregarcorte').on('click', function () {
        $('#txtdias').val('');
        $('#modalasignarCorte').modal({ backdrop: 'static', keyboard: false });
        $('#modalasignarCorte').modal('show');  
    });

    $('#btnasignar').on('click', function () {
        if ($('#txtdias').val() == '') {
            notif({
                msg: "<b>Incortecto:</b> Debe Ingresar Dias",
                type: "error"
            });
            return;
        }

        let datos = {};

        datos.iCodCorte = general.iCodCorte;
        datos.idias = $('#txtdias').val();
        
        $.post(globals.urlWebApi + "api/Cortes/InsertarCorteDetalle", datos)
            .done((respuesta) => {
                debugger;
                if (respuesta.iCodCorteDetalle > 0) {                   
                    $('#modalasignarCorte').modal('hide');  
                    general.tblcortes.draw().clear();
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });                    
                }
                if (respuesta.iCodCorteDetalle == 0) {
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "error"
                    });
                }
                if (respuesta.iCodCorteDetalle == -1) {
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "error"
                    });
                }
            });


    });

    $('#btnregistrar').on('click', function () {

        if ($('#dFechaInicio').val() == '') {
            $('#dFechaInicio').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe Ingresar Fecha Inicio",
                type: "error"
            });
            return;
        }

        if ($('#dFechaFin').val() == '') {
            $('#dFechaFin').focus();
            notif({
                msg: "<b>Incortecto:</b> Debe Ingresar Fecha Fin",
                type: "error"
            });
            return;
        }

        var f1 = new Date($('#dFechaInicio').val());
        var f2 = new Date($('#dFechaFin').val());

        if (f1 >= f2) {

            notif({
                msg: "<b>Correcto:</b> La Fecha Inicio Real debe ser Menor a Fecha Final Real",
                type: "error"
            });

            return;
        }

        let datos = {};

        datos.iCodFichaTecnica = general.usuario;
        datos.dFechaInicioReal = $('#dFechaInicio').val();
        datos.dFechaFinReal = $('#dFechaFin').val();

        $.post(globals.urlWebApi + "api/Cortes/InsertarCorteCabecera", datos)
            .done((respuesta) => {
                debugger;
                if (respuesta.iCodCorte != 0) {
                    general.iCodCorte = respuesta.iCodCorte;                    
                    $('#btnagregarcorte').attr('disabled', false);
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }           
            });

    });


    general.tblcortes = $("#tblcortes").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            $('#tblcortes thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodCorteDetalle"
                , pvSortOrder: "asc"
                , iCodCorte: general.iCodCorte
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Cortes/ListarCortesDetalle",
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
            { data: "iCodCorteDetalle", title: "iCodCorteDetalle", visible: false, orderable: false },
            { data: "Entregable", title: "Entregable", visible: true, orderable: false }, 
            { data: "idias", title: "Dias", visible: true, orderable: false },             
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="EditarCausaDirecta(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarCorte(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="agregarCausaIndirecta(${row.iCodCausaDirecta},${row.iCodIdentificacion});"  data-toggle="tooltip" title="Agregar Causa Indirecta"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });
}
function EliminarCorte(obj) {
    general.iCodCorteDetalle = general.tblcortes.row($(obj).parents('tr')).data().iCodCorteDetalle;
    $('#modaleliminarcorte').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarcorte').modal('show');      
}
function retornarcalculomeses() {
    debugger;
    if ($('#dFechaInicio').val() != "" && $('#dFechaFin').val() != "") {
        var f1 = new Date($('#dFechaInicio').val());
        var f2 = new Date($('#dFechaFin').val());
        if (f1 >= f2) {
            $('#totaldias').val(0);
        } else {
            let entidad = {};
            entidad.dFechaInicioServicioT1 = $('#dFechaInicio').val();
            entidad.dFechaInicioServicioT1 = entidad.dFechaInicioServicioT1.split("-")[2] + "-" + entidad.dFechaInicioServicioT1.split("-")[1] + "-" + entidad.dFechaInicioServicioT1.split("-")[0];
            entidad.dFechaFinServicioT1 = $('#dFechaFin').val();
            entidad.dFechaFinServicioT1 = entidad.dFechaFinServicioT1.split("-")[2] + "-" + entidad.dFechaFinServicioT1.split("-")[1] + "-" + entidad.dFechaFinServicioT1.split("-")[0];;

            $.post(globals.urlWebApi + "api/FichaTecnica/RetornarDiferenciaMeses", entidad)
                .done((respuesta) => {
                    console.log(respuesta);
                    $('#totaldias').val(respuesta);
                });
            
        }
     
    }   
}