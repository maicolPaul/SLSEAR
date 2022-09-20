function EjecutarDetalleInformacionGeneral() {

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

function obtenerProcedencia(data) {
    return $.ajax({ type: "POST", url: globals.urlListarProcedencia, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}

function obtenerRegimen(data) {
    return $.ajax({ type: "POST", url: globals.urlListarRegimen, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}

function obtenerTipoEntidad(data) {
    return $.ajax({ type: "POST", url: globals.urlListarTipoEntidad, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}
function obtenerDireccionGerencia(data) {
    return $.ajax({ type: "POST", url: globals.urlListarDireccionGerencia, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}

function obtenerAgenciaAgraria(data) {
    return $.ajax({ type: "POST", url: globals.urlListarAgenciaAgraria, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}

function obtenerNivel(data) {
    return $.ajax({ type: "POST", url: globals.urlListarNivel, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}

$(document).ready(function () {

    console.log("ready!");

    $('#largemodal').modal({ backdrop: 'static', keyboard: false });
    $('#largemodal').modal('show');
    // Cargar Regiones ///
    $('#cboregion').empty();
    $('#cboregion').append("<option value=''>Seleccione</option>");

    //$('#cboprocedencia').empty();
    //$('#cboprocedencia').append("<option value=''>Seleccione</option>");

    $('#cboregimen').empty();
    $('#cboregimen').append("<option value=''>Seleccione</option>");

    $('#cbotipoentidad').empty();
    $('#cbotipoentidad').append("<option value=''>Seleccione</option>");

    $('#cbodireccionregional').empty();
    $('#cbodireccionregional').append("<option value=''>Seleccione</option>");

    $('#cboagenciaagraria').empty();
    $('#cboagenciaagraria').append("<option value=''>Seleccione</option>");
    //obtenerProcedencia({})

    $.when(obtenerRegion({}), obtenerRegimen({}), obtenerTipoEntidad({}), obtenerDireccionGerencia({}), obtenerNivel({}))
        .done((regiones,regimenes,tipoentidad,direccionesgerencia,niveles) => {
                        
            $.each(regiones[0], function (key, value) {
                if (value.vCodDepartamento != "07") {
                    $('#cboregion').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
                    $('#cboregionnat').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
                    $('#cboregionnatext').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
                }
            });

            //$.each(procedencias[0], function (key, value) {
            //    $('#cboprocedencia').append("<option value='" + value.iCodProcedencia + "' data-value='" + JSON.stringify(value.iCodProcedencia) + "'>" + value.vProcedencia + "</option>");
            //});

            $.each(regimenes[0], function (key, value) {
                $('#cboregimen').append("<option value='" + value.iCodRegimen + "' data-value='" + JSON.stringify(value.iCodRegimen) + "'>" + value.vRegimen + "</option>");
            });

            $.each(tipoentidad[0], function (key, value) {
                $('#cbotipoentidad').append("<option value='" + value.iCodTipoEntidad + "' data-value='" + JSON.stringify(value.iCodTipoEntidad) + "'>" + value.vTipoEntidad + "</option>");
            });

            $.each(direccionesgerencia[0], function (key, value) {
                $('#cbodireccionregional').append("<option value='" + value.iCodDirecGerencia + "' data-value='" + JSON.stringify(value.iCodDirecGerencia) + "'>" + value.vNombre + "</option>");
            });
                  

            $.each(niveles[0], function (key, value) {
                $('#cbonivelnat').append("<option value='" + value.iCodNivel + "' data-value='" + JSON.stringify(value.iCodNivel) + "'>" + value.vDescripcion + "</option>");
                $('#cbonivelnatext').append("<option value='" + value.iCodNivel + "' data-value='" + JSON.stringify(value.iCodNivel) + "'>" + value.vDescripcion + "</option>");                
            });       

            $.each(direccionesgerencia[0], function (key, value) {
                $('#cbodireccionregionalnat').append("<option value='" + value.iCodDirecGerencia + "' data-value='" + JSON.stringify(value.iCodDirecGerencia) + "'>" + value.vNombre + "</option>");
                $('#cbodireccionregionalnatext').append("<option value='" + value.iCodDirecGerencia + "' data-value='" + JSON.stringify(value.iCodDirecGerencia) + "'>" + value.vNombre + "</option>");                
            });
                        
            //$.each(agenciaagraria[0], function (key, value) {
            //    $('#cboagenciaagrarianat').append("<option value='" + value.iCodAgenciaAgraria + "' data-value='" + JSON.stringify(value.iCodAgenciaAgraria) + "'>" + value.vAgencia + "</option>");
            //    $('#cboagenciaagrarianatext').append("<option value='" + value.iCodAgenciaAgraria + "' data-value='" + JSON.stringify(value.iCodAgenciaAgraria) + "'>" + value.vAgencia + "</option>");                
            //});

        }).fail((error) => {
            console.log(error);            
        });

    ///////////////

    // Cargar Provincia ///
    $('#cboprovincia').empty();
    $('#cboprovincia').append("<option value=''>Seleccione</option>");

    $("#cboregion").on('change', function (e) {
        $.when(obtenerProvincia({ vCodDepartamento: $("#cboregion").val() }))
            .done((provincias) => {
                $('#cboprovincia').empty();
                $('#cboprovincia').append("<option value=''>Seleccione</option>");
                $.each(provincias, function (key, value) {
                    $('#cboprovincia').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                });
            }).fail((error) => {
            });
    });

    $('#cboprovincianat').empty();
    $('#cboprovincianat').append("<option value=''>Seleccione</option>");

    $("#cboregionnat").on('change', function (e) {
        $.when(obtenerProvincia({ vCodDepartamento: $("#cboregionnat").val() }))
            .done((provincias) => {
                $('#cboprovincianat').empty();
                $('#cboprovincianat').append("<option value=''>Seleccione</option>");
                $.each(provincias, function (key, value) {
                    $('#cboprovincianat').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                });
            }).fail((error) => {
            });
    });

    $('#cboprovincianatext').empty();
    $('#cboprovincianatext').append("<option value=''>Seleccione</option>");

    $("#cboregionnatext").on('change', function (e) {
        $.when(obtenerProvincia({ vCodDepartamento: $("#cboregionnatext").val() }))
            .done((provincias) => {
                $('#cboprovincianatext').empty();
                $('#cboprovincianatext').append("<option value=''>Seleccione</option>");
                $.each(provincias, function (key, value) {
                    $('#cboprovincianatext').append("<option value='" + value.vCodProvincia + "' data-value='" + JSON.stringify(value.vCodProvincia) + "'>" + value.vNomProvincia + "</option>");
                });
            }).fail((error) => {
            });
    });

    $('#cbodireccionregionalnat').on('change', function (e) {        
        if (e.target.value != "") {
            $.when(obtenerAgenciaAgraria({ iCodDirecGerencia: e.target.value })).done((agencias) => {
                $('#cboagenciaagrarianat').empty();
                $('#cboagenciaagrarianat').append("<option value=''>Seleccione</option>");
                $.each(agencias, function (key, value) {
                    $('#cboagenciaagrarianat').append("<option value='" + value.iCodAgenciaAgraria + "' data-value='" + JSON.stringify(value.iCodAgenciaAgraria) + "'>" + value.vAgencia + "</option>");
                });
            })
        }        
    });

    $('#cbodireccionregional').on('change', function (e) {
        if (e.target.value != "") {
            $.when(obtenerAgenciaAgraria({ iCodDirecGerencia: e.target.value })).done((agencias) => {
                $('#cboagenciaagraria').empty();
                $('#cboagenciaagraria').append("<option value=''>Seleccione</option>");
                $.each(agencias, function (key, value) {
                    $('#cboagenciaagraria').append("<option value='" + value.iCodAgenciaAgraria + "' data-value='" + JSON.stringify(value.iCodAgenciaAgraria) + "'>" + value.vAgencia + "</option>");
                });
            })
        }
    });

    $('#cbodireccionregionalnatext').on('change', function (e) {
        if (e.target.value != "") {
            $.when(obtenerAgenciaAgraria({ iCodDirecGerencia: e.target.value })).done((agencias) => {
                $('#cboagenciaagrarianatext').empty();
                $('#cboagenciaagrarianatext').append("<option value=''>Seleccione</option>");
                $.each(agencias, function (key, value) {
                    $('#cboagenciaagrarianatext').append("<option value='" + value.iCodAgenciaAgraria + "' data-value='" + JSON.stringify(value.iCodAgenciaAgraria) + "'>" + value.vAgencia + "</option>");
                });
            })
        }        
    });


    

    ///////////////

    // Cargar Distrito /////

    $('#cbodistrito').empty();
    $('#cbodistrito').append("<option value=''>Seleccione</option>");

    $("#cboprovincia").on('change', function (e) {
        $.when(obtenerDistrito({ vCodProvincia: $("#cboprovincia").val() }))
            .done((distritos) => {
                $('#cbodistrito').empty();
                $('#cbodistrito').append("<option value=''>Seleccione</option>");
                $.each(distritos, function (key, value) {
                    $('#cbodistrito').append("<option value='" + value.vCodDistrito + "' data-value='" + JSON.stringify(value.vCodDistrito) + "'>" + value.vNomDistrito + "</option>");
                });
            }).fail((error) => {
            });
    });

    $('#cbodistritonat').empty();
    $('#cbodistritonat').append("<option value=''>Seleccione</option>");

    $("#cboprovincianat").on('change', function (e) {
        $.when(obtenerDistrito({ vCodProvincia: $("#cboprovincianat").val() }))
            .done((distritos) => {
                $('#cbodistritonat').empty();
                $('#cbodistritonat').append("<option value=''>Seleccione</option>");
                $.each(distritos, function (key, value) {
                    $('#cbodistritonat').append("<option value='" + value.vCodDistrito + "' data-value='" + JSON.stringify(value.vCodDistrito) + "'>" + value.vNomDistrito + "</option>");
                });
            }).fail((error) => {
            });
    });

    $('#cbodistritonatext').empty();
    $('#cbodistritonatext').append("<option value=''>Seleccione</option>");

    $("#cboprovincianatext").on('change', function (e) {
        $.when(obtenerDistrito({ vCodProvincia: $("#cboprovincianatext").val() }))
            .done((distritos) => {
                $('#cbodistritonatext').empty();
                $('#cbodistritonatext').append("<option value=''>Seleccione</option>");
                $.each(distritos, function (key, value) {
                    $('#cbodistritonatext').append("<option value='" + value.vCodDistrito + "' data-value='" + JSON.stringify(value.vCodDistrito) + "'>" + value.vNomDistrito + "</option>");
                });
            }).fail((error) => {
            });
    });

    // Validaciones
    //txtdninat

    $(".solonumeros").keydown(function (event) {

        // Desactivamos cualquier combinación con shift
        if (event.shiftKey)
            event.preventDefault();

        /*  
            No permite ingresar pulsaciones a menos que sean los siguientes
            KeyCode Permitidos
            keycode 8 Retroceso
            keycode 37 Flecha Derecha
            keycode 39  Flecha Izquierda
            keycode 46 Suprimir
        */
        //No permite mas de 11 caracteres Numéricos
        if (event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
            if ($(this).val().length >= 11)
                event.preventDefault();

        // Solo Numeros del 0 a 9 
        if (event.keyCode < 48 || event.keyCode > 57)
            //Solo Teclado Numerico 0 a 9
            if (event.keyCode < 96 || event.keyCode > 105)
                /*  
                    No permite ingresar pulsaciones a menos que sean los siguietes
                    KeyCode Permitidos
                    keycode 8 Retroceso
                    keycode 37 Flecha Derecha
                    keycode 39  Flecha Izquierda
                    keycode 46 Suprimir
                */
                if (event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
                    event.preventDefault();
    });

    $(".sololetras").keypress(function (key) {
        window.console.log(key.charCode)
        if ((key.charCode < 97 || key.charCode > 122)//letras mayusculas
            && (key.charCode < 65 || key.charCode > 90) //letras minusculas
            && (key.charCode != 45) //retroceso
            && (key.charCode != 241) //ñ
            && (key.charCode != 209) //Ñ
            && (key.charCode != 32) //espacio
            && (key.charCode != 225) //á
            && (key.charCode != 233) //é
            && (key.charCode != 237) //í
            && (key.charCode != 243) //ó
            && (key.charCode != 250) //ú
            && (key.charCode != 193) //Á
            && (key.charCode != 201) //É
            && (key.charCode != 205) //Í
            && (key.charCode != 211) //Ó
            && (key.charCode != 218) //Ú

        )
            return false;
    });

    //$('#chkpersona').change(function (e) {                
    //    if ($(this).is(':checked')) {
    //        $('#txttitulo').html("Registro de Persona Juridica");
    //        $('#tab17').hide();
    //        $('#tab18').show();
    //    } else {
    //        $('#txttitulo').html("Registro de Persona Natural");
    //        $('#tab17').show();
    //        $('#tab18').hide();
    //    }       
    //});

    $('#txtdninat').on('blur', function (e) {
        $('#txtsuuario').val($('#txtdninat').val());
    });

    $('#txtdninatext').on('blur', function (e) {
        $('#Usuarioext').val($('#txtdninatext').val());
    });
    

    $('#btnokTipoPersona').on('click', function (e) {        
        var indicador = 0;
        $("input:radio[name='example-radios']:checked").each(function () {            
            indicador = 1;
            var name = $(this).attr("id");
            valor = $("#" + name).val();
            console.log(valor);
            $('#hdtipopersona').val(valor);
            if (valor == "1") {           
                
                $('#txttitulo').html("Registro de Persona Natural");
                $('#tab17').show();
                $('#tab18').hide();                
            } 
            if (valor == "2") {
                $('#txttitulo').html("Registro de Persona Juridica");
                $('#tab17').hide();
                $('#tab18').show();
            } 
            $('#largemodal').modal('hide');
        });               
        if (indicador == 0) {
            notif({
                msg: "<b>Incorrecto:</b> Debe Seleccionar Tipo de Persona",
                type: "error"
            });
        }
    });

    $('#btnregistro').on('click', function (e) {   
            var entidad = {
            "vRazonSocial": ""
            , "vInicialesSiglas": ""
            , "iCodProcedencia": ""
            , "iCodRegimen": ""
            , "iCodTipoEntidad": ""
            , "vOtros": ""
            , "vRucEmpresa": ""
            , "vDomicilioFiscal": ""
            , "vCodDepartamento": ""
            , "vCodProvincia": ""
            , "vCodDistrito": ""
            , "vTelefono": ""
            , "vCelular": ""
            , "vCorreo": ""
            , "vNombreRepre": ""
            , "vApepatRepre": ""
            , "vApematRepre": ""
            , "bSexo": ""
            , "vDniRepre": ""
            , "vCargoDesempeña": ""
            , "vTelefonoRepre": ""
            , "vCelularRepre": ""
            , "vCorreoRepre": ""
            //SI NO HAY EMPRESA SOLO ENVIAR A PARTIR DE ICODCONVOCATORIA
            , "iCodConvocatoria": 1
            , "vNombres": ""
            , "vApepat": ""
            , "vApemat": ""
            , "bSexoExt": ""
            , "dFechaNacimiento": ""
            , "vDni": ""
            , "vRuc": ""
            , "vCorreoExt": ""
            , "vTelefonoExt": ""
            , "vCelularExt": ""
            , "vCodDepartamentoExt": ""
            , "vCodProvinciaExt": ""
            , "vCodDistritoExt": ""
            , "vDomicilio": ""
            , "iCodNivelInstruccion": ""
            , "iCodDirecGerencia": ""
            , "iCodAgenciaAgraria": ""
            , "vClave": ""
        };

        if ($('#hdtipopersona').val()=="2") {

            console.log('persona juridica');

            if ($("#txtrazonsocial").val().trim() == '')
            {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Razón Social",
                    type: "error"
                });
                $("#txtrazonsocial").focus();
                    return;
            }

            if ($("#txtsiglas").val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Siglas",
                    type: "error"
                });
                $("#txtsiglas").focus();
                return;
            }

            //if ($('#cboprocedencia').val().trim() == '')
            //{
            //    notif({
            //        msg: "<b>Incorrecto:</b> Seleccionar Procedencia",
            //        type: "error"
            //    });
            //     $("#cboprocedencia").focus();
            //    return;
            //}

            if ($('#cboregimen').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Regimen",
                    type: "error"
                });
                $("#cboregimen").focus();
                return;
            }
            
            if ($('#cbotipoentidad').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Entidad",
                    type: "error"
                });
                $("#cbotipoentidad").focus();
                return;
            }

            if ($('#txtruc').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Ruc",
                    type: "error"
                });
                $("#txtruc").focus();
                return;
            } else {
                if ($('#txtruc').val().length < 11) {
                    notif({
                        msg: "<b>Incorrecto:</b> El Ruc debe tener 11 digitos",
                        type: "error"
                    });
                    $("#txtruc").focus();
                    return;
                }
            }            

            if ($('#txtdireccion').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Dirección",
                    type: "error"
                });
                $("#txtdireccion").focus();
                return;
            }
            
            if ($('#cboregion').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Departamento",
                    type: "error"
                });
                $("#cboregion").focus();
                return;
            }  

            if ($('#cboprovincia').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Provincia",
                    type: "error"
                });
                $("#cboprovincia").focus();
                return;
            }

            if ($('#cbodistrito').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Distrito",
                    type: "error"
                });
                $("#cbodistrito").focus();
                return;
            }

            if ($('#txttelefono').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingrese Telefono",
                    type: "error"
                });
                $("#txttelefono").focus();
                return;
            }            

            if ($('#txtcelular').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingrese Celular",
                    type: "error"
                });
                $("#txtcelular").focus();
                return;
            }

            if ($('#txtdomiciliofiscal').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingrese Domicilio Fiscal",
                    type: "error"
                });
                $("#txtdomiciliofiscal").focus();
                return;
            }            

            if ($('#cbodireccionregional').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Direccion Regional",
                    type: "error"
                });
                $("#cbodireccionregional").focus();
                return;
            }

            if ($('#cboagenciaagraria').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Agencia Agraria",
                    type: "error"
                });
                $("#cboagenciaagraria").focus();
                return;
            }

            /// datos del representante

            if ($('#txtnombrerep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Nombres",
                    type: "error"
                });
                $("#txtnombrerep").focus();
                return;
            }

            if ($('#txtapepatrep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Apellido Paterno",
                    type: "error"
                });
                $("#txtapepatrep").focus();
                return;
            }

            if ($('#txtapematrep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Apellido Materno",
                    type: "error"
                });
                $("#txtapematrep").focus();
                return;
            }

            if ($('#cbosexorep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Genero",
                    type: "error"
                });
                $("#cbosexorep").focus();
                return;
            }

            if ($('#txtdnirep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Dni",
                    type: "error"
                });
                $("#txtdnirep").focus();
                return;
            } else {
                if ($('#txtdnirep').val().length < 8) {
                    notif({
                        msg: "<b>Incorrecto:</b> El Dni debe tener 8 digitos",
                        type: "error"
                    });
                    $("#txtdnirep").focus();
                    return;
                }
            }

            if ($('#txtcargorep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Cargo",
                    type: "error"
                });
                $("#txtcargorep").focus();
                return;
            }

            if ($('#txttelrlrep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Telefono",
                    type: "error"
                });
                $("#txttelrlrep").focus();
                return;
            }

            if ($('#txtcelrlrep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Celular",
                    type: "error"
                });
                $("#txtcelrlrep").focus();
                return;
            }

            if ($('#txtcorreorlrep').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Correo",
                    type: "error"
                });
                $("#txtcorreorlrep").focus();
                return;
            }            

            if ($("#txtcorreorlrep").val().trim() != "") {
                if ($("#txtcorreorlrep").val().indexOf('@', 0) == -1 || $("#txtcorreorlrep").val().indexOf('.', 0) == -1) {
                    //                alert('El correo electrónico introducido no es correcto.');
                    notif({
                        msg: "<b>Incorrecto:</b> Ingresar Correo Valido",
                        type: "error"
                    });
                    $("#txtcorreorlrep").focus();
                    return;
                }
            }

            /// datos del extensionista

            if ($('#txtnomnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Nombres",
                    type: "error"
                });
                $("#txtnomnatext").focus();
                return;
            }
            if ($('#txtapepatnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Apellido Paterno",
                    type: "error"
                });
                $("#txtapepatnatext").focus();
                return;
            }

            if ($('#txtapematnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Apellido Materno",
                    type: "error"
                });
                $("#txtapematnatext").focus();
                return;
            }

            if ($("#cbosexonatext").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Genero",
                    type: "error"
                });
                $("#cbosexonatext").focus();
                return;
            } 
                        
            if ($('#txtfechanacnatext').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Fecha Nacimiento",
                    type: "error"
                });
                $("#txtfechanacnatext").focus();
                return;
            }

            if ($('#txtdninatext').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Dni",
                    type: "error"
                });
                $("#txtdninatext").focus();
                return;
            } else {
                if ($('#txtdninatext').val().length < 8) {
                    notif({
                        msg: "<b>Incorrecto:</b> El Dni debe tener 8 digitos",
                        type: "error"
                    });
                    $("#txtdninatext").focus();
                    return;
                }
            }

            if ($('#txtrucnatext').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Ruc",
                    type: "error"
                });
                $("#txtrucnatext").focus();
                return;
            } else {
                if ($('#txtrucnatext').val().length < 11) {
                    notif({
                        msg: "<b>Incorrecto:</b> El Ruc debe tener 11 digitos",
                        type: "error"
                    });
                    $("#txtrucnatext").focus();
                    return;
                }
            }

            if ($('#txtcorreonatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Correo",
                    type: "error"
                });
                $("#txtcorreonatext").focus();
                return;
            }  

            if ($("#txtcorreonatext").val().trim() != "") {
                if ($("#txtcorreonatext").val().indexOf('@', 0) == -1 || $("#txtcorreorlrep").val().indexOf('.', 0) == -1) {
                    //                alert('El correo electrónico introducido no es correcto.');
                    notif({
                        msg: "<b>Incorrecto:</b> Ingresar Correo Valido",
                        type: "error"
                    });
                    $("#txtcorreonatext").focus();
                    return;
                }
            }

            if ($('#txttelnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Telefono",
                    type: "error"
                });
                $("#txttelnatext").focus();
                return;
            }

            if ($('#txtcelnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Celular",
                    type: "error"
                });
                $("#txtcelnatext").focus();
                return;
            }
            
            if ($('#cboregionnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Departamento",
                    type: "error"
                });
                $("#cboregionnatext").focus();
                return;
            }

            if ($('#cboprovincianatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Provincia",
                    type: "error"
                });
                $("#cboprovincianatext").focus();
                return;
            }

            if ($('#cbodistritonatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Distrito",
                    type: "error"
                });
                $("#cbodistritonatext").focus();
                return;
            }

            if ($('#txtdireccionnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Dirección",
                    type: "error"
                });
                $("#txtdireccionnatext").focus();
                return;
            }            

            if ($('#cbonivelnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Nivel de Instrucción",
                    type: "error"
                });
                $("#cbonivelnatext").focus();
                return;
            }

            if ($('#cbodireccionregionalnatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Dirección Regional",
                    type: "error"
                });
                $("#cbodireccionregionalnatext").focus();
                return;
            }

            if ($('#cboagenciaagrarianatext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Agencia Agraria",
                    type: "error"
                });
                $("#cboagenciaagrarianatext").focus();
                return;
            }

            if ($('#txtpasswordrext').val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Contraseña",
                    type: "error"
                });
                $("#txtpasswordrext").focus();
                return;
            }            
            

            entidad.vRazonSocial = $("#txtrazonsocial").val();
            entidad.vInicialesSiglas = $("#txtsiglas").val();
            entidad.iCodProcedencia = 1; //$("#cboprocedencia").val();
            entidad.iCodRegimen = $("#cboregimen").val();
            entidad.iCodTipoEntidad = $("#cbotipoentidad").val();
            entidad.vOtros= "";
            entidad.vRucEmpresa = $("#txtruc").val();
            entidad.vDomicilioFiscal = $("#txtdireccion").val();
            entidad.vCodDepartamento = $("#cboregion").val();
            entidad.vCodProvincia = $("#cboprovincia").val();
            entidad.vCodDistrito = $("#cbodistrito").val();
            entidad.vTelefono = $("#txttelefono").val();
            entidad.vCelular = $("#txtcelular").val();
            entidad.vCorreo= "";
            entidad.vNombreRepre = $("#txtnombrerep").val();
            entidad.vApepatRepre = $("#txtapepatrep").val();
            entidad.vApematRepre = $("#txtapematrep").val();
            entidad.bSexo = $("#cbosexorep").val();
            entidad.vDniRepre = $("#txtdnirep").val();
            entidad.vCargoDesempeña = $("#txtcargorep").val();
            entidad.vTelefonoRepre = $("#txttelrlrep").val();
            entidad.vCelularRepre = $("#txtcelrlrep").val();
            entidad.vCorreoRepre = $("#txtcorreorlrep").val();
//            entidad.vClave = $("#txtpasswordrlrep").val();
            entidad.iCodDirecGerencia = $("#cbodireccionregional").val();
            entidad.iCodAgenciaAgraria = $("#cboagenciaagraria").val();

            /// extensionista

            entidad.vNombres = $("#txtnomnatext").val();
            entidad.vApepat = $("#txtapepatnatext").val();
            entidad.vApemat = $("#txtapematnatext").val();
            entidad.bSexoExt = $("#cbosexonatext").val();
            entidad.dFechaNacimiento = $("#txtfechanacnatext").val();
            entidad.vDni = $("#txtdninatext").val();
            entidad.vRuc = $("#txtrucnatext").val();
            entidad.vCorreoExt = $("#txtcorreonatext").val();
            entidad.vTelefonoExt = $("#txttelnatext").val();
            entidad.vCelularExt = $("#txtcelnatext").val();
            entidad.vCodDepartamentoExt = $("#cboregionnatext").val();
            entidad.vCodProvinciaExt = $("#cboprovincianatext").val();
            entidad.vCodDistritoExt = $("#cbodistritonatext").val();
            entidad.vDomicilio = $("#txtdireccionnatext").val();
            entidad.iCodNivelInstruccion = $("#cbonivelnatext").val();
            entidad.iCodDirecGerencia = $("#cbodireccionregionalnatext").val();
            entidad.iCodAgenciaAgraria = $("#cboagenciaagrarianatext").val();
            entidad.vClave = $("#txtpasswordrext").val();


        } else {
            console.log('persona natural');

            if ($("#txtnomnat").val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Nombres",
                    type: "error"
                });
                $("#txtnomnat").focus();
                return;
            }

            if ($("#txtapepatnat").val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Apellido Paterno",
                    type: "error"
                });
                $("#txtapepatnat").focus();
                return;
            }

            if ($("#txtapematnat").val().trim() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Apellido Materno",
                    type: "error"
                });
                $("#txtapematnat").focus();
                return;
            }

            if ($("#cbosexonat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Genero",
                    type: "error"
                });
                $("#cbosexonat").focus();
                return;
            }            
            if ($('#txtfechanacnat').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Fecha Nacimiento",
                    type: "error"
                });
                $("#txtfechanacnat").focus();
                return;
            }
            if ($('#txtdninat').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Dni",
                    type: "error"
                });
                $("#txtdninat").focus();
                return;
            } else {
                if ($('#txtdninat').val().length < 8) {
                    notif({
                        msg: "<b>Incorrecto:</b> El Dni debe tener 8 digitos",
                        type: "error"
                    });
                    $("#txtdninat").focus();
                    return;
                }
            }

            if ($('#txtrucnat').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Ruc",
                    type: "error"
                });
                $("#txtrucnat").focus();
                return;
            } else {
                if ($('#txtrucnat').val().length < 11) {
                    notif({
                        msg: "<b>Incorrecto:</b> El Ruc debe tener 11 digitos",
                        type: "error"
                    });
                    $("#txtrucnat").focus();
                    return;
                }
            }

            if ($('#txtcorreonat').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Correo",
                    type: "error"
                });
                $("#txtcorreonat").focus();
                return;
            }
            

            if ($("#txtcorreonat").val().trim() != "") {
                if ($("#txtcorreonat").val().indexOf('@', 0) == -1 || $("#txtcorreonat").val().indexOf('.', 0) == -1) {
                    //                alert('El correo electrónico introducido no es correcto.');
                    notif({
                        msg: "<b>Incorrecto:</b> Ingresar Correo Valido",
                        type: "error"
                    });
                    $("#txtcorreonat").focus();
                    return;
                }
            }

            if ($('#txtdireccionnat').val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Dirección",
                    type: "error"
                });
                $("#txtdireccionnat").focus();
                return;
            }            

            if ($("#cboregionnat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Departamento",
                    type: "error"
                });
                $("#cboregionnat").focus();
                return;
            } 

            if ($("#cboprovincianat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Provincia",
                    type: "error"
                });
                $("#cboprovincianat").focus();
                return;
            } 

            if ($("#cbodistritonat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Distrito",
                    type: "error"
                });
                $("#cbodistritonat").focus();
                return;
            } 

            if ($("#txttelnat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Telefono",
                    type: "error"
                });
                $("#txttelnat").focus();
                return;
            } 

            if ($("#txtcelnat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Debe Ingresar Celular",
                    type: "error"
                });
                $("#txtcelnat").focus();
                return;
            }             

            if ($("#cbonivelnat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Nivel de Istrucción",
                    type: "error"
                });
                $("#cbonivelnat").focus();
                return;
            }

            if ($("#cbodireccionregionalnat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Dirección Regional",
                    type: "error"
                });
                $("#cbodireccionregionalnat").focus();
                return;
            }

            if ($("#cboagenciaagrarianat").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Seleccionar Agencia Agraria",
                    type: "error"
                });
                $("#cboagenciaagrarianat").focus();
                return;
            }

            if ($("#txtpassword").val() == '') {
                notif({
                    msg: "<b>Incorrecto:</b> Ingresar Contraseña",
                    type: "error"
                });
                $("#txtpassword").focus();
                return;
            }
                        
            entidad.vNombres = $("#txtnomnat").val();
            entidad.vApepat = $("#txtapepatnat").val();
            entidad.vApemat = $("#txtapematnat").val();
            entidad.bSexoExt = $("#cbosexonat").val();
            entidad.dFechaNacimiento = $("#txtfechanacnat").val();
            entidad.vDni = $("#txtdninat").val();
            entidad.vRuc = $("#txtrucnat").val();
            entidad.vCorreoExt = $("#txtcorreonat").val();
            entidad.vTelefonoExt = $("#txttelnat").val();
            entidad.vCelularExt = $("#txtcelnat").val();
            entidad.vCodDepartamentoExt = $("#cboregionnat").val();
            entidad.vCodProvinciaExt = $("#cboprovincianat").val();
            entidad.vCodDistritoExt = $("#cbodistritonat").val();
            entidad.vDomicilio = $("#txtdireccionnat").val();
            entidad.iCodNivelInstruccion = $("#cbonivelnat").val();
            entidad.iCodDirecGerencia = $("#cbodireccionregionalnat").val();
            entidad.iCodAgenciaAgraria = $("#cboagenciaagrarianat").val();
            entidad.vClave = $("#txtpassword").val();
            entidad.iCodConvocatoria = 1;            
        }
        
        $.post(globals.urlRegistrarExtensionista, entidad)
            .done((respuesta) => {
                console.log('registro correctamente');
                limpiar();
                notif({
                    msg: "<b>Correcto:</b> se ha grabado correctamente",
                    type: "success"
                });
                var url = $('#hdruta').val();

                window.location.href = url;
            }).fail((error) => {
                console.log(error);
            });

    });
});

function limpiar() {
    $('#txtnomnat').val('');
    $('#txtapepatnat').val('');
    $('#txtapematnat').val('');
    $('#cbosexonat').val('');
    $('#txtfechanacnat').val('');
    $('#txtdninat').val('');
    $('#txtrucnat').val('');
    $('#txtcorreonat').val('');
    $('#txttelnat').val('');
    $('#txtcelnat').val('');
    $('#cboregionnat').val('');
    $('#cboprovincianat').val('');
    $('#cbodistritonat').val('');
    $('#txtdireccionnat').val('');
    $('#cbonivelnat').val('');
    $('#cbodireccionregionalnat').val('');
    $('#cboagenciaagrarianat').val('');
    $('#txtpassword').val('');

    $('#txtrazonsocial').val('');

    $('#txtsiglas').val('');
    //$('#cboprocedencia').val('');
    $('#cboregimen').val('');
    $('#cbotipoentidad').val('');
    $('#txtruc').val('');
    $('#txtdireccion').val('');
    $('#cboregion').val('').val('');
    $('#cboprovincia').val('');
    $('#cbodistrito').val('');
    $('#txttelefono').val('');
    $('#txtcelular').val('');
    $('#txtdomiciliofiscal').val('');
    $('#cbodireccionregional').val('');
    $('#cboagenciaagraria').val('');
    $('#txtnombrerep').val('');
    $('#txtapepatrep').val('');
    $('#txtapematrep').val('');
    $('#cbosexorep').val('');
    $('#txtdnirep').val('');
    $('#txtcargorep').val('');
    $('#txttelrlrep').val('');
    $('#txtcelrlrep').val('');
    $('#txtcorreorlrep').val('');
    $('#txtnomnatext').val('');
    $('#txtapepatnatext').val('');
    $('#txtapematnatext').val('');
    $('#cbosexonatext').val('');
    $('#txtfechanacnatext').val('');
    $('#txtdninatext').val('');
    $('#txtrucnatext').val('');
    $('#txtcorreonatext').val('');
    $('#cboregionnatext').val('');
    $('#cboprovincianatext').val('');
    $('#cbodistritonatext').val('');
    $('#txtdireccionnatext').val('');
    $('#cbonivelnatext').val('');
    $('#cbodireccionregionalnatext').val('');
    $('#cboagenciaagrarianatext').val('');
    $('#txtpasswordrext').val('');
    $('#txttelnatext').val('');
    $('#txtcelnatext').val('');
}