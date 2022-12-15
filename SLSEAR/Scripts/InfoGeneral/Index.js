let general = {
    tablaproductores: null,
    accion: 1,
    elementoSeleccionado: null,
    usuario: 0,
    codigodepartamento: '',
    codigoprovincia: '',
    codigodistrito: '',
    iCodFichaTecnica: 0,
    vSubSectorT1: '',
    vProcesoProductivaT1: '',
    vLineaPrioritariaT1:''
};
function daysdifference(firstDate, secondDate) {
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);

    // Determine the time difference between two dates     
    var millisBetween = startDay.getTime() - endDay.getTime();

    // Determine the number of days between two dates  
    var days = millisBetween / (1000 * 3600 * 24);

    // Show the final number of days between dates     
    return Math.round(Math.abs(days));
}
function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario(21);

    var entidad = {};

    entidad.iCodExtensionista = general.usuario;

    $.post(globals.urlWebApi + "api/FichaTecnica/ListarFichaTecnica", entidad)
        .done((respuesta) => {                        
            if (respuesta.length > 0) {
                general.accion = 2;
                console.log(respuesta);
                general.iCodFichaTecnica = respuesta[0].iCodFichaTecnica;
                $('#vNombreSearT1').val(respuesta[0].vNombreSearT1);
                $('#vNaturalezaIntervencionT1').val(respuesta[0].vNaturalezaIntervencionT1);
                //$('#cbosector').val(respuesta[0].vSubSectorT1);
                general.vSubSectorT1 = respuesta[0].vSubSectorT1;
                $('#vCadenaProductivaT1').val(respuesta[0].vCadenaProductivaT1);
                //$('#cboprocesoproductiva').val(respuesta[0].vProcesoProductivaT1);
                general.vProcesoProductivaT1 = respuesta[0].vProcesoProductivaT1;
                general.vLineaPrioritariaT1 = respuesta[0].vLineaPrioritariaT1;
                $('#vProductoServicioAmpliarT1').val(respuesta[0].vProductoServicioAmpliarT1);

                var codigodistrito = respuesta[0].iCodUbigeoT1;
                var codigoprovincia = codigodistrito.substr(0, 4);
                var codigodepartamento = codigodistrito.substr(0, 2);
                                
                general.codigodepartamento = codigodepartamento;
                general.codigoprovincia = codigoprovincia;
                general.codigodistrito = codigodistrito;
                
                $('#vLocalidadT1').val(respuesta[0].vLocalidadT1);
                $('#vZonaUTMT1').val(respuesta[0].vZonaUTMT1);
                $('#vCoordenadasUTMNorteT1').val(respuesta[0].vCoordenadasUTMNorteT1);
                $('#vCoordenadasUTMEsteT1').val(respuesta[0].vCoordenadasUTMEsteT1);
                $('#dFechaInicioServicioT1').val(respuesta[0].dFechaInicioServicioT1);
                $('#dFechaFinServicioT1').val(respuesta[0].dFechaFinServicioT1);

                $('#vNombreEntidadProponenteT2').val(respuesta[0].vNombreEntidadProponenteT2);
                $('#vCorreoElectronicoT2').val(respuesta[0].vCorreoElectronicoT2);
                $('#vNombreDireccionPerteneceT2').val(respuesta[0].vNombreDireccionPerteneceT2);
                $('#vNombreDirectorAgenciaAgrariaT2').val(respuesta[0].vNombreDirectorAgenciaAgrariaT2);
                $('#vDireccionT2').val(respuesta[0].vDireccionT2);
                $('#vDireccionZonaAgroruralT2').val(respuesta[0].vDireccionZonaAgroruralT2);
                $('#vTelefonoT2').val(respuesta[0].vTelefonoT2);
                retornarcalculomeses();
            } 
            // Cargar Regiones ///
            $('#cboregion').empty();
            $('#cboregion').append("<option value='0'>Seleccione</option>");

            $.when(obtenerRegion({}))
                .done((regiones) => {
                    $.each(regiones, function (key, value) {
                        $('#cboregion').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
                    });
                    if (general.codigodepartamento != '') {
                        $('#cboregion').val(general.codigodepartamento);

                        $.when(obtenerProvincia({ vCodDepartamento: general.codigodepartamento }))
                            .done((provincias) => {
                                $('#cboprovincia').empty();
                                $('#cboprovincia').append("<option value='0'>Seleccione</option>");
                                $.each(provincias, function (key, value) {
                                    $('#cboprovincia').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                                });
                                if (general.codigoprovincia != '') {                                    
                                    $('#cboprovincia').val(general.codigoprovincia);

                                    $.when(obtenerDistrito({ vCodProvincia: general.codigoprovincia }))
                                        .done((distritos) => {
                                            $('#iCodUbigeoT1').empty();
                                            $('#iCodUbigeoT1').append("<option value='0'>Seleccione</option>");
                                            $.each(distritos, function (key, value) {
                                                $('#iCodUbigeoT1').append("<option value='" + value.vCodDistrito + "' data-value='" + JSON.stringify(value.vCodDistrito) + "'>" + value.vNomDistrito + "</option>");
                                            });
                                            if (general.codigodistrito != '') {
                                                $('#iCodUbigeoT1').val(general.codigodistrito);
                                            }
                                        }).fail((error) => {
                                        });

                                }   
                            }).fail((error) => {
                            });
                    }
                }).fail((error) => {
                    M.toast({
                        html: "Ocurrió un problema al obtener los datos iniciales"
                    });
                });       

            $('#cbosector').empty();
            $('#cbosector').append("<option value='0'>Seleccione</option>");
            $.when(obtenersector({}))
                .done((regiones) => {
                    $.each(regiones, function (key, value) {
                        $('#cbosector').append("<option value='" + value.iCodSector + "' data-value='" + JSON.stringify(value.iCodSector) + "'>" + value.vDescSector + "</option>");
                    });
                    if (general.vSubSectorT1 != '') {
                        $('#cbosector').val(general.vSubSectorT1);
                    }                    
                }).fail((error) => {
                    M.toast({
                        html: "Ocurrió un problema al obtener los datos iniciales"
                    });
                });

            $('#cboprocesoproductiva').empty();
            $('#cboprocesoproductiva').append("<option value='0'>Seleccione</option>");

            $.when(obtenerprocesoproductiva({}))
                .done((regiones) => {
                    $.each(regiones, function (key, value) {
                        $('#cboprocesoproductiva').append("<option value='" + value.iCodProcesoCadPro + "' data-value='" + JSON.stringify(value.iCodProcesoCadPro) + "'>" + value.vDescProcesoCadPro + "</option>");
                    });
                    if (general.vProcesoProductivaT1 != '') {
                        $('#cboprocesoproductiva').val(general.vProcesoProductivaT1);
                    } 
                }).fail((error) => {
                    M.toast({
                        html: "Ocurrió un problema al obtener los datos iniciales"
                    });
                });

            $('#cbolineaprioritaria').empty();
            $('#cbolineaprioritaria').append("<option value='0'>Seleccione</option>");
            var iCodSector = 4;
            if (general.vProcesoProductivaT1 == 1) {
                iCodSector = general.vSubSectorT1;
            }

            var entidad = { iCodSector: iCodSector };

            $.post(globals.urlWebApi + "api/FichaTecnica/ListarLineaPrioritaria", entidad)
                .done((respuesta) => {
                    //debugger;
                    $.each(respuesta, function (key, value) {
                        $('#cbolineaprioritaria').append("<option value='" + value.iCodLineaPriori + "' data-value='" + JSON.stringify(value.iCodLineaPriori) + "'>" + value.vDescLineaPriori + "</option>");
                        $('#cbolineaprioritaria').val(general.vLineaPrioritariaT1);
                    });
                    debugger;
                 

                });
        });  

    // Cargar Provincia ///
    $('#cboprovincia').empty();
    $('#cboprovincia').append("<option value='0'>Seleccione</option>");

    $("#cboregion").on('change', function (e) {
        $.when(obtenerProvincia({ vCodDepartamento: $("#cboregion").val() }))
            .done((provincias) => {
                $('#cboprovincia').empty();
                $('#cboprovincia').append("<option value='0'>Seleccione</option>");
                $.each(provincias, function (key, value) {
                    $('#cboprovincia').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                });
            }).fail((error) => {
            });
    });

    /////////////
    // Cargar Distrito /////

    $('#iCodUbigeoT1').empty();
    $('#iCodUbigeoT1').append("<option value='0'>Seleccione</option>");

    $("#cboprovincia").on('change', function (e) {
        $.when(obtenerDistrito({ vCodProvincia: $("#cboprovincia").val() }))
            .done((distritos) => {
                $('#iCodUbigeoT1').empty();
                $('#iCodUbigeoT1').append("<option value='0'>Seleccione</option>");
                $.each(distritos, function (key, value) {
                    $('#iCodUbigeoT1').append("<option value='" + value.vCodDistrito + "' data-value='" + JSON.stringify(value.vCodDistrito) + "'>" + value.vNomDistrito + "</option>");
                });
            }).fail((error) => {
            });
    });


  
 

    $.when(obtenertipoproveedor({}))
        .done((regiones) => {
            $.each(regiones, function (key, value) {
                $('#iCodTipoProveedorT3').append("<option value='" + value.iCodTipoProveedor + "' data-value='" + JSON.stringify(value.iCodTipoProveedor) + "'>" + value.vProveedor + "</option>");
            });
        }).fail((error) => {
            M.toast({
                html: "Ocurrió un problema al obtener los datos iniciales"
            });
        });

    $('#cbotipoorg').empty();
    $('#cbotipoorg').append("<option value='0'>Seleccione</option>");
    $.when(obtenertipoorganizacion({}))
        .done((regiones) => {
            $.each(regiones, function (key, value) {
                $('#cbotipoorg').append("<option value='" + value.iCodTipoOrganizacion + "' data-value='" + JSON.stringify(value.iCodTipoOrganizacion) + "'>" + value.vOrganizacion + "</option>");
            });
        }).fail((error) => {
            M.toast({
                html: "Ocurrió un problema al obtener los datos iniciales"
            });
        });

    
    var entidad = { iCodExtensionista: general.usuario };

    $.post(globals.urlWebApi + "api/Extensionista/ListarExtensionistaPorCodigo", entidad)
        .done((respuesta) => {
            //debugger;
            console.log(respuesta);
            if (respuesta.iCodEmpresa == 0) {
                $('#iCodTipoPersoneriaT3').val(1);
            } else {
                $('#iCodTipoPersoneriaT3').val(2);
            }
            $('#vTelefonoT3').val(respuesta.vTelefono);
            $('#vCelularT3').val(respuesta.vCelular);
            $('#vNombreRazonSocialProveedorT3').val(respuesta.vRazonSocial);
            $('#vCorreoElectronicoT3').val(respuesta.vCorreo);
            $('#vNombreRepresentanteLegalT3').val(respuesta.vNombreRepre);
            $('#vDniT3').val(respuesta.vDni);
            $('#vRucT3').val(respuesta.vRuc);
            $('#vDireccionT3').val(respuesta.vDomicilio);        
            //$('#vNombreSearT1').val(respuesta.vNombrePropuesta);
            //$.each(respuesta, function (key, value) {
            //    $('#cbolineaprioritaria').append("<option value='" + value.iCodLineaPriori + "' data-value='" + JSON.stringify(value.iCodLineaPriori) + "'>" + value.vDescLineaPriori + "</option>");
            //});
        });
    $('#dFechaInicioServicioT1').on('change', function (e) {        
        retornarcalculomeses();
    });
    $('#dFechaFinServicioT1').on('change', function (e) {
        retornarcalculomeses();
    });

    $('#cbosector').on('change', function () {
        obtenerlineaprioritaria();
    });
    $('#cboprocesoproductiva').on('change', function () {
        obtenerlineaprioritaria();
    });

    $('#vNaturalezaIntervencionT1').on('blur', function (e) {
        GenerarNombre();
    });

    $('#vLineaPrioritariaT1').on('blur', function (e) {
        GenerarNombre();
    });

    $('#cboregion').on('change', function (e) {
        GenerarNombre();
    });

    $('#cboprovincia').on('change', function (e) {
        GenerarNombre();
    });

    $('#iCodUbigeoT1').on('change', function (e) {
        GenerarNombre();
    });

    general.tablaproductores = $("#tblproductores").DataTable({
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
            $('#tblproductores thead').attr('class', 'table-success');    
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iEsRepresentante"
                , pvSortOrder: "desc"
                , iCodExtensionista: general.usuario
                , iPerteneceOrganizacion: 1
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
                        $('#total').val(general.tablaproductores.data()[0].totalRegistros);
                        $('#masculino').val(general.tablaproductores.data()[0].cantidadmasculino);        
                        $('#femenino').val(general.tablaproductores.data()[0].cantidadfemenino);   
                        $('#promedio').val(general.tablaproductores.data()[0].promedio);   
                        $('#jovenes').val(general.tablaproductores.data()[0].jovenes);   
                        $('#porjovenes').val(general.tablaproductores.data()[0].porjovenes);   
                        $('#porfemenino').val(general.tablaproductores.data()[0].porfemenino);   
                        $('#recibiocapa').val(general.tablaproductores.data()[0].recibiocapacitacion);   
                        $('#porrecibiocapa').val(general.tablaproductores.data()[0].porrecibiocapacitacion);   
                        
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
            { data: "vCelular", title: "Celular", visible: true, orderable: false },
            { data: "iEdad", title: "Edad", visible: true, orderable: false },
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
            { data: "vNombreOrganizacion", title: "Nombre Organizacion", visible: false, orderable: false }
            ,{
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `<a href="javascript:void(0);" onclick ="VerComunidad(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Ver Detalle"><i class="material-icons yelow-text">visibility</i></a>`;
                    if (row.iEsRepresentante) {
                        acciones += `<a href="javascript:void(0);" onclick ="EditarProductor(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;
                    }                    
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarProductor(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $('#btnguardarorg').on('click', function () {
        //alert('grabar org');
        if ($('#vRucOrg').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Ruc",
                type: "error"
            });
            $('#vRucOrg').focus();
            return;
        }
        if ($('#vNombreRepreseanteOrg').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Nombre del Representante",
                type: "error"
            });
            $('#vNombreRepreseanteOrg').focus();
            return;
        }
        if ($('#vCelularOrg').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Celular",
                type: "error"
            });
            $('#vCelularOrg').focus();
            return;
        }
        if ($('#vDireccionOrg').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Dirección",
                type: "error"
            });
            $('#vDireccionOrg').focus();
            return;
        }
        if ($('#vTelefonoOrg').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Telefono",
                type: "error"
            });
            $('#vTelefonoOrg').focus();
            return;
        }
        if ($('#vCorreoOrg').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Correo",
                type: "error"
            });
            $('#vCorreoOrg').focus();
            return;
        }
        if ($('#cbotipoorg').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione Tipo de Organizacion",
                type: "error"
            });
            $('#cbotipoorg').focus();
            return;
        }

        var entidad = {};
        entidad.vRucOrg = $('#vRucOrg').val();
        entidad.vNombreRepresentante = $('#vNombreRepreseanteOrg').val();
        entidad.vTelefonoOrg = $('#vTelefonoOrg').val();
        entidad.vCelularOrg = $('#vCelularOrg').val();
        entidad.vDireccionOrg = $('#vDireccionOrg').val();
        entidad.vCorreoElectronicoOrg = $('#vCorreoOrg').val();
        entidad.iCodTipoOrg = $('#cbotipoorg').val();
        entidad.iCodProductor = general.elementoSeleccionado.iCodProductor;
        entidad.iOpcion = 4;

        $.post(globals.urlWebApi + "api/ActaAlianzaEstrategica/InsertarProductor", entidad)
            .done((respuesta) => {
                console.log('registro correctamente');
                limpiar();
                $('#modalorganizacion').modal('hide');
                general.tablaproductores.clear().draw();
                notif({
                    msg: "<b>Correcto:</b> se ha grabado correctamente",
                    type: "success"
                });

            }).fail((error) => {
                console.log(error);
            });

    });

    $('#btnguardar').on('click', function () {

        if ($('#vNaturalezaIntervencionT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Naturaleza Intervención",
                type: "error"
            });
            $('#vNaturalezaIntervencionT1').focus();
            return;
        }
        
        if ($('#cbosector').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione SubSector",
                type: "error"
            });
            $('#cbosector').focus();
            return;
        }
                
        if ($('#vCadenaProductivaT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Cadena Productiva",
                type: "error"
            });
            $('#vCadenaProductivaT1').focus();
            return;
        }
        if ($('#cboprocesoproductiva').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione Proceso de la Cadena Productiva",
                type: "error"
            });
            $('#cboprocesoproductiva').focus();
            return;
        }
        
        if ($('#cbolineaprioritaria').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione Linea Prioritaria",
                type: "error"
            });
            $('#cbolineaprioritaria').focus();
            return;
        }

        if ($('#vProductoServicioAmpliarT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Producto o servicio a ampliar / mejorar / recuperar",
                type: "error"
            });
            $('#vProductoServicioAmpliarT1').focus();
            return;
        }
        

        if ($('#cboregion').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione Region",
                type: "error"
            });
            $('#cboregion').focus();
            return;
        }

        if ($('#cboprovincia').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione Provincia",
                type: "error"
            });
            $('#cboprovincia').focus();
            return;
        }

        if ($('#iCodUbigeoT1').val() == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Seleccione Distrito",
                type: "error"
            });
            $('#iCodUbigeoT1').focus();
            return;
        }

        if ($('#vLocalidadT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Localidad",
                type: "error"
            });
            $('#vLocalidadT1').focus();
            return;
        }
        if ($('#vZonaUTMT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Zona UTM",
                type: "error"
            });
            $('#vZonaUTMT1').focus();
            return;
        }
        if ($('#vCoordenadasUTMNorteT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Coordenadas UTM (Norte)",
                type: "error"
            });
            $('#vCoordenadasUTMNorteT1').focus();
            return;
        }

        if ($('#vCoordenadasUTMEsteT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Coordenadas UTM (Este)",
                type: "error"
            });
            $('#vCoordenadasUTMEsteT1').focus();
            return;
        }
        if ($('#dFechaInicioServicioT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Fecha Inicio Servicio",
                type: "error"
            });
            $('#dFechaInicioServicioT1').focus();
            return;
        }
        if ($('#dFechaFinServicioT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Fecha Fin Servicio",
                type: "error"
            });
            $('#dFechaFinServicioT1').focus();
            return;
        }

        /// 1.2 DATOS DE LA ENTIDAD PROMOTORA

        if ($('#vNombreEntidadProponenteT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Nombre de la entidad proponente (Agencia Agraria)",
                type: "error"
            });
            $('#vNombreEntidadProponenteT2').focus();
            return;
        }

        if ($('#vCorreoElectronicoT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Correo electrónico",
                type: "error"
            });
            $('#vCorreoElectronicoT2').focus();
            return;
        }

        if ($('#vNombreDireccionPerteneceT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Nombre de la Dirección Regional a la que pertenece",
                type: "error"
            });
            $('#vNombreDireccionPerteneceT2').focus();
            return;
        }

        if ($('#vNombreDirectorAgenciaAgrariaT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Nombre del director de la Agencia Agraria",
                type: "error"
            });
            $('#vNombreDirectorAgenciaAgrariaT2').focus();
            return;
        }
        if ($('#vDireccionT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Dirección",
                type: "error"
            });
            $('#vDireccionT2').focus();
            return;
        }

        if ($('#vDireccionZonaAgroruralT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Dirección Zonal Agrorural",
                type: "error"
            });
            $('#vDireccionZonaAgroruralT2').focus();
            return;
        }
        if ($('#vTelefonoT2').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Teléfono",
                type: "error"
            });
            $('#vTelefonoT2').focus();
            return;
        }
        
        console.log('registrando');
        //alert('grabar');
        var parametros = {};
        /// 1.1
        debugger;
        parametros.vNombreSearT1 = $('#vNombreSearT1').val(); //1

        parametros.vNaturalezaIntervencionT1 = $('#vNaturalezaIntervencionT1').val(); //2

        parametros.vSubSectorT1 = $('#cbosector').val(); //3 

        parametros.vCadenaProductivaT1 = $('#vCadenaProductivaT1').val(); // 4

        parametros.vProcesoProductivaT1 = $('#cboprocesoproductiva').val(); // 5

        parametros.vLineaPrioritariaT1 = $('#cbolineaprioritaria').val(); // 6

        parametros.vProductoServicioAmpliarT1 = $('#vProductoServicioAmpliarT1').val(); // 7

        parametros.iCodUbigeoT1 = $('#iCodUbigeoT1').val(); // 8

        parametros.vLocalidadT1 = $("#vLocalidadT1").val(); // 9

        parametros.vZonaUTMT1 = $('#vZonaUTMT1').val(); // 10

        parametros.vCoordenadasUTMNorteT1 = $('#vCoordenadasUTMNorteT1').val(); // 11

        parametros.vCoordenadasUTMEsteT1 = $('#vCoordenadasUTMEsteT1').val(); // 12
        debugger;

        parametros.dFechaInicioServicioT1 = $("#dFechaInicioServicioT1").val(); // 13

        parametros.dFechaInicioServicioT1 = parametros.dFechaInicioServicioT1.split("-")[2] + "-" + parametros.dFechaInicioServicioT1.split("-")[1] + "-" + parametros.dFechaInicioServicioT1.split("-")[0];

        parametros.dFechaFinServicioT1 = $('#dFechaFinServicioT1').val(); //14

        parametros.dFechaFinServicioT1 = parametros.dFechaFinServicioT1.split("-")[2] + "-" + parametros.dFechaFinServicioT1.split("-")[1] + "-" + parametros.dFechaFinServicioT1.split("-")[0];

        parametros.iDuracionT1 = $('#iDuracionT1').val(); // 15

        console.log('dias diferencia');

        //console.log(daysdifference(parametros.dFechaInicioServicioT1, parametros.dFechaFinServicioT1));
        console.log(monthDiff(new Date(parametros.dFechaInicioServicioT1),new Date(parametros.dFechaFinServicioT1)));

        /// 1.2

        parametros.vNombreEntidadProponenteT2 = $('#vNombreEntidadProponenteT2').val(); // 16

        parametros.vNombreDireccionPerteneceT2 = $('#vNombreDireccionPerteneceT2').val(); // 17

        parametros.vDireccionT2 = $('#vDireccionT2').val(); //18

        parametros.vTelefonoT2 = $('#vTelefonoT2').val(); // 19

        parametros.vCorreoElectronicoT2 = $('#vCorreoElectronicoT2').val(); // 20

        parametros.vNombreDirectorAgenciaAgrariaT2 = $('#vNombreDirectorAgenciaAgrariaT2').val(); // 21

        parametros.vDireccionZonaAgroruralT2 = $('#vDireccionZonaAgroruralT2').val(); // 22

        /// 1.3

        parametros.iCodTipoPersoneriaT3 = $('#iCodTipoPersoneriaT3').val(); // 23

        parametros.vNombreRazonSocialProveedorT3 = $('#vNombreRazonSocialProveedorT3').val(); // 24

        parametros.vNombreRepresentanteLegalT3 = $('#vNombreRepresentanteLegalT3').val(); // 25

        parametros.vDniT3 = $('#vDniT3').val(); // 26

        parametros.vRucT3 = $('#vRucT3').val(); // 27

        parametros.vDireccionT3 = $('#vDireccionT3').val(); //28

        parametros.vTelefonoT3 = $('#vTelefonoT3').val(); // 29

        parametros.vCelularT3 = $('#vCelularT3').val(); //30

        parametros.vCorreoElectronicoT3 = $('#vCorreoElectronicoT3').val(); //31

        parametros.vPaginaWebT3 = $('#vPaginaWebT3').val(); // 32

        parametros.vEpecialidadProveedorT3 = $('#vEpecialidadProveedorT3').val(); //33

        parametros.iCodTipoProveedorT3 = $('#iCodTipoProveedorT3').val(); //34

        parametros.iCodExtensionista = general.usuario;
        parametros.iOpcion = general.accion;
        if (general.accion == 2) {
            parametros.iCodFichaTecnica = general.iCodFichaTecnica;
        }

        console.log(parametros);

        $.post(globals.urlRegistrarFichaTecnica, parametros)
            .done((respuesta) => {
                console.log('registro correctamente');
                //limpiar();
                notif({
                    msg: "<b>Correcto:</b> se ha grabado correctamente",
                    type: "success"
                });
                //var url = $('#hdruta').val();

                //window.location.href = url;
            }).fail((error) => {
                console.log(error);
            });
    });  

    //$('#menuformulacion').addClass('is-expanded');
    ////$('#submenuacreditacion').addClass('is-expanded');
    //$('#subfichatecnica').addClass('is-expanded');    
    //$('#subitemmenu21').css('color', '#6c5ffc');    
}

function monthDiff(d1, d2) {
    var months; months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}


function formatfecha(dateObject) {
    debugger;
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "-" + month + "-" + year;

    return date;
};

function limpiar() {
    $('#vRucOrg').val('');
    $('#vNombreRepreseanteOrg').val('');
    $('#vTelefonoOrg').val('');
    $('#vCelularOrg').val('');
    $('#vDireccionOrg').val('');
    $('#vCorreoOrg').val('');
    $('#cbotipoorg').val(0);
    general.elementoSeleccionado = null;
}
function obtenerlineaprioritaria() {
    if ($('#cbosector').val() != 0 && $('#cboprocesoproductiva').val() != 0) {
        console.log($('#cbosector').val());
        console.log($('#cboprocesoproductiva').val());
                
        $('#cbolineaprioritaria').empty();
        $('#cbolineaprioritaria').append("<option value='0'>Seleccione</option>");
        var iCodSector = 4;
        if ($('#cboprocesoproductiva').val()==1) {
            iCodSector = $('#cbosector').val();
        }

        var entidad = { iCodSector: iCodSector };

        $.post(globals.urlWebApi + "api/FichaTecnica/ListarLineaPrioritaria", entidad)
            .done((respuesta) => {
                //debugger;
                $.each(respuesta, function (key, value) {
                    $('#cbolineaprioritaria').append("<option value='" + value.iCodLineaPriori + "' data-value='" + JSON.stringify(value.iCodLineaPriori) + "'>" + value.vDescLineaPriori + "</option>");
                });           
            });
    }    
}

function GenerarNombre() {
    var vNaturalezaIntervencionT1 = $('#vNaturalezaIntervencionT1').val();

    var vLineaPrioritariaT1 = $('#cbolineaprioritaria').val() == 0 ? "" : $('#cbolineaprioritaria option:selected').text();

    var cboregion = $('#cboregion').val() == 0 ? "" : $('#cboregion option:selected').text();

    var cboprovincia = $('#cboprovincia').val() == 0 ? "" : $('#cboprovincia option:selected').text();

    var iCodUbigeoT1 = $('#iCodUbigeoT1').val() == 0 ? "" : $('#iCodUbigeoT1 option:selected').text();

    $('#vNombreSearT1').val(vNaturalezaIntervencionT1 + "/" + vLineaPrioritariaT1 + "/" + cboregion + "/" + cboprovincia + "/" + iCodUbigeoT1);
}

function EditarProductor(obj) {
    general.elementoSeleccionado = general.tablaproductores.row($(obj).parents('tr')).data();
    console.log('ingresar datos org');
    console.log(general.elementoSeleccionado);
    $('#vNombreRazonSocialOrg').val(general.elementoSeleccionado.vNombreOrganizacion);
    $('#vRucOrg').val(general.elementoSeleccionado.vRucOrg);
    $('#vNombreRepreseanteOrg').val(general.elementoSeleccionado.vNombreRepresentante);
    $('#vCelularOrg').val(general.elementoSeleccionado.vCelularOrg);
    $('#vTelefonoOrg').val(general.elementoSeleccionado.vTelefonoOrg);
    $('#vDireccionOrg').val(general.elementoSeleccionado.vDireccionOrg);
    $('#vCorreoOrg').val(general.elementoSeleccionado.vCorreoElectronicoOrg);   
    $('#cbotipoorg').val(general.elementoSeleccionado.iCodTipoOrg);

    $('#titulomodalproductor').html('Registrar Productor');
    $('#modalorganizacion').modal({ backdrop: 'static', keyboard: false });
    $('#modalorganizacion').modal('show');   
}
function retornarcalculomeses() {
    let entidad = {};
    entidad.dFechaInicioServicioT1 = $('#dFechaInicioServicioT1').val();
    entidad.dFechaInicioServicioT1 = entidad.dFechaInicioServicioT1.split("-")[2] + "-" + entidad.dFechaInicioServicioT1.split("-")[1] + "-" + entidad.dFechaInicioServicioT1.split("-")[0];
    entidad.dFechaFinServicioT1 = $('#dFechaFinServicioT1').val();
    entidad.dFechaFinServicioT1 = entidad.dFechaFinServicioT1.split("-")[2] + "-" + entidad.dFechaFinServicioT1.split("-")[1] + "-" + entidad.dFechaFinServicioT1.split("-")[0];;

    $.post(globals.urlWebApi + "api/FichaTecnica/RetornarDiferenciaMeses", entidad)
        .done((respuesta) => {            
            console.log(respuesta);
            $('#iDuracionT1').val(respuesta);;
        });
}
function obtenersector() {
    return $.ajax({ type: "POST", url: globals.urlWebApi +"api/FichaTecnica/ListarSector", headers: { Accept: "application/json" }, dataType: 'json' });
}
function obtenerprocesoproductiva() {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/FichaTecnica/ListarCadenaProductivaAgraria", headers: { Accept: "application/json" }, dataType: 'json' });
}
function obtenertipoorganizacion() {
    return $.ajax({ type: "POST", url: globals.urlWebApi + "api/FichaTecnica/ListarTipoOrganizacion", headers: { Accept: "application/json" }, dataType: 'json' });
}
function obtenertipoproveedor() {
    return $.ajax({ type: "POST", url: globals.urlListarTipoProveedor, headers: { Accept: "application/json" }, dataType: 'json' });
}
function obtenerRegion(data) {    
    return $.ajax({ type: "POST", url: globals.urlUbigeoDepartamento, headers: { Accept: "application/json" }, dataType: 'json', data: data });
}
function obtenerProvincia(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoProvincia, headers: { Accept: "application/json" }, dataType: 'json', data: data });
}
function obtenerDistrito(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoDistrito, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}