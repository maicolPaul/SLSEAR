
let general = {
    usuario: 0,
    
};

function EjecutarDetalleInformacionGeneral() {
    debugger;
    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    $('#btnGenerarExportado').on('click', function () {
        var datos = {};
        datos.iCodExtensionista = general.usuario;
        openData('POST', globals.urlWebApi + 'api/Costo/ExportarFichaTecnica', datos, '_blank');
    });

    $('#btnEnviar').on('click', function () {
        var datos = {};
        datos.iCodComponente = general.usuario; 

        $.post(globals.urlWebApi + "api/Identificacion/EnviarRegistroEvaluacion", datos)
            .done((respuesta) => {
                console.log(respuesta);
                notif({
                    msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                    type: "success"
                });
                //general.tblPlanSesion.clear().draw();
                //$('#modalplanSesion').modal('hide');
            }).fail((error) => {
                console.log(error);
            });
        
    });
    cargarusuario(27);
}

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


