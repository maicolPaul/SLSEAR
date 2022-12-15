
function EjecutarDetalleInformacionGeneral() {
    //window.location.reload(true);
}
$("#txtpassword").keypress(function (event) {
    if (event.which == 13) {
        event.preventDefault();
        $('#btningresar').trigger('click');
    }
});

$('#btningresar').on('click', function (e) {
    //debugger;
    console.log('ingreso');

    if ($("#txtdni").val().trim() == "") {
        $("#txtdni").focus();
        notif({
            msg: "<b>Incorrecto:</b> Debe Ingresar usuario",
            type: "error"
        });
        return;
    }

    if ($("#txtpassword").val().trim() == "") {
        $("#txtpassword").focus();
        notif({
            msg: "<b>Incorrecto:</b> Debe Ingresar password",
            type: "error"
        });
        return;
    }
    loadshow();
    var entidad = { vDni: $("#txtdni").val(), vClave:$("#txtpassword").val()};

    $.post(globals.urlWebApi + "api/Extensionista/Login", entidad)
        .done((respuesta) => {
            //debugger;
            console.log('logeado'); 
            console.log(respuesta);            
            if (respuesta.iCodExtensionista == 0) {
                globals.usuario = 0;
                notif({
                    msg: "<b>Incorrecto:</b> Datos Incorrectos",
                    type: "error"
                });
                loadhide();
                return;
            } else {

                globals.usuario = respuesta.iCodExtensionista;

                var objusuario = { iCodUsuario: respuesta.iCodExtensionista + "|" + respuesta.vNombres + "|" + respuesta.vApepat + "|" + respuesta.vApemat + "|" + respuesta.dFechaUltimoAcceso + "|" + respuesta.iCodEmpresa + "|" + respuesta.vNombrePropuesta +"|"+respuesta.iEnvio };

                $.ajax({
                    url: $('#hdrutasession').val(),
                    type: 'post',
                    dataType: 'json',
                    data: objusuario,
                    cache: false,
                    success: function (data) {
                        console.log(data);
                        if (data.Success) {
                            console.log('inciado session');
                            notif({
                                msg: "<b>Correcto:</b> Ingreso Correctamente",
                                type: "success"
                            }); 
                            //console.log($('#hdruta').val());

                            var url = $('#hdruta').val();

                            window.location.href = url;                            
                           // window.location.href = $("#vRutaHome").val();
                        } else {
                            //error_login();
                        }
                    },
                    error: function () {
                    }
                });

                              
                
            }      
        }).fail((error) => {
            console.log(error);
        });

});