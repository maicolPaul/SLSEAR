let general = {
    usuario: 0,
    iCodCorte:0
}
function EjecutarDetalleInformacionGeneral() {


    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    cargarusuario();
       

    $('#btnagregarcorte').on('click', function () {
        $('#modalasignarCorte').modal({ backdrop: 'static', keyboard: false });
        $('#modalasignarCorte').modal('show');  
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

        let datos = {};

        datos.iCodFichaTecnica = general.usuario;
        datos.dFechaInicioReal = $('#dFechaInicio').val();
        datos.dFechaFinReal = $('#dFechaFin').val();

        $.post(globals.urlWebApi + "api/Cortes/InsertarCorteCabecera", datos)
            .done((respuesta) => {
                if (respuesta.iCodCorte != 0) {
                    general.iCodCorte = respuesta.iCodCorte;                    
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });

    });
}