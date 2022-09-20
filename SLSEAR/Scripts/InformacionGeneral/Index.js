
var tableproductores= null;

function EjecutarDetalleInformacionGeneral() {
        
    // Cargar Regiones ///
    $('#cboregion').empty();
    $('#cboregion').append("<option value='0'>Seleccione</option>");

    $.when(obtenerRegion({}))
        .done((regiones) => {            
            $.each(regiones, function (key, value) {                                
                $('#cboregion').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
            });
        }).fail((error) => {
            M.toast({
                html: "Ocurrió un problema al obtener los datos iniciales"
            });
        });
            
    ///////////
        
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

    
    $('#iCodTipoProveedorT3').empty();
    $('#iCodTipoProveedorT3').append("<option value='0'>Seleccione</option>");

    $.when(obtenertipoproveedor({}))
        .done((proveedores) => {
            $.each(proveedores, function (key, value) {
                $('#iCodTipoProveedorT3').append("<option value='" + value.iCodTipoProveedor + "' data-value='" + JSON.stringify(value.iCodTipoProveedor) + "'>" + value.vProveedor + "</option>");
            });
        }).fail((error) => {
            M.toast({
                html: "Ocurrió un problema al obtener los datos iniciales"
            });
        });

    ///////////////////

    $('#btnguardarproductor').on('click', function (e) {        
        tableproductores.row.add([tableproductores.data().length + 1, $('#txtapeynom').val(), $('#txtdni').val(), $('#txtcelular').val(), $('#txtedad').val(), $("#cbosexo option:selected").text(), '<div class="btn-list">'+            
            '<button id="bDel" type="button" class="btn  btn-sm btn-danger">'+
                '<span class="fe fe-trash-2"> </span>'+
            '</button>'+                        
            '</div>'])
            .draw()
            .node();

        $('#txtapeynom').val('');
        $('#txtdni').val('');
        $('#txtcelular').val('');
        $('#txtedad').val('');
        $('#cbosexo').val('');
        $('#btncerrar').trigger('click');
    });

    ///////////////////////

    tableproductores = $('#file-datatable').DataTable({
        buttons: ['copy', 'excel', 'pdf', 'colvis'],
        //language: {
        //    searchPlaceholder: 'Search...',
        //    scrollX: "100%",
        //    sSearch: '',
        //}
        language: globals.lenguajeDataTable
    });

    $('#file-datatable').on('click', '.btn-danger', function () {
        var table = $('#file-datatable').DataTable();
        var row = $(this).parents('tr');

        if ($(row).hasClass('child')) {
            table.row($(row).prev('tr')).remove().draw();
        }
        else {
            table
                .row($(this).parents('tr'))
                .remove()
                .draw();
        }
    });

    $('#btnlimpiar').on('click', function () {
        //alert('a');
    });

    function GenerarNombre() {
        var vNaturalezaIntervencionT1 = $('#vNaturalezaIntervencionT1').val();

        var vLineaPrioritariaT1 = $('#vLineaPrioritariaT1').val();

        var cboregion = $('#cboregion').val() == 0 ? "" : $('#cboregion option:selected').text();

        var cboprovincia = $('#cboprovincia').val() == 0 ? "" : $('#cboprovincia option:selected').text();

        var iCodUbigeoT1 = $('#iCodUbigeoT1').val() == 0 ? "" : $('#iCodUbigeoT1 option:selected').text();
        
        $('#vNombreSearT1').val(vNaturalezaIntervencionT1 +"/"+ vLineaPrioritariaT1 +"/"+ cboregion +"/"+ cboprovincia +"/"+ iCodUbigeoT1);
    }

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

    $('#btnguardar').on('click', function () {   
        
        if ($('#vNaturalezaIntervencionT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Naturaleza Intervención",
                type: "error"
            });
            $('#vNaturalezaIntervencionT1').focus();
            return;
        }

        if ($('#vLineaPrioritariaT1').val().trim() == '') {
            notif({
                msg: "<b>Incorrecto:</b> Ingresa Linea Prioritaria",
                type: "error"
            });
            $('#vLineaPrioritariaT1').focus();
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

        console.log('registrando');
        //alert('grabar');
        var parametros = {};
        /// 1.1

        parametros.vNombreSearT1 = $('#vNombreSearT1').val(); //1

        parametros.vNaturalezaIntervencionT1 = $('#vNaturalezaIntervencionT1').val(); //2

        parametros.vSubSectorT1 = $('#vSubSectorT1').val(); //3 

        parametros.vCadenaProductivaT1 = $('#vCadenaProductivaT1').val(); // 4

        parametros.vProcesoProductivaT1 = $('#vProcesoProductivaT1').val(); // 5

        parametros.vLineaPrioritariaT1 = $('#vLineaPrioritariaT1').val(); // 6

        parametros.vProductoServicioAmpliarT1 = $('#vProductoServicioAmpliarT1').val(); // 7

        parametros.iCodUbigeoT1 = $('#iCodUbigeoT1').val(); // 8

        parametros.vLocalidadT1 = $("#vLocalidadT1").val(); // 9

        parametros.vZonaUTMT1 = $('#vZonaUTMT1').val(); // 10

        parametros.vCoordenadasUTMNorteT1 = $('#vCoordenadasUTMNorteT1').val(); // 11

        parametros.vCoordenadasUTMEsteT1 = $('#vCoordenadasUTMEsteT1').val(); // 12

        parametros.dFechaInicioServicioT1 = $("#dFechaInicioServicioT1").val(); // 13

        parametros.dFechaFinServicioT1 = $('#dFechaFinServicioT1').val(); //14

        parametros.iDuracionT1 = $('#iDuracionT1').val(); // 15
 
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

        parametros.iOpcion = 1;

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
}

//$(document).ready(function () {
//    debugger;
//});

function obtenertipoproveedor() {
    return $.ajax({ type: "POST", url: globals.urlListarTipoProveedor, headers: { Accept: "application/json" }, dataType: 'json'});
}
function obtenerRegion(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoDepartamento, headers: { Accept: "application/json"}, dataType: 'json', data: data });
}
function obtenerProvincia(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoProvincia , headers: { Accept: "application/json" }, dataType: 'json', data: data });
}
function obtenerDistrito(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoDistrito , headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}