let general = {
    iCodIdentificacion:0,
    tblcriterios: null,
    iCodFichaTecnica: null,
    iCodSuperCab:0
};

function EjecutarDetalleInformacionGeneral() {
    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

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

    $.post(globals.urlWebApi + "api/FichaTecnica/ListarFichaTecnica", dato)
        .done((respuesta) => {
            console.log("Datos Identificacion");
            console.log(respuesta);
            if (respuesta.length > 0) {
                general.iCodFichaTecnica = respuesta[0].iCodFichaTecnica;
            }
        }).fail((error) => {
            console.log(error);
        });

    $.post(globals.urlWebApi + "api/SuperVisionCapa/ListarRubros")
        .done((respuesta) => {         
            console.log(respuesta);
            if (respuesta.length > 0) {            
                $('#cboRubro').empty();
                $('#cboRubro').append("<option value='0'>Seleccione</option>");
                $.each(respuesta, function (key, value) {
                            $('#cboRubro').append("<option value='" + value.iCodRubro + "' data-value='" + JSON.stringify(value.iCodRubro) + "'>" + value.vDescripcion + "</option>");
                        });                

            }
        }).fail((error) => {
            console.log(error);
        });

    $.post(globals.urlWebApi + "api/SuperVisionCapa/ListarCalificacion")
        .done((respuesta) => {
            console.log(respuesta);
            if (respuesta.length > 0) {

                $('#cboCalificacion').empty();
                $('#cboCalificacion').append("<option value='0'>Seleccione</option>");
                $.each(respuesta, function (key, value) {
                    $('#cboCalificacion').append("<option value='" + value.iCodCalificacion + "' data-value='" + JSON.stringify(value.iCodCalificacion) + "'>" + value.vDescripcion + "</option>");
                });
            }
        }).fail((error) => {
            console.log(error);
        });

    general.tblcriterios = $("#tblcriterios").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: false
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {            
            $('#tblcriterios thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodCriterio"
                , pvSortOrder: "asc"
                , iCodRubro: $('#cboRubro').val() 
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/SuperVisionCapa/ListarCriterio",
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
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [            
            { data: "iCodCriterio", title: "iCodCosto", visible: false, orderable: false },
            { data: "vDescripcion", title: "Descripcion", visible: true, orderable: false }, 
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

    $("#cboComponente").on('change', function (e) { 
        let parametro = {
              piPageSize: 1000
            , piCurrentPage: 1
            , pvSortColumn: "iCodActividad"
            , pvSortOrder: "asc"
            , iCodExtensionista: general.usuario
            , iCodIdentificacion:e.currentTarget.value
        };

        $('#cboActividad').empty();
        $('#cboActividad').append("<option value='0'>Seleccione</option>");

        $.post(globals.urlWebApi + "api/Costo/ListarActividad", parametro)
                .done((respuesta) => {
                    console.log(respuesta);
                    //var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                    //openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');
                });
    });
    $("#cboRubro").on('change', function (e) {
        general.tblcriterios.draw().clear();
    });
    $('#btngrabarrubro').on('click', function () {

        if ($('#cboRubro').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar Rubro",
                type: "error"
            });
            $('#cboRubro').focus();
            return;
        }
        if ($('#txtfundamentorubro').val() == "") {
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Fundamento / Comentario",
                type: "error"
            });
            $('#txtfundamentorubro').focus();
            return;
        }
        let parametros = {};

        parametros.iCodSuperCab = general.iCodSuperCab;
        parametros.iCodRubro = $('#cboRubro').val();
        parametros.vFundamento = $('#txtfundamentorubro').value;

        $.post(globals.urlWebApi + "api/SuperVisionCapa/InsertarSuperVisionDetCap", parametros)
            .done((respuesta) => {
                console.log(respuesta);
                if (respuesta.iCodSuperDet > 0) {
                    //general.iCodSuperCab = respuesta.iCodSuperCab;
                    //$('#cboRubro').removeAttr('disabled');
                    //$('#btngrabarrubro').removeAttr('disabled');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
        

    });

    $('#btnregistrar').on('click', function () {
   
        if ($('#cboComponente').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar Componente",
                type: "error"
            });
            $('#cboComponente').focus();
            return;
        }

        if ($('#cboActividad').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar Actividad",
                type: "error"
            });
            $('#cboActividad').focus();
            return;
        }

        if ($('#txtnomsupervisor').val() == "") {
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Nombres Supervisor",
                type: "error"
            });
            $('#txtnomsupervisor').focus();
            return;
        }

        if ($('#txtcargosupervisor').val() == "") {
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Cargo Supervisor",
                type: "error"
            });
            $('#txtcargosupervisor').focus();
            return;
        }

        if ($('#txtentidadsupervisor').val() == "") {
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Entidad Supervisor",
                type: "error"
            });
            $('#txtentidadsupervisor').focus();
            return;
        }

        if ($('#txtfechasupervisor').val() =="") {
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Fecha Supervisor",
                type: "error"
            });
            $('#txtfechasupervisor').focus();
            return;
        }

        if ($('#cboCalificacion').val() == "0") {
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar Calificacion",
                type: "error"
            });
            $('#cboCalificacion').focus();
            return;
        }

        let parametros = {};

        parametros.iCodIdentificacion = general.iCodIdentificacion;
        parametros.iCodFichaTecnica = general.iCodFichaTecnica;
        parametros.iCodComponente = $('#cboComponente').val(); //30;
        parametros.iCodActividad = $('#cboActividad').val(); //27;
        parametros.vObservaciongeneral = $('#txtobsgeneral').val();
        parametros.vRecomendacion = $('#txtrecomendacion').val();
        parametros.vNombreSupervisor = $("#txtnomsupervisor").val();
        parametros.vCargoSupervisor = $("#txtcargosupervisor").val();
        parametros.vEntidadSupervisor = $("#txtentidadsupervisor").val();
        parametros.dFechaSupervisor = $("#txtfechasupervisor").val();      
        parametros.dFechaSupervisor = parametros.dFechaSupervisor.split("-")[2] + "-" + parametros.dFechaSupervisor.split("-")[1] + "-" + parametros.dFechaSupervisor.split("-")[0];
        parametros.iCodCalificacion = $("#cboCalificacion").val();

        $.post(globals.urlWebApi + "api/SuperVisionCapa/InsertarSuperVisionCabCap", parametros)
            .done((respuesta) => {
                console.log(respuesta);       
                if (respuesta.iCodSuperCab > 0) {
                    general.iCodSuperCab = respuesta.iCodSuperCab;
                    $('#cboRubro').removeAttr('disabled');
                    $('#btngrabarrubro').removeAttr('disabled');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });
}

function obtenerComponentes(data) {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/Identificacion/ListarComponentesSelect", headers: { Accept: "application/json" }, dataType: 'json', data: data });
}